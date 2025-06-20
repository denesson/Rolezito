import Link from "next/link"
import FavoriteButton from "./FavoriteButton"

export default function EventCard({ evento, onFavoritar }) {
  return (
    <Link href={`/eventos/${evento.id}`} className="block no-underline">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-5 overflow-hidden cursor-pointer hover:shadow-lg transition flex flex-col">
        {evento.imagem && (
          <img
            src={evento.imagem}
            alt={evento.nome}
            className="w-full h-40 object-cover"
            loading="lazy"
          />
        )}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                evento.destaque ? "bg-yellow-400" : "bg-gray-400"
              }`}
            />
            <h3 className="font-semibold text-lg text-gray-900 flex-grow">{evento.nome}</h3>
            <FavoriteButton favorito={evento.favorito} onClick={e => { e.preventDefault(); onFavoritar(evento.id); }} />
          </div>
          <p className="text-sm text-gray-700">{evento.horario} · {evento.local}</p>
          <p className="text-sm text-gray-600">{evento.descricao}</p>
          <p className="text-blue-600 font-semibold text-sm">{evento.preco}</p>
        </div>
      </div>
    </Link>
  )
}
