// src/app/eventos/page.jsx
"use client"
import { useState, useEffect } from "react"
import NavMenu from "../components/NavMenu"
import EventCard from "../components/EventCard"

const categoriasMock = [
  "Promoções",
  "Música",
  "Bar",
  "Grátis",
  "Balada",
  "Gastronomia",
  "Festival",
  "Favoritos",
]

export default function EventosPage() {
  const [busca, setBusca] = useState("")
  const [categoria, setCategoria] = useState("")
  const [dataBusca, setDataBusca] = useState("")
  const [eventos, setEventos] = useState([])
  const [favoritos, setFavoritos] = useState(new Set())

  useEffect(() => {
    fetchEventos()
    fetchFavoritos()
  }, [])

  async function fetchEventos() {
    try {
      const resp = await fetch("/api/eventos")
      if (resp.ok) {
        setEventos(await resp.json())
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error)
      setEventos([])
    }
  }

  async function fetchFavoritos() {
    try {
      const resp = await fetch("/api/favoritos", { credentials: "include" })
      if (resp.ok) {
        const data = await resp.json()
        setFavoritos(new Set(data.map(f => f.eventId)))
      } else {
        console.error("Falha ao buscar favoritos:", resp.status)
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error)
    }
  }

  async function handleFavoritar(eventId) {
    try {
      const isFav = favoritos.has(eventId)
      const method = isFav ? "DELETE" : "POST"
      const resp = await fetch("/api/favoritos", {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })
      if (resp.ok) {
        setFavoritos(prev => {
          const copy = new Set(prev)
          isFav ? copy.delete(eventId) : copy.add(eventId)
          return copy
        })
      } else {
        console.error("Erro ao atualizar favorito:", resp.status)
        alert("Erro ao atualizar favorito.")
      }
    } catch (error) {
      console.error("Erro de rede ao favoritar:", error)
      alert("Erro de rede ao favoritar.")
    }
  }

  function eventoTemCategoria(ev, cat) {
    if (!cat) return true
    if (cat === "Favoritos") {
      return favoritos.has(ev.id)
    }
    const lower = cat.toLowerCase()
    if (cat === "Promoções") return ev.destaque === true
    if (cat === "Grátis") return ev.preco?.toLowerCase() === "grátis"
    if (!ev.categoria) return false
    const cats = Array.isArray(ev.categoria)
      ? ev.categoria
      : ev.categoria.split("—").map(c => c.trim())
    return cats.some(c => c.toLowerCase().includes(lower))
  }

  const eventosFiltrados = eventos.filter(ev =>
    eventoTemCategoria(ev, categoria) &&
    (!dataBusca || ev.data?.startsWith(dataBusca)) &&
    (
      ev.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      ev.local?.toLowerCase().includes(busca.toLowerCase())
    )
  )

  return (
    <div className="bg-[#111827] text-white min-h-screen">
      <NavMenu />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center text-[#E11D48]">
          Agenda de Eventos
        </h1>

        {/* Busca e filtro de data */}
        <section className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <input
            type="search"
            placeholder="Buscar eventos, lugares..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-full border border-[#334155] bg-[#1F2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E11D48] text-sm"
          />
          <input
            type="date"
            value={dataBusca}
            onChange={e => setDataBusca(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 rounded-full border border-[#334155] bg-[#1F2937] text-white text-sm"
          />
        </section>

        {/* Filtro de categorias */}
        <section className="mb-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setCategoria("")}
            className={`px-5 py-2 rounded-full font-semibold text-sm ${!categoria
                ? "bg-[#E11D48]"
                : "bg-[#1F2937] border border-[#334155]"
              } text-white hover:bg-[#F43F5E] transition`}
          >
            Todos
          </button>
          {categoriasMock.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-5 py-2 rounded-full font-semibold text-sm ${categoria === cat
                  ? "bg-[#E11D48]"
                  : "bg-[#1F2937] border border-[#334155]"
                } text-white hover:bg-[#F43F5E] transition`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Lista de eventos */}
        {eventosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">
            Nenhum evento encontrado.
          </p>
        ) : (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {eventosFiltrados.map(ev => (
              <EventCard
                key={ev.id}
                evento={ev}
                favorito={favoritos.has(ev.id)}
                onFavoritar={() => handleFavoritar(ev.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
