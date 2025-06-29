"use client"
import { useState, useEffect, useRef } from "react"
import NavMenu from "../components/NavMenu"
import EventCard from "../components/EventCard"
import AdBanner from "../components/AdBanner"
import SideBanner from "../components/SideBanner"
import Footer from "../components/Footer"
import HeroCarousel from "../components/HeroCarousel"

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
  const [sortKey, setSortKey] = useState("data")
  const [eventos, setEventos] = useState([])
  const [favoritos, setFavoritos] = useState(new Set())
  const [recommendados, setRecommendados] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const loadingRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [destaques, setDestaques] = useState([])

  // Onboarding
  useEffect(() => {
    fetchFavoritos()
    if (!localStorage.getItem("seenOnboarding")) {
      setShowOnboarding(true)
      localStorage.setItem("seenOnboarding", "1")
    }
  }, [])

  // Recomendados
  useEffect(() => {
    if (categoria === "Recomendados") {
      fetch('/api/eventos/recomendados', { credentials: 'include' })
        .then(res => res.ok ? res.json() : [])
        .then(setRecommendados)
        .catch(() => setRecommendados([]))
    }
  }, [categoria])

  // Scroll infinito: carrega eventos por página (API)
  useEffect(() => {
    let ignore = false
    async function fetchEventos() {
      setLoading(true)
      const resp = await fetch(`/api/eventos?page=${page}&limit=9`)
      const data = await resp.json()
      if (ignore) return
      setEventos(prev => page === 1 ? data.eventos : [...prev, ...data.eventos])
      setTotal(data.total)
      setHasMore((page - 1) * 9 + data.eventos.length < data.total)
      setLoading(false)
    }
    fetchEventos()
    return () => { ignore = true }
    // eslint-disable-next-line
  }, [page])

  // Intersection Observer para scroll infinito
  useEffect(() => {
    if (loading) return
    if (!hasMore) return
    const observer = new window.IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setPage(p => p + 1)
    }, { threshold: 1 })
    if (loadingRef.current) observer.observe(loadingRef.current)
    return () => { if (loadingRef.current) observer.unobserve(loadingRef.current) }
  }, [loading, hasMore])

  async function fetchFavoritos() {
    try {
      const resp = await fetch("/api/favoritos", { credentials: "include" })
      if (resp.ok) {
        const data = await resp.json()
        setFavoritos(new Set(data.map(f => f.eventId)))
      }
    } catch { }
  }

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/eventos")
      if (res.ok) {
        const { eventos } = await res.json()
        setEventos(eventos)
        setDestaques(
          eventos.filter(ev => ev.destaque && ev.imagem)
        )
      }
    }
    fetchData()
  }, [])

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
    } catch { }
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

  // Aplica filtros de busca, categoria e data
  const eventosFiltrados = eventos.filter(ev =>
    eventoTemCategoria(ev, categoria) &&
    (!dataBusca || ev.data?.startsWith(dataBusca)) &&
    (ev.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      ev.local?.toLowerCase().includes(busca.toLowerCase()))
  )

  // Escolhe lista base (recomendados ou filtrados)
  const listaBase = categoria === "Recomendados" ? recommendados : eventosFiltrados

  // Ordena conforme sortKey
  const eventosOrdenados = [...listaBase]
  if (sortKey === "data") {
    eventosOrdenados.sort((a, b) => new Date(a.data) - new Date(b.data))
  } else if (sortKey === "popularidade") {
    eventosOrdenados.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  } else if (sortKey === "nome") {
    eventosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome))
  }

  return (
    <div className="bg-[#111827] text-white min-h-screen flex flex-col">
      <NavMenu />
      {/* Banner de patrocínio */}
      {destaques.length > 0 && (
        <div className="mb-8">
          <HeroCarousel
            slides={destaques.map(ev => ({
              src: ev.imagem,
              alt: ev.nome,
              href: `/eventos/${ev.id}`,
              className: "rounded-xl shadow-xl border-2 border-yellow-400" // exemplo visual
            }))}
            title="Eventos em Destaque"
            interval={6000}
            height="h-40 md:h-80"
          />
        </div>
      )}
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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#E11D48] text-center mb-4">
          Agenda de Eventos
        </h1>
        {/* Controles em linha única */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <input
            type="date"
            value={dataBusca}
            onChange={e => setDataBusca(e.target.value)}
            placeholder="Filtrar por data"
            className="w-full md:w-40 px-4 py-2 rounded-full border border-[#334155] bg-[#1F2937] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
          />
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full md:w-auto">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <label htmlFor="sort" className="text-white font-semibold">
                Ordenar por:
              </label>
              <select
                id="sort"
                value={sortKey}
                onChange={e => setSortKey(e.target.value)}
                className="bg-[#1e2937] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              >
                <option value="data">Data</option>
                <option value="popularidade">Popularidade</option>
                <option value="nome">Nome</option>
              </select>
            </div>
            <input
              type="search"
              placeholder="Buscar eventos, lugares..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="w-64 px-4 py-2 rounded-full border border-[#334155] bg-[#1F2937] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E11D48] text-sm"
            />
          </div>
        </div>
        {/* Categorias */}
        <section className="flex flex-wrap gap-3 justify-center mb-6">
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
        {/* Main grid and sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {eventosOrdenados.length === 0 ? (
              <p className="text-center text-gray-400 mt-20">
                Nenhum evento {categoria === 'Recomendados' ? 'recomendado' : 'encontrado'}.
              </p>
            ) : (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {eventosOrdenados.map(ev => (
                  <EventCard
                    key={ev.id}
                    evento={ev}
                    favorito={favoritos.has(ev.id)}
                    onFavoritar={() => handleFavoritar(ev.id)}
                  />
                ))}
                {hasMore && (
                  <div
                    ref={loadingRef}
                    className="col-span-full flex justify-center py-6 text-gray-400"
                  >
                    Carregando mais eventos...
                  </div>
                )}
              </div>
            )}
          </div>
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
