import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import prisma              from '../../../../lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  const favs = await prisma.favorito.findMany({
    where:  { userId: user.id },
    select: { eventId: true },
  })
  return NextResponse.json(favs)
}
export async function POST(req) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  const { eventId } = await req.json()
  await prisma.favorito.create({ data: { userId: user.id, eventId } })
  return NextResponse.json({ success: true })
}
export async function DELETE(req) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  const { eventId } = await req.json()
  await prisma.favorito.deleteMany({ where: { userId: user.id, eventId } })
  return NextResponse.json({ success: true })
}