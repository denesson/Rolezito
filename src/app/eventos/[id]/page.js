// src/app/eventos/[id]/page.jsx
"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import NavMenu from '../../components/NavMenu'
import Footer from '../../components/Footer'
import FavoriteButton from '../../components/FavoriteButton'
import { Star } from "lucide-react"
import { useAuth } from '../../../hooks/useAuth'

export default function EventoDetalhe() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favorito, setFavorito] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [comentario, setComentario] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Detalhes do evento
        const evtRes = await fetch(`/api/eventos/${id}`)
        if (evtRes.ok) setEvento(await evtRes.json())

        // Favorito
        const favRes = await fetch("/api/favoritos", { credentials: "include" })
        if (favRes.ok) {
          const favs = await favRes.json()
          setFavorito(favs.some(f => f.eventId === parseInt(id)))
        }

        // Reviews
        const revRes = await fetch(`/api/eventos/${id}/reviews`, { credentials: "include" })
        if (revRes.ok) setReviews(await revRes.json())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  const handleFavoritar = async () => {
    try {
      const method = favorito ? "DELETE" : "POST"
      const res = await fetch("/api/favoritos", {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: parseInt(id) }),
      })
      if (res.ok) setFavorito(f => !f)
    } catch (err) {
      console.error(err)
    }
  }

  const enviarReview = async () => {
    setErro("")
    if (rating < 1) {
      setErro("Selecione uma nota de 1 a 5 estrelas.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`/api/eventos/${id}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario, stars: rating }),
      })
      if (!res.ok) {
        console.error("Erro ao enviar review", res.status)
      } else {
        const newRev = await res.json()
        setReviews(prev => [newRev, ...prev])
        setComentario("")
        setRating(0)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-[#111827] min-h-screen flex items-center justify-center">
        <p className="text-white text-lg">Carregando...</p>
      </div>
    )
  }

  if (!evento) {
    return (
      <div className="bg-[#111827] min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-lg">Evento não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#111827] text-white min-h-screen flex flex-col">
      <NavMenu />
      <div className="flex items-center justify-center bg-[#111827] py-10">
        <main className="bg-[#1F2937] text-white w-full max-w-2xl p-8 rounded-2xl space-y-6">

          <Link href="/eventos" className="text-sm text-[#E11D48] hover:underline">
            ← Voltar para Eventos
          </Link>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{evento.nome}</h1>
            <FavoriteButton favorito={favorito} onClick={handleFavoritar} />
          </div>

          <p className="text-sm text-gray-400">
            {new Date(evento.data).toLocaleString("pt-BR")} • {evento.local}
          </p>

          {evento.imagem && (
            <img
              src={evento.imagem}
              alt={evento.nome}
              className="w-full rounded-lg object-cover"
            />
          )}

          <p className="text-gray-300">{evento.descricao}</p>

          {/* Adicionar ao calendário */}
          <a
            href={`data:text/calendar;charset=utf8,${encodeURIComponent(
              `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${evento.nome}
DTSTART:${new Date(evento.data)
                .toISOString()
                .replace(/[-:]/g, '')
                .split('.')[0]}
DESCRIPTION:${evento.descricao}
END:VEVENT
END:VCALENDAR`
            )}`}
            download={`${evento.nome.replace(/\s+/g, '_')}.ics`}
            className="text-[#0EA5E9] underline text-sm"
          >
            ⏰ Adicionar ao calendário
          </a>

          {/* Avaliações */}
          <section className="pt-6 border-t border-[#334155] space-y-4">
            <h2 className="text-xl font-semibold">Deixe sua avaliação</h2>

            {!user ? (
              // se não estiver logado, mostra link para login
              <p className="text-center text-red-400">
                Você precisa{' '}
                <Link href="/login" className="underline text-red-500">
                  entrar
                </Link>{' '}
                para avaliar.
              </p>
            ) : (
              <>
                {/* suas estrelas originais */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className="text-2xl"
                    >
                      {n <= rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>

                {/* seu textarea original */}
                <textarea
                  value={comentario}
                  onChange={e => setComentario(e.target.value)}
                  rows={3}
                  className="w-full bg-[#1F2937] border border-[#334155] rounded p-2 text-white"
                  placeholder="Comentário"
                />

                {/* seu botão original */}
                <button
                  onClick={enviarReview}
                  disabled={submitting}
                  className="px-4 py-2 bg-[#E11D48] rounded hover:bg-[#F43F5E]"
                >
                  {submitting ? 'Enviando...' : 'Enviar'}
                </button>
              </>
            )}
          </section>

          {/* Lista de reviews */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Comentários</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400">Nenhuma avaliação ainda.</p>
            ) : (
              reviews.map(r => (
                <div key={r.id} className="bg-[#1e293b] p-4 rounded-lg space-y-1">
                  <p className="text-sm font-semibold text-white">{r.user?.nome}</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        size={20}
                        fill={i <= r.rating ? "currentColor" : "none"}
                        className={i <= r.rating ? "text-yellow-400" : "text-gray-500"}
                      />
                    ))}
                  </div>
                  {r.comentario && <p className="text-gray-300">{r.comentario}</p>}
                  <p className="text-xs text-gray-500">
                    {new Date(r.criadoEm).toLocaleDateString("pt-BR")}{" "}
                    {new Date(r.criadoEm).toLocaleTimeString("pt-BR")}
                  </p>
                </div>
              ))
            )}
          </section>

        </main>
      </div>
      <Footer />
    </div>
  )
}
