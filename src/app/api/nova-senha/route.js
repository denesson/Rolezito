import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { token, novaSenha } = await req.json()

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "segredo")
    const userId = decoded.id

    const senhaHash = await bcrypt.hash(novaSenha, 10)

    await prisma.usuario.update({
      where: { id: userId },
      data: { senha: senhaHash },
    })

    return Response.json({ sucesso: "Senha atualizada com sucesso" })
  } catch (err) {
    console.error("Erro redefinindo senha:", err)
    return Response.json({ erro: "Token inválido ou expirado" }, { status: 400 })
  }
}
