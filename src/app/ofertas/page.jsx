// src/app/ofertas/page.jsx
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import NavMenu from "../components/NavMenu"
import Footer from "../components/Footer"
import AdBanner from "../components/AdBanner"
import { Star, Megaphone } from "lucide-react"


export default function OfertasPage() {
  const [promocoes, setPromocoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState("Todos")
  const [filterPrice, setFilterPrice] = useState("Todas")
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    async function fetchOfertas() {
      try {
        const resp = await fetch("/api/eventos")
        const eventos = await resp.json()
        const promoFiltradas = eventos.filter(ev => ev.destaque === true)
        setPromocoes(promoFiltradas)
      } catch {
        setPromocoes([])
      } finally {
        setLoading(false)
      }
    }
    fetchOfertas()
  }, [])

  // Buscar avaliações para cada promoção
  useEffect(() => {
    async function loadRatings() {
      const data = {}
      await Promise.all(
        promocoes.map(async ev => {
          try {
            const res = await fetch(`/api/eventos/${ev.id}/reviews`)
            if (res.ok) {
              const revs = await res.json()
              const count = revs.length
              const sum = revs.reduce((s, r) => s + r.rating, 0)
              data[ev.id] = { avg: count ? sum / count : 0, count }
            }
          } catch {}
        })
      )
      setRatings(data)
    }
    if (promocoes.length) loadRatings()
  }, [promocoes])

  if (loading) {
    return (
      <div className="bg-[#111827] min-h-screen flex items-center justify-center text-[#F43F5E]">
        Carregando ofertas...
      </div>
    )
  }

  // gera opções de categoria a partir das promoções
  const categoryOptions = [
    "Todos",
    ...Array.from(new Set(
      promocoes.flatMap(ev =>
        Array.isArray(ev.categoria)
          ? ev.categoria
          : [ev.categoria]
      ).filter(Boolean)
    ))
  ]

  // aplica filtros de categoria e preço
  const filteredPromocoes = promocoes.filter(ev => {
    const catMatch =
      filterCategory === "Todos" ||
      (Array.isArray(ev.categoria)
        ? ev.categoria.includes(filterCategory)
        : ev.categoria === filterCategory)
    const precoStr = ev.preco.toLowerCase()
    let priceMatch = true
    if (filterPrice === "Grátis") {
      priceMatch = precoStr.includes("grátis")
    } else if (filterPrice === "0-50") {
      const num = parseFloat(precoStr.replace(/[^0-9,]/g, "").replace(",", ".")) || 0
      priceMatch = num > 0 && num <= 50
    } else if (filterPrice === "50-100") {
      const num = parseFloat(precoStr.replace(/[^0-9,]/g, "").replace(",", ".")) || 0
      priceMatch = num > 50 && num <= 100
    } else if (filterPrice === "100+") {
      const num = parseFloat(precoStr.replace(/[^0-9,]/g, "").replace(",", ".")) || 0
      priceMatch = num > 100
    }
    return catMatch && priceMatch
  })

  // renderiza estrelas
  const renderStars = nota => {
    const full = Math.floor(nota)
    const half = nota - full >= 0.5
    const empty = 5 - full - (half ? 1 : 0)
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} className="text-yellow-400" size={16} />
        ))}
        {half && <Star key="half" className="text-yellow-400" size={16} fill="currentColor" />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} className="text-gray-600" size={16} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      <NavMenu />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-4xl font-bold text-center text-[#E11D48]">
          Ofertas Especiais
        </h1>
        {/* Banner Patrocinado */}
        <div className="max-w-7xl mx-auto mb-8">
          <AdBanner>
            <img
              src="https://placehold.co/728x90/transparent/000000?text=Banner+Patrocinador"
              alt="Banner Patrocinador"
              className="block w-full h-auto rounded-xl"
            />
          </AdBanner>
        </div>

        {/* filtros rápidos */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
  <div className="flex items-center space-x-2">
    <label htmlFor="filterCategory" className="text-white font-semibold">
      Categoria:
    </label>
    <select
      id="filterCategory"
      value={filterCategory}
      onChange={e => setFilterCategory(e.target.value)}
      className="bg-[#1e2937] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E11D48] text-sm"
    >
      {categoryOptions.map(cat => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>
  <div className="flex items-center space-x-2">
    <label htmlFor="filterPrice" className="text-white font-semibold">
      Preço:
    </label>
    <select
      id="filterPrice"
      value={filterPrice}
      onChange={e => setFilterPrice(e.target.value)}
      className="bg-[#1e2937] text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E11D48] text-sm"
    >
      <option value="Todas">Todas</option>
      <option value="Grátis">Grátis</option>
      <option value="0-50">Até R$50</option>
      <option value="50-100">R$50–100</option>
      <option value="100+">Acima de R$100</option>
    </select>
  </div>
</div>

        {filteredPromocoes.length === 0 ? (
          <p className="text-center text-[#9CA3AF]">
            Nenhuma oferta encontrada.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromocoes.map(ev => {
              const now = new Date()
              const eventDate = new Date(ev.data)
              const diffMs = eventDate - now
              const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
              const timerLabel =
                daysLeft > 1
                  ? `${daysLeft} dias restantes`
                  : daysLeft === 1
                  ? `1 dia restante`
                  : `Oferta expirada`
              const rate = ratings[ev.id] || { avg: 0, count: 0 }
              return (
                <Link
                  key={ev.id}
                  href={`/eventos/${ev.id}`}
                  className="group block bg-[#1F2937] border border-[#334155] rounded-xl overflow-hidden shadow transition-transform transition-shadow hover:shadow-2xl hover:-translate-y-1 hover:border-[#E11D48]"
                >
                  {ev.imagem && (
                    <img
                      src={ev.imagem}
                      alt={ev.nome}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  )}
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-[#F43F5E] text-white px-2 py-1 rounded-full font-medium">
                        {ev.local}
                      </span>
                      <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-medium">
                        {timerLabel}
                      </span>
                    </div>
                    <h2 className="font-semibold text-lg text-white mb-1 truncate">
                      {ev.nome}
                    </h2>
                    {/* Avaliações */}
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(rate.avg)}
                      <span className="text-sm text-gray-400">({rate.count})</span>
                    </div>
                    <p className="text-[#D1D5DB] flex-grow text-sm mb-3 line-clamp-3">
                      {ev.descricao}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-green-400 font-bold">
                        {ev.preco}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {eventDate.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <button className="mt-auto bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold py-2 rounded-full transition-colors">
                      Ver evento
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="flex justify-center mt-10">
  <Link
    href="/contato"
    className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold px-4 py-2 rounded-full transition"
  >
    <Megaphone size={18} /> Anunciar minha promoção
  </Link>
</div>
      </main>
      <Footer />
    </div>
  )
}
