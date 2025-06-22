// components/EventCard.jsx
"use client"
import Link from "next/link"
import FavoriteButton from "./FavoriteButton"
import { Share2 } from "lucide-react"

export default function EventCard({ evento, onFavoritar }) {
  const handleShare = (e) => {
    e.preventDefault()
    const url = `${window.location.origin}/eventos/${evento.id}`
    if (navigator.share) {
      navigator.share({
        title: evento.nome,
        text: evento.descricao,
        url,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url)
      alert("🔗 Link copiado para a área de transferência!")
    }
  }

  return (
    <div className="bg-[#1F2937] border border-[#334155] rounded-2xl overflow-hidden shadow-md mb-5">
      <Link href={`/eventos/${evento.id}`} className="block no-underline">
        {/* Imagem */}
        {evento.imagem && (
          <img
            src={evento.imagem}
            alt={evento.nome}
            className="w-full h-44 object-cover"
            loading="lazy"
          />
        )}

        <div className="p-4 space-y-2">
          {/* Título + Ações */}
          <div className="flex items-start justify-between">
            <h3 className="text-white font-semibold text-xl leading-snug">
              {evento.nome}
            </h3>
            <div className="flex items-center gap-2">
              {/* Compartilhar */}
              <button
                onClick={handleShare}
                className="p-1 text-gray-400 hover:text-blue-400 transition"
                title="Compartilhar evento"
              >
                <Share2 size={20} />
              </button>
              {/* Favoritar */}
              <FavoriteButton
                favorito={evento.favorito}
                onClick={(e) => {
                  e.preventDefault()
                  onFavoritar(evento.id)
                }}
              />
            </div>
          </div>

          {/* Subtítulo Local — Categoria */}
          <p className="text-gray-400 text-sm">
            {evento.local} — {evento.categoria}
          </p>

          {/* Link Ver no mapa */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              evento.local
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0EA5E9] underline text-sm"
          >
            Ver no mapa
          </a>

          {/* Descrição */}
          <p className="text-gray-300 text-sm">{evento.descricao}</p>

          {/* Rodapé com preço e data */}
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-green-400 font-semibold">{evento.preco}</span>
            <span className="text-gray-400">
              {evento.data &&
                new Date(evento.data).toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
