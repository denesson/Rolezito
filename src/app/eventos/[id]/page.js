"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import NavMenu from "../../components/NavMenu"

export default function Home() {
  const [eventos, setEventos] = useState([])
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos")
  const [loading, setLoading] = useState(true)

  const categorias = ["Todos", "Promoções", "Música", "Bar", "Balada"]

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

  const eventosFiltrados =
    categoriaAtiva === "Todos"
      ? eventos
      : eventos.filter((evento) =>
          evento.categoria?.toLowerCase().includes(categoriaAtiva.toLowerCase())
        )

  if (loading) {
    return (
      <div className="text-center py-20 text-[#F43F5E] bg-[#111827] min-h-screen">
        Carregando eventos...
      </div>
    )
  }

  return (
    <>
      <NavMenu />
      <main className="bg-[#111827] text-white min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-[#E11D48] mb-8">
            Rolezito
          </h1>

          {/* Botões de filtro */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  categoriaAtiva === cat
                    ? "bg-[#E11D48] text-white"
                    : "bg-[#1F2937] text-white border border-[#334155] hover:bg-[#334155]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lista de eventos */}
          <div className="space-y-6">
            {eventosFiltrados.map((evento) => (
              <Link
                key={evento.id}
                href={`/eventos/${evento.id}`}
                className="block bg-[#1F2937] border border-[#334155] rounded-xl p-5 shadow-md hover:shadow-lg transition"
              >
                <h2 className="font-semibold text-lg text-white">{evento.nome}</h2>
                <p className="text-sm text-gray-400">
                  {evento.data ? new Date(evento.data).toLocaleString("pt-BR") : ""} •{" "}
                  {evento.local}
                </p>
                <p className="text-sm mt-2 text-gray-300">{evento.descricao}</p>
                {evento.preco?.toLowerCase().includes("grátis") && (
                  <span className="block mt-1 font-bold text-green-400">Grátis</span>
                )}
              </Link>
            ))}
          </div>

          {/* Rodapé */}
          <footer className="text-center text-xs text-[#9CA3AF] py-10">
            Desenvolvido por Denesson Barreto © {new Date().getFullYear()}
          </footer>
        </div>
      </main>
    </>
  )
}
