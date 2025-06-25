// src/app/api/admin/[id]/route.js
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = global.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") global.prisma = prisma

/** GET /api/admin/:id — busca um único evento */
export async function GET(request, { params }) {
  console.log("[API admin/:id GET] params:", params)
  const id = Number(params.id)
  const ev = await prisma.evento.findUnique({ where: { id } })
  if (!ev) {
    console.log(`[API admin/:id GET] Evento ${id} não encontrado`)
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 })
  }
  return NextResponse.json(ev)
}

/** PUT /api/admin/:id — atualiza um evento */
export async function PUT(request, { params }) {
  console.log("[API admin/:id PUT] params:", params)
  const id = Number(params.id)
  const body = await request.json()
  console.log(`[API admin/:id PUT] body:`, body)
  try {
    const updated = await prisma.evento.update({
      where: { id },
      data: {
        nome:      body.nome,
        ...(body.data && { data: new Date(body.data) }),
        local:     body.local,
        descricao: body.descricao,
        preco:     body.preco,
        categoria: body.categoria,
        imagem:    body.imagem,
        destaque:  body.destaque,
      },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error("[API admin/:id PUT] Erro ao atualizar:", err)
    const status = err.code === "P2025" ? 404 : 500
    return NextResponse.json({ error: "Não foi possível atualizar" }, { status })
  }
}

/** DELETE /api/admin/:id — remove um evento */
export async function DELETE(request, { params }) {
  const id = Number(params.id)
  try {
    // 1) apagar reviews & favoritos que dependem deste evento
    await prisma.review.deleteMany({  where: { eventId: id } })
    await prisma.favorito.deleteMany({ where: { eventId: id } })

    // 2) agora sim apagar o evento
    await prisma.evento.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[API admin/:id DELETE] Erro ao excluir:", err)
    // se ainda falhar por alguma outra FK
    const status = err.code === "P2025" ? 404 : 500
    return NextResponse.json(
      { error: "Não foi possível excluir. Verifique dependências." },
      { status }
    )
  }
}
