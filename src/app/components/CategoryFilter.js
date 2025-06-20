export default function CategoryFilter({ categorias, categoriaAtual, setCategoria }) {
  return (
    <div className="flex gap-3 overflow-x-auto py-2 px-2 bg-[#1F2937] rounded-xl shadow-inner">
      <button
        onClick={() => setCategoria("")}
        className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap border transition ${
          categoriaAtual
            ? "bg-[#1F2937] text-white border-[#334155] hover:bg-[#334155]"
            : "bg-[#E11D48] text-white border-[#E11D48] hover:bg-[#F43F5E]"
        }`}
      >
        Todos
      </button>
      {categorias.map(cat => (
        <button
          key={cat}
          onClick={() => setCategoria(cat)}
          className={`px-5 py-2 rounded-full font-semibold text-sm whitespace-nowrap border transition ${
            categoriaAtual === cat
              ? "bg-[#E11D48] text-white border-[#E11D48] hover:bg-[#F43F5E]"
              : "bg-[#1F2937] text-white border-[#334155] hover:bg-[#334155]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
