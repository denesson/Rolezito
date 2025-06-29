// PATCH /api/admin/eventos/:id/destaque
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

async function authorize(req) {
  const auth = req.headers.get("authorization")
  if (!auth) return null
  const token = auth.replace("Bearer ", "")
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch { return null }
}

export async function PATCH(req, { params }) {
  const user = await authorize(req)
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 403 })

  const eventId = parseInt(params.id, 10)
  if (isNaN(eventId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

  const evento = await prisma.evento.findUnique({ where: { id: eventId } })
  if (!evento) return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 })

  // Só o admin ou o produtor dono do evento pode destacar/desmarcar
  if (user.role !== "admin" && evento.produtorId !== user.id)
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 })

  // Recebe tanto destaque normal quanto destaquePagoAte
  const { destaque, destaquePagoAte } = await req.json()

  // Prepara os campos que serão atualizados
  let data = { destaque: !!destaque }
  if (destaquePagoAte) {
    // Se mandou data, adiciona ou atualiza o destaque pago
    data.destaquePagoAte = new Date(destaquePagoAte)
  }

  const atualizado = await prisma.evento.update({
    where: { id: eventId },
    data
  })

  return NextResponse.json(atualizado)
}
