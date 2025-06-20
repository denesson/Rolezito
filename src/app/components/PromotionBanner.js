export default function PromotionBanner({ onVerRelampago }) {
  return (
    <section className="bg-blue-600 text-white px-6 py-4 rounded-b-lg max-w-6xl mx-auto flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold">🔥 Promoções Relâmpago!</h2>
        <p className="text-sm opacity-90">Confira ofertas imperdíveis por tempo limitado.</p>
      </div>
      <button
        onClick={onVerRelampago}
        className="bg-white text-blue-600 font-semibold rounded px-4 py-2 hover:bg-gray-100 transition"
      >
        Ver Ofertas
      </button>
    </section>
  )
}
