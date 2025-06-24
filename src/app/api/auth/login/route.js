import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt    from 'jsonwebtoken'


export async function POST(req) {
  const { nome, senha } = await req.json()
  if (!nome || !senha) {
    return NextResponse.json({ erro: 'Preencha nome e senha' }, { status: 400 })
  }

  const user = await prisma.usuario.findFirst({ where: { nome } })
  if (!user) {
    return NextResponse.json({ erro: 'Usuário não encontrado' }, { status: 401 })
  }
  if (!await bcrypt.compare(senha, user.senha)) {
    return NextResponse.json({ erro: 'Senha inválida' }, { status: 401 })
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2d' })
  const res = NextResponse.json({ nome: user.nome, email: user.email, admin: user.admin })
  res.cookies.set({
    name:      'token',
    value:     token,
    httpOnly:  true,
    secure:    process.env.NODE_ENV === 'production',
    path:      '/',
    maxAge:    2 * 24 * 60 * 60,
    sameSite:  'lax',
  })
  return res
}
