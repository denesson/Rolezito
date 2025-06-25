// src/app/api/auth/me/route.js
import { NextResponse } from 'next/server'
import jwt           from 'jsonwebtoken'
import prisma        from '../../../../lib/prisma'

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ user: null })

    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { id: true, nome: true, email: true, admin: true }
    })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
