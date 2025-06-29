import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

// Helper para pegar o usuário logado via cookie JWT
async function getCurrentUser() {
  const store = await cookies()
  const token = store.get('token')?.value
  if (!token) return null
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET) // <-- Troca aqui!
    return await prisma.usuario.findUnique({ where: { id } })
  } catch {
    return null
  }
}

/**
 * GET /api/eventos/recomendados
 * Retorna eventos recomendados com base nas categorias dos favoritos do usuário.
 */
export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 })
  }

  // Pega os IDs de eventos favoritados
  const favs = await prisma.favorito.findMany({
    where: { userId: user.id },
    select: { eventId: true },
  })
  const favoriteIds = favs.map(f => f.eventId)

  // Busca categorias dos eventos favoritados
  const favoriteEvents = await prisma.evento.findMany({
    where: { id: { in: favoriteIds } },
  })
  const categories = [...new Set(favoriteEvents.map(e => e.categoria))]

  // Recomenda eventos de mesmas categorias, excluindo já favoritados
  const recommended = await prisma.evento.findMany({
    where: {
      categoria: { in: categories },
      id: { notIn: favoriteIds },
    },
    orderBy: { data: 'asc' },
  })

  return NextResponse.json(recommended)
}
