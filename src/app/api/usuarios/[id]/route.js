// src/app/api/usuarios/[id]/route.js
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(request, { params }) {
  try {
    const { id } = params
    const { admin } = await request.json()

    if (typeof admin !== "boolean") {
      return NextResponse.json(
        { erro: "Valor inválido para admin" },
        { status: 400 }
      )
    }

    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { admin },
    })

    return NextResponse.json({ ok: true, usuario })
  } catch (e) {
    console.error("Erro ao atualizar usuário:", e)
    return NextResponse.json(
      { erro: "Erro ao atualizar usuário", detalhe: e.message },
      { status: 500 }
    )
  }
}

export const config = {
  // Opcional: limites de body, regionalização, etc.
  runtime: 'nodejs',
}
