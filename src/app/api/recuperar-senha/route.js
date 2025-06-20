import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import { Resend } from "resend"

const prisma = new PrismaClient()
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { email } = await req.json()
    if (!email) return Response.json({ erro: "Email obrigatório" }, { status: 400 })

    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user) return Response.json({ erro: "Email não encontrado" }, { status: 404 })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    })

    const link = `https://rolezito.vercel.app/nova-senha?token=${token}`

    await resend.emails.send({
      from: process.env.RESEND_EMAIL,
      to: email,
      subject: "Recuperação de senha - Rolezito",
      html: `
        <p>Olá ${user.nome},</p>
        <p>Você solicitou a recuperação de senha.</p>
        <p><a href="${link}" style="padding:10px 20px; background:#007bff; color:#fff; border-radius:6px; text-decoration:none">Redefinir Senha</a></p>
        <p>Ou copie este link: <br/> ${link}</p>
      `,
    })

    return Response.json({ sucesso: "Link de recuperação enviado com sucesso" })
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err)
    return Response.json({ erro: "Erro interno ao enviar email" }, { status: 500 })
  }
}
