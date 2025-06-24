// src/app/api/eventos/[id]/route.js
import { NextResponse } from "next/server"
import prisma  from "../../../../../lib/prisma"   // assume que seu prisma.js faz export default
                         
/**
 * GET /api/eventos/:id
 * Retorna os dados de um evento pelo id.
 */
export async function GET(req, { params }) {
  const id = parseInt(params.id, 10)
  try {
    const evento = await prisma.evento.findUnique({ where: { id } })
    if (!evento) {
      return NextResponse.json({ erro: "Evento não encontrado" }, { status: 404 })
    }
    return NextResponse.json(evento)
  } catch (err) {
    console.error("Erro ao buscar evento:", err)
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 })
  }
}

/**
 * PUT /api/eventos/:id
 * Atualiza os dados de um evento.
 */
export async function PUT(req, { params }) {
  const id = parseInt(params.id, 10)
  const data = await req.json()

  try {
    const eventoAtualizado = await prisma.evento.update({
      where: { id },
      data: {
        nome:      data.nome,
        data:      new Date(data.data),
        local:     data.local,
        descricao: data.descricao,
        preco:     data.preco,
        categoria: data.categoria,
        imagem:    data.imagem ?? "",
        destaque:  data.destaque ?? false,
      },
    })
    return NextResponse.json(eventoAtualizado)
  } catch (err) {
    console.error("Erro ao atualizar evento:", err)
    const status = err.code === "P2025" ? 404 : 500
    const msg    = err.code === "P2025" ? "Evento não encontrado" : "Erro ao atualizar evento"
    return NextResponse.json({ erro: msg }, { status })
  }
}

/**
 * DELETE /api/eventos/:id
 * Remove um evento pelo id.
 */
export async function DELETE(req, { params }) {
  const id = parseInt(params.id, 10)
  try {
    await prisma.evento.delete({ where: { id } })
    // 204 No Content (sem body)
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error("Erro ao excluir evento:", err)
    const status = err.code === "P2025" ? 404 : 500
    const msg    = err.code === "P2025" ? "Evento não encontrado" : "Erro ao excluir evento"
    return NextResponse.json({ erro: msg }, { status })
  }
}
