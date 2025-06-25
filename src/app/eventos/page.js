// src/app/eventos/page.jsx
"use client"
import { useState, useEffect } from "react"
import NavMenu from "../components/NavMenu"
import EventCard from "../components/EventCard"
import AdBanner from "../components/AdBanner"
import SideBanner from "../components/SideBanner"
import Footer from "../components/Footer"

const categoriasMock = [
  "Promoções",
  "Música",
  "Bar",
  "Grátis",
  "Balada",
  "Gastronomia",
  "Festival",
  "Favoritos",
  "Recomendados",
]

export default function EventosPage() {
  const [busca, setBusca] = useState("")
  const [categoria, setCategoria] = useState("")
  const [dataBusca, setDataBusca] = useState("")
  const [eventos, setEventos] = useState([])
  const [favoritos, setFavoritos] = useState(new Set())
  const [recommendados, setRecommendados] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    fetchEventos()
    fetchFavoritos()
    if (!localStorage.getItem("seenOnboarding")) {
      setShowOnboarding(true)
      localStorage.setItem("seenOnboarding", "1")
    }
  }, [])

  useEffect(() => {
    if (categoria === "Recomendados") {
      fetch('/api/eventos/recomendados', { credentials: 'include' })
        .then(res => res.ok ? res.json() : [])
        .then(setRecommendados)
        .catch(() => setRecommendados([]))
    }
  }, [categoria])

  async function fetchEventos() {
    try {
      const resp = await fetch("/api/eventos")
      if (resp.ok) setEventos(await resp.json())
    } catch {
      setEventos([])
    }
  }

  async function fetchFavoritos() {
    try {
      const resp = await fetch("/api/favoritos", { credentials: "include" })
      if (resp.ok) {
        const data = await resp.json()
        setFavoritos(new Set(data.map(f => f.eventId)))
      }
    } catch {
      // falha silenciosa
    }
  }

  async function handleFavoritar(eventId) {
    const isFav = favoritos.has(eventId)
    const method = isFav ? "DELETE" : "POST"
    try {
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
      }
    } catch {
      // falha de rede
    }
  }

  function eventoTemCategoria(ev, cat) {
    if (!cat) return true
    if (cat === "Favoritos") return favoritos.has(ev.id)
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
    (ev.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      ev.local?.toLowerCase().includes(busca.toLowerCase()))
  )

  const listaParaExibir =
    categoria === "Recomendados" ? recommendados : eventosFiltrados

  return (
    <div className="bg-[#111827] text-white min-h-screen flex flex-col">
      <NavMenu />

      {/* Banner de patrocínio */}
      <AdBanner>
        <img
          src="https://placehold.co/728x90/transparent/000000?text=Banner+Exemplo"
          alt="Banner Exemplo"
          className="block w-full h-auto"
        />
      </AdBanner>

      {/* Onboarding modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1F2937] text-black dark:text-white rounded-xl p-6 max-w-sm text-center space-y-4">
            <h2 className="text-2xl font-bold">Bem-vindo ao Rolezito!</h2>
            <p>Crie sua conta e salve seus eventos favoritos para nunca perder um rolê.</p>
            <button
              onClick={() => setShowOnboarding(false)}
              className="mt-2 px-4 py-2 bg-[#E11D48] text-white rounded"
            >
              Entendi!
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Título e filtros fora do flex principal */}
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

        {/* Grid + Sidebar flexível */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Conteúdo principal */}
          <div className="flex-1">
            {listaParaExibir.length === 0 ? (
              <p className="text-center text-gray-400 mt-20">
                Nenhum evento {categoria === 'Recomendados' ? 'recomendado' : 'encontrado'}.
              </p>
            ) : (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {listaParaExibir.map(ev => (
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

          {/* Sidebar só desktop */}
          <div className="hidden lg:block">
            <SideBanner>
              <img
                src="https://placehold.co/300x250/transparent/000000?text=Anúncio+Exemplo"
                alt="Patrocinador"
                className="block w-full h-auto"
              />
            </SideBanner>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
