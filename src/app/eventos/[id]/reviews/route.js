// src/app/api/eventos/[id]/reviews/route.js
import { NextResponse } from "next/server"
import { getCurrentUser } from '../../../../../lib/auth'
import prisma from '../../../../../lib/prisma'


export async function POST(req, { params }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ erro: "Não autorizado" }, { status: 401 })
  const { comentario, rating } = await req.json()
  const eventId = parseInt(params.id, 10)
  if (!comentario || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 })
  }
  const review = await prisma.review.create({
    data: { comentario, rating, userId: user.id, eventId },
  })
  return NextResponse.json(review)
}
