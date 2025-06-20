// /app/api/usuarios/[id]/route.js
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function PATCH(req, { params }) {
  try {
    const { admin } = await req.json()
    const { id } = params

    if (typeof admin !== "boolean") {
      return Response.json({ erro: "Valor inválido para admin" }, { status: 400 })
    }

    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { admin },
    })
    return Response.json({ ok: true, usuario })
  } catch (e) {
    return Response.json({ erro: "Erro ao atualizar usuário", detalhe: e.message }, { status: 500 })
  }
}
