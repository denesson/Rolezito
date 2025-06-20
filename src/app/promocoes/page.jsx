"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import NavMenu from "../components/NavMenu"

export default function PromocoesPage() {
  const [promocoes, setPromocoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPromocoes() {
      try {
        const resp = await fetch("/api/eventos")
        const eventos = await resp.json()
        const promoFiltradas = eventos.filter(ev =>
          ev.destaque || ev.isPromocao || (Array.isArray(ev.categoria) ? ev.categoria.includes("Promoções") : ev.categoria === "Promoções")
        )
        setPromocoes(promoFiltradas)
      } catch {
        setPromocoes([])
      } finally {
        setLoading(false)
      }
    }
    fetchPromocoes()
  }, [])

  if (loading) return (
    <div className="text-center py-20 text-[#F43F5E] bg-[#111827]">
      Carregando promoções...
    </div>
  )

  return (
    <div className="bg-[#111827] min-h-screen text-white">
      <NavMenu />
      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-[#E11D48] text-center">Promoções Especiais</h1>
        <ul className="space-y-6">
          {promocoes.length === 0 && (
            <li className="text-center text-[#9CA3AF]">Nenhuma promoção encontrada.</li>
          )}
          {promocoes.map((promo, i) => (
            <li
              key={i}
              className="bg-[#1F2937] border border-[#334155] p-5 rounded-xl shadow-sm flex flex-col"
            >
              <span className="text-xs bg-[#F43F5E] text-white px-2 py-0.5 rounded-full mb-1 w-max font-medium">
                {promo.local}
              </span>
              <span className="font-semibold text-lg text-[#F43F5E]">{promo.nome}</span>
              <span className="text-[#D1D5DB] mb-2 text-sm">{promo.descricao}</span>
              <span className="text-green-400 font-bold">{promo.preco}</span>
              <Link
                href={`/eventos/${promo.id}`}
                className="mt-3 inline-block bg-[#E11D48] text-white rounded-full px-6 py-2 text-sm font-semibold shadow hover:bg-[#F43F5E] transition"
              >
                Ver evento
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-sm text-[#9CA3AF]">
          Quer divulgar sua promoção?{" "}
          <Link href="/contato" className="underline text-[#0EA5E9] hover:text-[#38BDF8]">
            Fale com a gente
          </Link>
        </p>
      </main>
    </div>
  )
}
