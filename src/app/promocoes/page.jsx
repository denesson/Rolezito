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
        // Pega só eventos marcados como destaque/promoção
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

  if (loading) return <div className="text-center py-20 text-gray-400">Carregando promoções...</div>

  return (
    <>
    <NavMenu />
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">
        Promoções Especiais
      </h1>
      <ul className="space-y-4">
        {promocoes.length === 0 && (
          <li className="text-center text-gray-400">Nenhuma promoção encontrada.</li>
        )}
        {promocoes.map((promo, i) => (
          <li key={i} className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-xl shadow flex flex-col">
            <span className="text-xs bg-gray-300 text-gray-800 px-2 py-0.5 rounded-full mb-1 w-max">
              {promo.local}
            </span>
            <span className="font-semibold text-lg text-yellow-800 dark:text-yellow-200">{promo.nome}</span>
            <span className="text-gray-700 dark:text-gray-100 mb-1">{promo.descricao}</span>
            <span className="text-green-700 dark:text-green-300 font-bold">{promo.preco}</span>
            <Link
              href={`/eventos/${promo.id}`}
              className="mt-3 inline-block bg-blue-600 text-white rounded-full px-6 py-2 text-sm font-semibold shadow hover:bg-blue-700 transition"
            >
              Ver evento
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-gray-500 dark:text-gray-400 text-sm">
        Para incluir sua promoção, <Link href="/contato" className="underline text-blue-600 dark:text-blue-400">fale com a gente</Link>!
      </p>
    </main>
    </>
  )
}
