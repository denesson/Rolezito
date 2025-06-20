import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { nome, email, senha, confirmarSenha } = await request.json()

    if (!nome || !email || !senha || !confirmarSenha) {
      return Response.json({ erro: "Preencha todos os campos" }, { status: 400 })
    }

    if (senha !== confirmarSenha) {
      return Response.json({ erro: "Senhas não coincidem" }, { status: 400 })
    }

    const existe = await prisma.usuario.findFirst({
      where: { OR: [{ nome }, { email }] }
    })
    if (existe) {
      return Response.json({ erro: "Usuário ou e-mail já cadastrado" }, { status: 409 })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaCriptografada }
    })

    return Response.json({ sucesso: "Cadastro realizado com sucesso" }, { status: 201 })
  } catch (erro) {
    console.error("Erro no cadastro:", erro)
    return Response.json({ erro: "Erro interno do servidor" }, { status: 500 })
  }
}
