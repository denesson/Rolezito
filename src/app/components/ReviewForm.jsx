"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Star } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

export default function ReviewForm({ eventoId, onSuccess }) {
  const { user } = useAuth()
  const router = useRouter()
  const [stars, setStars] = useState(0)
  const [comentario, setComentario] = useState("")
  const [erro, setErro] = useState("")

  // Se não estiver logado, mostra link para login
  if (!user) {
    return (
      <p className="text-center text-red-400">
        Você precisa{" "}
        <Link href="/login" className="underline text-red-500">
          entrar
        </Link>{" "}
        para avaliar.
      </p>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro("")

    if (stars < 1) {
      setErro("Clique nas estrelas para avaliar de 1 a 5.")
      return
    }

    try {
      const res = await fetch(`/api/eventos/${eventoId}/reviews`, {
        method: "POST",
        credentials: "include", // se usar cookie JWT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars, comentario }),
      })
      if (!res.ok) throw new Error("Falha ao enviar avaliação")
      setStars(0)
      setComentario("")
      onSuccess?.()  // opcional: para recarregar lista de reviews
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-1">
        {[1,2,3,4,5].map(n => (
          <Star
            key={n}
            className={`cursor-pointer transition-colors ${
              stars >= n ? "text-yellow-400" : "text-gray-600"
            }`}
            size={24}
            onClick={() => setStars(n)}
          />
        ))}
      </div>
      <textarea
        value={comentario}
        onChange={e => setComentario(e.target.value)}
        placeholder="Deixe seu comentário (opcional)"
        className="w-full p-2 border border-gray-600 rounded bg-[#1e293b] text-white placeholder-gray-500"
        rows={3}
      />
      {erro && <p className="text-red-500">{erro}</p>}
      <button
        type="submit"
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
      >
        Enviar avaliação
      </button>
    </form>
  )
}
