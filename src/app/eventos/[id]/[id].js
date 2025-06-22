"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import NavMenu from "../../../components/NavMenu"

export default function EventoDetalhe() {
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvento() {
      try {
        const resp = await fetch(`/api/eventos/${id}`)
        const data = await resp.json()
        setEvento(data)
      } catch {
        setEvento(null)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchEvento()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111827] text-center text-white py-20">
        Carregando evento...
      </div>
    )
  }

  if (!evento) {
    return (
      <div className="min-h-screen bg-[#111827] text-center text-red-400 py-20">
        Evento não encontrado.
      </div>
    )
  }

  return (
    <>
      <NavMenu />
      <main className="bg-[#111827] text-white min-h-screen px-4 py-10 max-w-2xl mx-auto">
        <Link href="/eventos" className="text-sm text-[#E11D48] hover:underline mb-6 inline-block">
          ← Voltar para eventos
        </Link>

        <h1 className="text-3xl font-bold mb-2">{evento.nome}</h1>
        <p className="text-sm text-gray-400 mb-4">
          {new Date(evento.data).toLocaleString("pt-BR")} • {evento.local}
        </p>

        {evento.imagem && (
          <img
            src={evento.imagem}
            alt={evento.nome}
            className="w-full h-auto rounded-xl mb-6 border border-[#334155]"
          />
        )}

        <p className="text-gray-300 mb-4">{evento.descricao}</p>

        <div className="text-sm">
          <span className="font-semibold text-white">Categoria:</span>{" "}
          {evento.categoria || "Não informada"}
        </div>

        <div className="mt-2 text-green-400 font-bold text-lg">
          {evento.preco || "Grátis"}
        </div>
      </main>
    </>
  )
}
