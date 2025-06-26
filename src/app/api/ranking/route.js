import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
const prisma = new PrismaClient()

export async function GET() {
  const eventos = await prisma.evento.findMany({
    include: { reviews: true }
  })
  const ranking = eventos
    .map(ev => ({
      ...ev,
      rating: ev.reviews.length
        ? ev.reviews.reduce((sum, r) => sum + r.stars, 0) / ev.reviews.length
        : 0
    }))
    .sort((a, b) => b.rating - a.rating)
  return NextResponse.json(ranking)
}
