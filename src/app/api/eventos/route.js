import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import webpush from "web-push"
import jwt from "jsonwebtoken" // npm i jsonwebtoken
import { getCurrentUser } from "../../../../lib/auth" // Função utilitária para obter usuário atual

const prisma = new PrismaClient()

// Configurar VAPID
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const privateKey = process.env.VAPID_PRIVATE_KEY

if (!publicKey || !privateKey) {
  console.error('VAPID keys não encontradas. Verifique NEXT_PUBLIC_VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY no .env.local')
} else {
  webpush.setVapidDetails(
    'mailto:seu@email.com',
    publicKey,
    privateKey
  )
}

// Função utilitária: checa permissão no POST (usando JWT no header)
async function authorize(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null
  const token = authHeader.replace("Bearer ", "")
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    if (user.role === "admin" || user.role === "produtor") return user
    return null
  } catch {
    return null
  }
}

// GET: Listar eventos paginados (para scroll infinito)
export async function GET(request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 9)
    const skip = (page - 1) * limit

    // Só filtra por produtor se NÃO for admin
    const where = user.role === "produtor" ? { produtorId: user.id } : {}

    const eventos = await prisma.evento.findMany({
      where,
      orderBy: { data: "asc" },
      skip,
      take: limit,
    })
    const total = await prisma.evento.count({ where })
    return NextResponse.json({ eventos, total })
  } catch (err) {
    console.error("Erro GET /api/eventos:", err)
    return NextResponse.json({ erro: "Erro ao buscar eventos" }, { status: 500 })
  }
}

// POST: Cadastrar evento (SOMENTE ADMIN/PRODUTOR) e disparar notificações
export async function POST(request) {
  // Protege o cadastro (precisa token válido e role correto)
  const user = await authorize(request)
  if (!user) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 403 })
  }

  try {
    const data = await request.json()
    const { nome, data: dataEvento, local, descricao, preco, categoria, imagem, destaque } = data

    if (!nome || !dataEvento || !local || !descricao || !preco || !categoria) {
      return NextResponse.json({ erro: "Preencha todos os campos" }, { status: 400 })
    }

    const novoEvento = await prisma.evento.create({
      data: {
        nome,
        data: new Date(dataEvento),
        local,
        descricao,
        preco,
        categoria,
        imagem: imagem || "",
        destaque: destaque || false,
        produtorId: user.id,
      }
    })

    // Dispara push (se as chaves estiverem carregadas)
    if (publicKey && privateKey) {
      const subs = await prisma.subscription.findMany()
      const payload = JSON.stringify({
        title: "Novo evento no Rolezito!",
        body: novoEvento.nome,
        url: `/eventos/${novoEvento.id}`
      })

      await Promise.all(
        subs.map(sub =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          ).catch(err => {
            if (err.statusCode === 410 || err.statusCode === 404) {
              return prisma.subscription.delete({ where: { endpoint: sub.endpoint } })
            }
          })
        )
      )
    }

    return NextResponse.json(novoEvento, { status: 201 })
  } catch (err) {
    console.error("Erro POST /api/eventos:", err)
    return NextResponse.json({ erro: "Erro ao cadastrar evento" }, { status: 500 })
  }
}
