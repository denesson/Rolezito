// src/app/eventos/[id]/page.jsx
"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import NavMenu from "../../../app/components/NavMenu"
import FavoriteButton from "../../../app/components/FavoriteButton"
import { Star } from "lucide-react"

export default function EventoDetalhe() {
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favorito, setFavorito] = useState(false)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [comentario, setComentario] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Busca detalhes do evento
        const evtRes = await fetch(`/api/eventos/${id}`)
        if (evtRes.ok) setEvento(await evtRes.json())
        // Busca status de favorito
        const favRes = await fetch("/api/favoritos", { credentials: "include" })
        if (favRes.ok) {
          const favs = await favRes.json()
          setFavorito(favs.some(f => f.eventId === parseInt(id)))
        }
        // Busca reviews
        const revRes = await fetch(`/api/eventos/${id}/reviews`)
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
    if (!comentario || rating < 1) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/eventos/${id}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario, rating }),
      })
      if (res.ok) {
        const newRev = await res.json()
        setReviews(r => [newRev, ...r])
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
    return <div className="min-h-screen bg-[#111827] text-center text-white py-20">Carregando...</div>
  }
  if (!evento) {
    return <div className="min-h-screen bg-[#111827] text-center text-red-400 py-20">Evento não encontrado.</div>
  }

  return (
    <>
      <NavMenu />
      <main className="bg-[#111827] text-white min-h-screen px-4 py-10 max-w-2xl mx-auto space-y-6">
        <Link href="/eventos" className="text-sm text-[#E11D48] hover:underline">
          ← Voltar
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{evento.nome}</h1>
          <FavoriteButton favorito={favorito} onClick={handleFavoritar} />
        </div>

        <p className="text-sm text-gray-400">
          {new Date(evento.data).toLocaleString("pt-BR")} • {evento.local}
        </p>
        {evento.imagem && <img src={evento.imagem} alt={evento.nome} className="w-full rounded-xl" />}
        <p className="text-gray-300">{evento.descricao}</p>

        {/* Avaliações */}
        <section className="pt-6 border-t border-[#334155] space-y-4">
          <h2 className="text-xl font-semibold">Deixe sua avaliação</h2>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)} className="text-2xl">
                {n <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            rows={3}
            className="w-full bg-[#1F2937] border border-[#334155] rounded p-2 text-white"
            placeholder="Comentário"
          />
          <button
            onClick={enviarReview}
            disabled={submitting}
            className="px-4 py-2 bg-[#E11D48] rounded hover:bg-[#F43F5E]"
          >
            {submitting ? "Enviando..." : "Enviar"}
          </button>
        </section>

        {/* Lista de reviews */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Comentários</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-400">Nenhuma avaliação ainda.</p>
          ) : (
            reviews.map(r => (
              <div key={r.id} className="bg-[#1F2937] p-4 rounded-lg">
                <div className="flex gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Star
                      key={i}
                      size={20}
                      fill={i <= r.rating ? "currentColor" : "none"}
                      className={i <= r.rating ? "text-yellow-400" : "text-gray-500"}
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-1">{r.comentario}</p>
                <p className="text-xs text-gray-500">{new Date(r.criadoEm).toLocaleString("pt-BR")}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </>
  )
}
