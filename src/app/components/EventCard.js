import Link from "next/link"
import FavoriteButton from "./FavoriteButton"

export default function EventCard({ evento, onFavoritar }) {
  return (
    <Link href={`/eventos/${evento.id}`} className="block no-underline">
      <div className="bg-[#1F2937] border border-[#334155] rounded-2xl shadow-sm mb-5 overflow-hidden cursor-pointer hover:shadow-lg transition">
        {evento.imagem && (
          <img
            src={evento.imagem}
            alt={evento.nome}
            className="w-full h-44 object-cover"
            loading="lazy"
          />
        )}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  evento.destaque ? "bg-[#FACC15]" : "bg-gray-500"
                }`}
              />
              <h3 className="font-semibold text-lg text-white">
                {evento.nome}
              </h3>
            </div>
            <FavoriteButton
              favorito={evento.favorito}
              onClick={(e) => {
                e.preventDefault()
                onFavoritar(evento.id)
              }}
            />
          </div>
          <p className="text-sm text-gray-400">
            {evento.horario} · {evento.local}
          </p>
          <p className="text-sm text-gray-300 line-clamp-2">
            {evento.descricao}
          </p>
          <p className="text-green-400 font-semibold text-sm">
            {evento.preco}
          </p>
        </div>
      </div>
    </Link>
  )
}
