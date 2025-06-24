// src/app/api/eventos/[id]/reviews/route.js
import { NextResponse } from "next/server"
import prisma                from "../../../../../../lib/prisma"     // ou use o path relativo correto
import jwt                   from "jsonwebtoken"
import { cookies }           from "next/headers"

// helper para ler o usuário logado via cookie JWT
async function getCurrentUser() {
  const store = await cookies()
  const token = store.get("token")?.value
  if (!token) return null
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    return await prisma.usuario.findUnique({ where: { id: userId } })
  } catch {
    return null
  }
}

// GET: lista todas as reviews de um evento
export async function GET(req, { params }) {
  const eventId = parseInt(params.id, 10)
  const revs = await prisma.review.findMany({
    where: { eventId },
    orderBy: { criadoEm: "desc" },
  })
  return NextResponse.json(revs)
}

// POST: cria uma nova review
export async function POST(req, { params }) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 })
  }

  const eventId = parseInt(params.id, 10)
  const { comentario, rating } = await req.json()
  if (!comentario || rating < 1 || rating > 5) {
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 })
  }

  const rev = await prisma.review.create({
    data: {
      comentario,
      rating,
      userId: user.id,
      eventId,
    },
  })
  return NextResponse.json(rev, { status: 201 })
}
