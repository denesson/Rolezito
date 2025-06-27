import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import webpush from "web-push"

const prisma = new PrismaClient()

// Configurar VAPID (defina suas variáveis em .env.local)
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

// GET: Listar todos eventos
export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({ orderBy: { data: "asc" } })
    return NextResponse.json(eventos)
  } catch (err) {
    console.error("Erro GET /api/eventos:", err)
    return NextResponse.json({ erro: "Erro ao buscar eventos" }, { status: 500 })
  }
}

// POST: Cadastrar evento e disparar notificações
export async function POST(request) {
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
      }
    })

    // Se as chaves não estiverem carregadas, não tenta notificar
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
