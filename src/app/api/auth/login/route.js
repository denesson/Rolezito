import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, senha } = await request.json()

    if (!email || !senha) {
      return Response.json({ erro: "Preencha email e senha" }, { status: 400 })
    }

    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user) {
      return Response.json({ erro: "Usuário não encontrado" }, { status: 401 })
    }

    const valid = await bcrypt.compare(senha, user.senha)
    if (!valid) {
      return Response.json({ erro: "Senha inválida" }, { status: 401 })
    }

    // Gera token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        admin: user.admin,
        nome: user.nome,
        email: user.email,
      },
      process.env.JWT_SECRET || "segredo",
      { expiresIn: "2d" }
    )

    return Response.json({
      token,
      admin: user.admin,
      nome: user.nome,
      email: user.email,
    }, { status: 200 })
  } catch (error) {
    console.error("Erro no login:", error)
    return Response.json({ erro: "Erro interno do servidor" }, { status: 500 })
  }
}
