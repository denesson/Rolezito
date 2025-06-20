export default function CategoryFilter({ categorias, categoriaAtual, setCategoria }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      <button
        onClick={() => setCategoria("")}
        className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap
          ${categoriaAtual ? "bg-gray-200 text-gray-700" : "bg-blue-600 text-white"}
          hover:bg-blue-700 hover:text-white transition`}
      >
        Todos
      </button>
      {categorias.map(cat => (
        <button
          key={cat}
          onClick={() => setCategoria(cat)}
          className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap
            ${categoriaAtual === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
            hover:bg-blue-700 hover:text-white transition`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
