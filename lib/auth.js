// ========== lib/auth.js ==========
import { cookies } from 'next/headers'
import jwt          from 'jsonwebtoken'
import prisma       from './prisma'

export async function getCurrentUser() {
  const store = await cookies()
  const token = store.get('token')?.value
  if (!token) return null
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    return prisma.usuario.findUnique({ where: { id: userId } })
  } catch {
    return null
  }
}