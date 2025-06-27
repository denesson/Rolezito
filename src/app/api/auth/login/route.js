// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'    // Ajuste o path se seu prisma estiver em outro lugar
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request) {
  try {
    const { nome, senha } = await request.json()

    if (!nome || !senha) {
      return NextResponse.json(
        { erro: 'Preencha nome e senha' },
        { status: 400 }
      )
    }

    // Busca usuário pelo nome
    const user = await prisma.usuario.findFirst({ where: { nome } })
    if (!user) {
      return NextResponse.json(
        { erro: 'Usuário não encontrado' },
        { status: 401 }
      )
    }

    // Confere senha
    const validPassword = await bcrypt.compare(senha, user.senha)
    if (!validPassword) {
      return NextResponse.json(
        { erro: 'Senha inválida' },
        { status: 401 }
      )
    }

    // Gera o payload completo para o JWT (sempre inclui role)
const payload = {
  id: user.id, // NÃO "userId"
  nome: user.nome,
  email: user.email,
  admin: user.admin,
  role: user.role || (user.admin ? "admin" : "usuario")
}
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" })

    // Resposta: dados + token (para o localStorage) e cookie httpOnly (retrocompatibilidade)
    const res = NextResponse.json({
      nome: user.nome,
      email: user.email,
      admin: user.admin,
      token,
      role: payload.role
    })
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 24 * 60 * 60 // 2 dias
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
