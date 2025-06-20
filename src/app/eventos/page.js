"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import NavMenu from "../components/NavMenu"

const categoriasMock = [
  "Promoções", "Música", "Bar", "Grátis", "Balada", "Gastronomia", "Festival"
]

export default function EventosPage() {
  const [busca, setBusca] = useState("")
  const [categoria, setCategoria] = useState("")
  const [dataBusca, setDataBusca] = useState("")
  const [eventos, setEventos] = useState([])
  const [favoritos, setFavoritos] = useState([])

  useEffect(() => {
    async function fetchEventos() {
      try {
        const resp = await fetch("/api/eventos")
        if (resp.ok) {
          const lista = await resp.json()
          setEventos(lista)
        }
      } catch {
        setEventos([])
      }
    }
    fetchEventos()
  }, [])

  function eventoTemCategoria(ev, cat) {
    if (!cat) return true
    if (!ev.categoria) return false
    if (Array.isArray(ev.categoria)) {
      return ev.categoria.some(c => c.toLowerCase().includes(cat.toLowerCase()))
    }
    return ev.categoria.toLowerCase().includes(cat.toLowerCase())
  }

  const eventosFiltrados = eventos.filter(ev =>
    eventoTemCategoria(ev, categoria) &&
    (!dataBusca || (ev.data && ev.data.startsWith(dataBusca))) &&
    (
      ev.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      ev.local?.toLowerCase().includes(busca.toLowerCase())
    )
  )

  const promocoes = eventosFiltrados.filter(ev => ev.destaque)
  const normais = eventosFiltrados.filter(ev => !ev.destaque)

  function handleFavoritar(e, id) {
    e.preventDefault()
    setFavoritos(favs =>
      favs.includes(id)
        ? favs.filter(fid => fid !== id)
        : [...favs, id]
    )
  }

  return (
    <div className="bg-[#111827] text-white min-h-screen">
      <NavMenu />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center text-[#E11D48]">
          Agenda de Eventos
        </h1>

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

        <section className="mb-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setCategoria("")}
            className={`px-5 py-2 rounded-full font-semibold text-sm ${
              categoria
                ? "bg-[#1F2937] text-white border border-[#334155]"
                : "bg-[#E11D48] text-white"
            } hover:bg-[#F43F5E] transition`}
          >
            Todos
          </button>
          {categoriasMock.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-5 py-2 rounded-full font-semibold text-sm ${
                categoria === cat
                  ? "bg-[#E11D48] text-white"
                  : "bg-[#1F2937] text-white border border-[#334155]"
              } hover:bg-[#F43F5E] transition`}
            >
              {cat}
            </button>
          ))}
        </section>

        {promocoes.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#F43F5E] mb-4 text-center">
              Promoções em Destaque
            </h2>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
              {promocoes.map((ev) => (
                <Link key={ev.id} href={`/eventos/${ev.id}`} className="block no-underline">
                  <div className="bg-[#1F2937] border border-[#334155] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                    <img
                      src={ev.imagem || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"}
                      alt={ev.nome}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{ev.nome}</h3>
                        <button
                          onClick={e => handleFavoritar(e, ev.id)}
                          className={`text-2xl transition-colors duration-200 ${favoritos.includes(ev.id)
                            ? "text-pink-500"
                            : "text-gray-400 hover:text-pink-500"
                          }`}
                          aria-label="Favoritar"
                          title={favoritos.includes(ev.id) ? "Remover dos favoritos" : "Favoritar"}
                        >
                          {favoritos.includes(ev.id) ? "♥" : "♡"}
                        </button>
                      </div>
                      <p className="text-sm text-gray-400">
                        {ev.local} • {Array.isArray(ev.categoria) ? ev.categoria.join(", ") : ev.categoria}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.local)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0EA5E9] underline text-xs"
                      >
                        Ver no mapa
                      </a>
                      <p className="text-sm text-gray-300">{ev.descricao}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-400 font-semibold">{ev.preco}</span>
                        <span className="text-gray-400">{ev.data && new Date(ev.data).toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          {normais.length === 0 ? (
            <p className="text-center text-gray-400 mt-20">
              Nenhum evento encontrado.
            </p>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
              {normais.map((ev) => (
                <Link key={ev.id} href={`/eventos/${ev.id}`} className="block no-underline">
                  <div className="bg-[#1F2937] border border-[#334155] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                    <img
                      src={ev.imagem || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"}
                      alt={ev.nome}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{ev.nome}</h3>
                        <button
                          onClick={e => handleFavoritar(e, ev.id)}
                          className={`text-2xl transition-colors duration-200 ${favoritos.includes(ev.id)
                            ? "text-pink-500"
                            : "text-gray-400 hover:text-pink-500"
                          }`}
                          aria-label="Favoritar"
                          title={favoritos.includes(ev.id) ? "Remover dos favoritos" : "Favoritar"}
                        >
                          {favoritos.includes(ev.id) ? "♥" : "♡"}
                        </button>
                      </div>
                      <p className="text-sm text-gray-400">
                        {ev.local} • {Array.isArray(ev.categoria) ? ev.categoria.join(", ") : ev.categoria}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.local)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0EA5E9] underline text-xs"
                      >
                        Ver no mapa
                      </a>
                      <p className="text-sm text-gray-300">{ev.descricao}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-400 font-semibold">{ev.preco}</span>
                        <span className="text-gray-400">{ev.data && new Date(ev.data).toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
