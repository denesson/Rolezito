// src/app/api/admin/route.js
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken" // instale: npm install jsonwebtoken

const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") global.prisma = prisma

// Função utilitária para checar permissão:
async function authorize(req) {
  const auth = req.headers.get("authorization")
  if (!auth) return null
  const token = auth.replace("Bearer ", "")
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    if (user.role === "admin" || user.role === "produtor") return user
    return null
  } catch {
    return null
  }
}

/** GET /api/admin — lista todos os eventos */
export async function GET(req) {
  const user = await authorize(req)
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }

  try {
    const eventos = await prisma.evento.findMany({ orderBy: { data: "asc" } })
    return NextResponse.json(eventos)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erro ao listar eventos" }, { status: 500 })
  }
}

/** POST /api/admin — cria um novo evento */
export async function POST(req) {
  const user = await authorize(req)
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 })
  }

  try {
    const { nome, data, local, descricao, preco, categoria, imagem, destaque } =
      await req.json()

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
    console.error(err)
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 })
  }
}
