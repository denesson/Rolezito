"use client"
import { useState } from "react"
import Link from "next/link"

// Simula busca de evento por id — depois você conecta a API/banco
const eventosMock = [
  {
    id: 1,
    nome: "Pagode da Praça",
    horario: "Sáb, 15 Jun, 21:00",
    local: "Praça Central",
    categoria: ["Música", "Bar"],
    destaque: true,
    favorito: false,
    descricao: "A melhor roda de samba da cidade, venha curtir!",
    preco: "Grátis",
    imagem:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    nome: "Chopp Dobrado",
    horario: "Sex, 14 Jun, 18:00",
    local: "Bar do Zé",
    categoria: ["Bar", "Promoções"],
    destaque: false,
    favorito: true,
    descricao: "Promoção imperdível de chopp em dobro toda sexta!",
    preco: "R$ 15",
    imagem:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=80",
  },
]

export default function EventoDetail({ params }) {
  const evento = eventosMock.find((ev) => ev.id === Number(params.id))

  const [favorito, setFavorito] = useState(evento?.favorito || false)

  if (!evento)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Evento não encontrado</p>
      </main>
    )

  return (
    <main className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow mt-8 dark:bg-gray-800 dark:text-white">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-4 inline-block dark:text-blue-400"
      >
        ← Voltar para home
      </Link>

      <img
        src={evento.imagem}
        alt={evento.nome}
        className="rounded-lg w-full h-64 object-cover mb-6"
        loading="lazy"
      />

      <h1 className="text-3xl font-bold mb-2">{evento.nome}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-1">
        {evento.horario} • {evento.local}
      </p>
      <p className="text-blue-600 font-semibold mb-4">{evento.preco}</p>

      <p className="mb-6">{evento.descricao}</p>

      <div className="flex gap-4">
        <button
          onClick={() => setFavorito(!favorito)}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            favorito
              ? "bg-pink-500 text-white hover:bg-pink-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
          }`}
          aria-label="Favoritar"
        >
          {favorito ? "★ Favorito" : "☆ Favoritar"}
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: evento.nome,
                text: evento.descricao,
                url: window.location.href,
              })
            } else {
              alert("Compartilhamento não suportado nesse navegador.")
            }
          }}
          className="px-6 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Compartilhar
        </button>
      </div>
    </main>
  )
}
