// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'    // 4 níveis para chegar em src/lib/prisma.js
import bcrypt from 'bcryptjs'
import jwt    from 'jsonwebtoken'

export async function POST(request) {
  try {
    const { nome, senha } = await request.json()

    if (!nome || !senha) {
      return NextResponse.json(
        { erro: 'Preencha nome e senha' },
        { status: 400 }
      )
    }

    const user = await prisma.usuario.findFirst({
      where: { nome }
    })
    if (!user) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' },
        { status: 401 }
      )
    }

    const validPassword = await bcrypt.compare(senha, user.senha)
    if (!validPassword) {
      return NextResponse.json(
        { erro: 'Senha inválida' },
        { status: 401 }
      )
    }

    // Gera o JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    )

    // Prepara a resposta com o cookie
    const res = NextResponse.json(
      { nome: user.nome, email: user.email, admin: user.admin }
    )
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 24 * 60 * 60  // 2 dias em segundos
    })

    return res

  } catch (err) {
    console.error('🔥 erro no /api/auth/login:', err)
    return NextResponse.json(
      { erro: 'Erro interno no servidor.' },
      { status: 500 }
    )
  }
}
