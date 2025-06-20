"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEventos() {
      try {
        const resp = await fetch("/api/eventos")
        const data = await resp.json()
        setEventos(data)
      } catch {
        setEventos([])
      } finally {
        setLoading(false)
      }
    }
    fetchEventos()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-20 text-[#F43F5E] bg-[#111827] min-h-screen">
        Carregando eventos...
      </div>
    )
  }

  return (
    <main className="bg-[#111827] text-white min-h-screen px-4 py-10 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-[#E11D48] mb-8">
        Rolezito
      </h1>

      {/* Filtros visuais */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button className="bg-[#E11D48] text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-[#F43F5E] transition">Todos</button>
        <button className="bg-[#1F2937] text-white px-4 py-1 rounded-full text-sm font-medium border border-[#334155] hover:bg-[#334155] transition">Promoções</button>
        <button className="bg-[#1F2937] text-white px-4 py-1 rounded-full text-sm font-medium border border-[#334155] hover:bg-[#334155] transition">Música</button>
        <button className="bg-[#1F2937] text-white px-4 py-1 rounded-full text-sm font-medium border border-[#334155] hover:bg-[#334155] transition">Bar</button>
        <button className="bg-[#1F2937] text-white px-4 py-1 rounded-full text-sm font-medium border border-[#334155] hover:bg-[#334155] transition">Balada</button>
      </div>

      {/* Lista de eventos */}
      <div className="space-y-6">
        {eventos.map((evento) => (
          <Link
            key={evento.id}
            href={`/eventos/${evento.id}`}
            className="block bg-[#1F2937] border border-[#334155] rounded-xl p-5 shadow-md hover:shadow-lg transition"
          >
            <h2 className="font-semibold text-lg text-white">{evento.nome}</h2>
            <p className="text-sm text-gray-400">
              {evento.data ? new Date(evento.data).toLocaleString("pt-BR") : ""} • {evento.local}
            </p>
            <p className="text-sm mt-2 text-gray-300">{evento.descricao}</p>
            <span className="block mt-1 font-bold text-green-400">{evento.preco}</span>
          </Link>
        ))}
      </div>

      {/* Rodapé */}
      <footer className="text-center text-xs text-[#9CA3AF] py-10">
        Desenvolvido por Denesson Barreto © {new Date().getFullYear()}
      </footer>
    </main>
  )
}
