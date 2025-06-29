// src/app/api/eventos/[id]/reviews/route.js
import { NextResponse } from "next/server"
import prisma from "../../../../../../lib/prisma"
import { getCurrentUser } from "../../../../../../lib/auth"

// GET: lista todas as reviews de um evento
export async function GET(req, { params }) {
  const eventId = parseInt(params.id, 10)
  if (Number.isNaN(eventId)) {
    return NextResponse.json({ erro: "ID de evento inválido" }, { status: 400 })
  }

  const reviews = await prisma.review.findMany({
    where: { eventId },
    orderBy: { criadoEm: "desc" },
  })
  return NextResponse.json(reviews)
}

// POST: cria uma nova review
export async function POST(req, { params }) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const eventId = parseInt(params.id, 10)
  if (Number.isNaN(eventId)) {
    return NextResponse.json({ erro: "ID de evento inválido" }, { status: 400 })
  }

  const { comentario, stars } = await req.json()
  if (
    typeof comentario !== "string" ||
    comentario.trim() === "" ||
    typeof stars !== "number" ||
    stars < 1 ||
    stars > 5
  ) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 })
  }

  // Aqui usamos o campo `rating`, que é o que seu schema Prisma espera
  const review = await prisma.review.create({
    data: {
      comentario: comentario.trim(),
      rating: stars,        // ← passa `stars` para `rating`
      userId: user.id,
      eventId,
    },
  })

  return NextResponse.json(review, { status: 201 })
}
