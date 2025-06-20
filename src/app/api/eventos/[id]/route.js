import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

// PUT: Atualizar evento
export async function PUT(request, { params }) {
  const id = Number(params.id)
  const data = await request.json()
  try {
    const eventoAtualizado = await prisma.evento.update({
      where: { id },
      data: {
        nome: data.nome,
        data: new Date(data.data),
        local: data.local,
        descricao: data.descricao,
        preco: data.preco,
        categoria: data.categoria,
        imagem: data.imagem || "",
        destaque: data.destaque || false,
      },
    })
    return NextResponse.json(eventoAtualizado)
  } catch (err) {
    return NextResponse.json({ erro: "Erro ao atualizar evento" }, { status: 500 })
  }
}

// DELETE: Excluir evento
export async function DELETE(request, { params }) {
  const id = Number(params.id);
  try {
    await prisma.evento.delete({ where: { id } });
    // status 204 não pode ter body!
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error("Erro ao excluir evento:", err);
    return NextResponse.json({ erro: "Erro ao excluir evento" }, { status: 500 });
  }
}
