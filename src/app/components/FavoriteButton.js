// src/app/components/FavoriteButton.jsx
"use client"
import { Heart } from "lucide-react"

export default function FavoriteButton({ favorito, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className="p-1"
    >
      <Heart
        size={20}
        fill={favorito ? "currentColor" : "none"}
        className={
          favorito
            ? "text-red-500 transition-colors"
            : "text-gray-400 hover:text-red-500 transition-colors"
        }
      />
    </button>
  )
}
