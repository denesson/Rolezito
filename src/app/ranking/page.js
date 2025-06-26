// app/ranking/page.jsx  (Server Component)
import NavMenu from "../components/NavMenu"
import Link from "next/link"
import { Star } from "lucide-react"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function RankingPage() {
  // busca os eventos já com as reviews
  const eventos = await prisma.evento.findMany({
    include: { reviews: true }
  })

  // calcula média e quantidade de avaliações
  const ranking = eventos
    .map(ev => {
      const count = ev.reviews.length
      const sum = ev.reviews.reduce((s, r) => s + r.rating, 0)
      const rating = count ? sum / count : 0
      return { ...ev, rating, count }
    })
    .sort((a, b) => b.rating - a.rating)

  // formata "Sáb, 05 Jul"
  const formatDate = iso => {
    const d = new Date(iso)
    const opts = { weekday: "short", day: "2-digit", month: "short" }
    const str = new Intl.DateTimeFormat("pt-BR", opts).format(d)
    return str
      .replace(/\./g, "")
      .split(" ")
      .map((t, i) =>
        i === 0 || i === 2
          ? t.charAt(0).toUpperCase() + t.slice(1)
          : t
      )
      .join(" ")
  }

  // renderiza apenas full ou empty stars
  const renderStars = nota => (
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`${
          i < Math.round(nota)
            ? "text-yellow-400"
            : "text-gray-600"
        }`}
      />
    ))
  )

  const highlightColors = ["#FFD700", "#C0C0C0", "#CD7F32"]

  return (
    <>
      <NavMenu />
      <main className="min-h-screen bg-[#111827] text-white px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-red-500">
          Ranking de Eventos
        </h1>
        <ul className="max-w-3xl mx-auto space-y-4">
          {ranking.map((ev, i) => {
            const { rating, count } = ev
            const isEmpty = count === 0
            return (
              <li
                key={ev.id}
                style={i < 3 ? { borderColor: highlightColors[i] } : undefined}
                className="border rounded-xl shadow bg-[#1e293b] cursor-pointer hover:bg-[#334155] transition-colors"
              >
                <Link
                  href={`/eventos/${ev.id}`}
                  className="block p-4 flex flex-col md:flex-row items-start md:items-center justify-between"
                >
                  <div>
                    <span className="text-xl font-semibold">
                      {i + 1}. {ev.nome}
                    </span>
                    <div className="text-sm text-gray-400">
                      {formatDate(ev.data)} — {ev.local}
                    </div>
                  </div>
                  <div className="mt-3 md:mt-0 flex items-center space-x-4 text-right">
                    <div className="flex">
                      {isEmpty ? (
                        <span className="italic text-gray-400">
                          Seja o primeiro a avaliar
                        </span>
                      ) : (
                        renderStars(rating)
                      )}
                    </div>
                    {!isEmpty && (
                      <>
                        <span className="font-bold">
                          {rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-400">
                          {count === 1
                            ? '(1 avaliação)'
                            : `(${count} avaliações)`
                          }
                        </span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
    </>
  )
}
