import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Singleton do Prisma para evitar erro em dev hot reload
const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") global.prisma = prisma

// Função utilitária para checar permissão no token (admin ou produtor)
async function authorize(req) {
  const auth = req.headers.get("authorization")
  if (!auth) return null
  const token = auth.replace("Bearer ", "")
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    if (user.role === "admin" || user.role === "produtor" || user.admin === true) {
      return user
    }
    return null
  } catch (err) {
    console.error("JWT inválido:", err.message)
    return null
  }
}

// GET /api/admin/eventos — lista eventos do produtor OU todos se admin
export async function GET(req) {
  const user = await authorize(req)
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }
  try {
    // Só vê seus eventos se for produtor, admin vê todos
    const where = user.role === "produtor"
      ? { produtorId: user.id }
      : {}

    const eventos = await prisma.evento.findMany({
      where,
      orderBy: { data: "asc" }
    })
    return NextResponse.json(eventos)
  } catch (err) {
    console.error("Erro ao listar eventos:", err)
    return NextResponse.json({ error: "Erro ao listar eventos" }, { status: 500 })
  }
}

// POST /api/admin/eventos — cria novo evento vinculado ao usuário criador
export async function POST(req) {
  const user = await authorize(req)
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }
  try {
    const body = await req.json()
    const {
      nome,
      data: dataEvento,
      local,
      descricao,
      preco,
      categoria,
      imagem,
      destaque
    } = body

    // Validação mínima
    if (!nome || !dataEvento || !local || !descricao || !preco || !categoria) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios" }, { status: 400 })
    }

    const novo = await prisma.evento.create({
      data: {
        nome,
        data: new Date(dataEvento),
        local,
        descricao,
        preco,
        categoria,
        imagem: imagem || "",
        destaque: destaque ?? false,
        produtorId: user.id, // <-- vincula o evento ao usuário que criou
      },
    })
    return NextResponse.json(novo, { status: 201 })
  } catch (err) {
    console.error("Erro ao criar evento:", err)
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 })
  }
}
