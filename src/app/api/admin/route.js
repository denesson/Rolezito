// src/app/api/admin/route.js
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

// evita múltiplas instâncias no dev
const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") global.prisma = prisma

/** GET /api/admin — lista todos os eventos */
export async function GET() {
  const eventos = await prisma.evento.findMany({
    orderBy: { data: "asc" }
  })
  return NextResponse.json(eventos)
}

/** POST /api/admin — cria um novo evento */
export async function POST(req) {
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
}
