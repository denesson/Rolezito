// src/app/api/admin/route.js
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") global.prisma = prisma

/** GET /api/admin — lista todos os eventos */
export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({ orderBy: { data: "asc" } })
    return NextResponse.json(eventos)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erro ao listar eventos" }, { status: 500 })
  }
}

/** POST /api/admin — cria um novo evento */
export async function POST(request) {
  try {
    const { nome, data, local, descricao, preco, categoria, imagem, destaque } =
      await request.json()

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
