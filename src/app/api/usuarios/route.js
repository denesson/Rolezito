import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const lista = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true, admin: true }
    })
    return Response.json(lista)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}
