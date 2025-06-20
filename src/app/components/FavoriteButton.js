export default function FavoriteButton({ favorito, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Favoritar"
      className={`text-2xl ml-1 transition-colors duration-200 ${
        favorito ? "text-pink-500" : "text-gray-400 hover:text-pink-500"
      }`}
    >
      {favorito ? "♥" : "♡"}
    </button>
  )
}
