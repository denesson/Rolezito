// components/FavoriteButton.jsx
"use client"
import React from "react"
import { Heart } from "lucide-react"

export default function FavoriteButton({ favorito, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-1 transition-colors"
      aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        size={20}
        className={favorito ? "text-pink-500" : "text-gray-400 hover:text-pink-500"}
      />
    </button>
  )
}
