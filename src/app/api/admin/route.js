// src/app/api/admin/route.js
import { NextResponse } from "next/server"

let eventos = [
  {
    id: 1,
    nome: "Pagode da Praça",
    data: "2025-06-28T21:00:00",
    local: "Praça Central",
    preco: "Grátis",
    descricao: "A melhor roda de samba da cidade.",
    imagem: "",
    categoria: "Música",
    destaque: false,
  }
]

// GET: lista todos os eventos
export async function GET() {
  return NextResponse.json(eventos)
}

// POST: cria novo evento
export async function POST(req) {
  const body = await req.json()
  const id = eventos.length ? Math.max(...eventos.map(ev => ev.id)) + 1 : 1
  const novoEvento = { id, ...body }
  eventos.push(novoEvento)
  return NextResponse.json(novoEvento)
}

// PUT: edita evento (chamado em /api/admin/{id})
export async function PUT(req) {
  const url = new URL(req.url)
  const id = parseInt(url.pathname.split('/').pop(), 10)
  const body = await req.json()
  const idx = eventos.findIndex(ev => ev.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 })
  }
  eventos[idx] = { ...eventos[idx], ...body }
  return NextResponse.json(eventos[idx])
}

// DELETE: remove evento (chamado em /api/admin/{id})
export async function DELETE(req) {
  const url = new URL(req.url)
  const id = parseInt(url.pathname.split('/').pop(), 10)
  const idx = eventos.findIndex(ev => ev.id === id)
  if (idx === -1) {
    return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 })
  }
  eventos.splice(idx, 1)
  return NextResponse.json({ ok: true })
}
