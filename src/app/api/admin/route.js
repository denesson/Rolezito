import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") global.prisma = prisma

// Função utilitária para checar permissão de admin/produtor no token
async function authorize(req) {
  const auth = req.headers.get("authorization")
  if (!auth) {
    console.warn("Authorization header ausente")
    return null
  }
  const token = auth.replace("Bearer ", "")
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    // DEBUG: log do token decodificado (comente em produção)
    // console.log("Payload JWT:", user)
    // Checa role OU admin:true
    if (
      user.role === "admin" ||
      user.role === "produtor" ||
      user.admin === true // retrocompatibilidade
    ) {
      return user
    }
    console.warn("Token sem permissão:", user)
    return null
  } catch (err) {
    console.error("JWT inválido:", err.message)
    return null
  }
}

// GET /api/admin — lista todos os eventos (autenticado)
export async function GET(req) {
  const user = await authorize(req)
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: { data: "asc" }
    })
    return NextResponse.json(eventos)
  } catch (err) {
    console.error("Erro ao listar eventos:", err)
    return NextResponse.json({ error: "Erro ao listar eventos" }, { status: 500 })
  }
}

// POST /api/admin — cria novo evento (autenticado)
export async function POST(req) {
  const user = await authorize(req)
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }
  try {
    const { nome, data, local, descricao, preco, categoria, imagem, destaque } = await req.json()
    const novo = await prisma.evento.create({
      data: {
        nome,
        data: data ? new Date(data) : new Date(),
        local,
        descricao,
        preco,
        categoria,
        imagem: imagem || "",
        destaque: destaque ?? false,
      },
    })
    return NextResponse.json(novo, { status: 201 })
  } catch (err) {
    console.error("Erro ao criar evento:", err)
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 })
  }
}
