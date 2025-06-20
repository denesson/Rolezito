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
      } catch (e) {
        setEventos([])
      }
    }
    fetchEventos()
  }, [])

  // Função para padronizar busca por categoria, se vier string ou array
  function eventoTemCategoria(ev, cat) {
    if (!cat) return true
    if (!ev.categoria) return false
    if (Array.isArray(ev.categoria)) {
      return ev.categoria.some(c =>
        c.toLowerCase().includes(cat.toLowerCase())
      )
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
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
        <NavMenu />
      </div>
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-blue-700 dark:text-blue-400">
          Agenda de Eventos
        </h1>

        {/* Busca e filtros */}
        <section className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
          <input
            type="search"
            placeholder="Buscar eventos, lugares..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-900 dark:text-white transition"
          />
          <input
            type="date"
            value={dataBusca}
            onChange={e => setDataBusca(e.target.value)}
            className="w-full sm:w-40 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-900 dark:text-white transition"
          />
        </section>

        {/* Categorias */}
        <section className="mb-8 flex flex-wrap gap-2 sm:gap-3 justify-center">
          <button
            onClick={() => setCategoria("")}
            className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap
              ${categoria
                ? "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                : "bg-blue-600 text-white"
              }
              hover:bg-blue-700 hover:text-white transition`}
          >
            Todos
          </button>
          {categoriasMock.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap
                ${categoria === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }
                hover:bg-blue-700 hover:text-white transition`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* PROMOÇÕES EM DESTAQUE */}
        {promocoes.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4 text-center">
              Promoções em Destaque
            </h2>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
              {promocoes.map((ev) => (
                <Link key={ev.id} href={`/eventos/${ev.id}`} className="block no-underline">
                  <div className="bg-yellow-100 dark:bg-yellow-800 rounded-xl shadow-md border border-yellow-300 dark:border-yellow-600 overflow-hidden cursor-pointer hover:shadow-lg transition flex flex-col">
                    <img
                      src={ev.imagem || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"}
                      alt={ev.nome}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg text-yellow-800 dark:text-yellow-200 flex-grow">
                          {ev.nome}
                        </h3>
                        <button
                          onClick={e => handleFavoritar(e, ev.id)}
                          className={`text-2xl ml-1 transition-colors duration-200 ${favoritos.includes(ev.id)
                            ? "text-pink-500"
                            : "text-gray-400 hover:text-pink-500"
                            }`}
                          aria-label="Favoritar"
                          title={favoritos.includes(ev.id) ? "Remover dos favoritos" : "Favoritar"}
                        >
                          {favoritos.includes(ev.id) ? "♥" : "♡"}
                        </button>
                      </div>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {ev.local} • {
                          Array.isArray(ev.categoria)
                            ? ev.categoria.join(", ")
                            : ev.categoria
                        }
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.local)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-xs mb-1"
                      >
                        Ver no mapa
                      </a>
                      <p className="text-sm text-yellow-900 dark:text-yellow-100">{ev.descricao}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-green-700 font-semibold text-sm">{ev.preco}</span>
                        <span className="text-gray-500 text-xs">{ev.data && new Date(ev.data).toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Lista de eventos NORMAIS */}
        <section>
          {normais.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-20">
              Nenhum evento encontrado.
            </p>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
              {normais.map((ev) => (
                <Link key={ev.id} href={`/eventos/${ev.id}`} className="block no-underline">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg transition flex flex-col">
                    <img
                      src={ev.imagem || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"}
                      alt={ev.nome}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex-grow">
                          {ev.nome}
                        </h3>
                        <button
                          onClick={e => handleFavoritar(e, ev.id)}
                          className={`text-2xl ml-1 transition-colors duration-200 ${favoritos.includes(ev.id)
                            ? "text-pink-500"
                            : "text-gray-400 hover:text-pink-500"
                            }`}
                          aria-label="Favoritar"
                          title={favoritos.includes(ev.id) ? "Remover dos favoritos" : "Favoritar"}
                        >
                          {favoritos.includes(ev.id) ? "♥" : "♡"}
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {ev.local} • {
                          Array.isArray(ev.categoria)
                            ? ev.categoria.join(", ")
                            : ev.categoria
                        }
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.local)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline text-xs mb-1"
                      >
                        Ver no mapa
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ev.descricao}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-blue-600 font-semibold text-sm">{ev.preco}</span>
                        <span className="text-gray-500 text-xs">{ev.data && new Date(ev.data).toLocaleString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
