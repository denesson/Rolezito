// src/app/ofertas/page.jsx
"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import NavMenu from "../components/NavMenu"
import Footer from "../components/Footer"

export default function OfertasPage() {
  const [promocoes, setPromocoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOfertas() {
      try {
        const resp = await fetch("/api/eventos")
        const eventos = await resp.json()
        const promoFiltradas = eventos.filter(ev =>
          ev.destaque ||
          ev.isPromocao ||
          (Array.isArray(ev.categoria)
            ? ev.categoria.includes("Ofertas")
            : ev.categoria === "Ofertas")
        )
        setPromocoes(promoFiltradas)
      } catch {
        setPromocoes([])
      } finally {
        setLoading(false)
      }
    }
    fetchOfertas()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-20 text-[#F43F5E] bg-[#111827] min-h-screen flex items-center justify-center">
        Carregando ofertas...
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      {/* Navbar fixa */}
      <NavMenu />

      {/* Conteúdo que expande */}
      <main className="flex-grow max-w-xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-[#E11D48] text-center">
          Ofertas Especiais
        </h1>

        <ul className="space-y-6">
          {promocoes.length === 0 && (
            <li className="text-center text-[#9CA3AF]">
              Nenhuma oferta encontrada.
            </li>
          )}
          {promocoes.map((promo, i) => (
            <li
              key={i}
              className="bg-[#1F2937] border border-[#334155] p-5 rounded-xl shadow-sm flex flex-col"
            >
              <span className="text-xs bg-[#F43F5E] text-white px-2 py-0.5 rounded-full mb-1 w-max font-medium">
                {promo.local}
              </span>
              <h2 className="font-semibold text-lg text-[#F43F5E] mb-1">
                {promo.nome}
              </h2>
              <p className="text-[#D1D5DB] mb-2 text-sm">{promo.descricao}</p>
              <span className="text-green-400 font-bold mb-4">{promo.preco}</span>
              <Link
                href={`/eventos/${promo.id}`}
                className="mt-auto inline-block bg-[#E11D48] text-white rounded-full px-6 py-2 text-sm font-semibold shadow hover:bg-[#F43F5E] transition"
              >
                Ver evento
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-[#9CA3AF]">
          Quer divulgar sua promoção?{" "}
          <Link
            href="/contato"
            className="underline text-[#0EA5E9] hover:text-[#38BDF8]"
          >
            Fale com a gente
          </Link>
        </p>
      </main>

      {/* Footer sempre no final */}
      <Footer />
    </div>
  )
}
