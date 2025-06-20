import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// GET: Listar todos eventos
export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({ orderBy: { data: "asc" } })
    return NextResponse.json(eventos)
  } catch (err) {
    return NextResponse.json({ erro: "Erro ao buscar eventos" }, { status: 500 })
  }
}

// POST: Cadastrar evento
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
      },
    })

    return NextResponse.json(novoEvento, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ erro: "Erro ao cadastrar evento" }, { status: 500 })
  }
}
