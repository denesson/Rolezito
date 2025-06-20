export default function PromotionBanner({ onVerRelampago }) {
  return (
    <section className="bg-gradient-to-r from-[#E11D48] to-[#F43F5E] text-white px-6 py-5 rounded-xl max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between shadow-lg mb-6">
      <div className="text-center sm:text-left mb-3 sm:mb-0">
        <h2 className="text-xl font-bold tracking-tight">🔥 Promoções Relâmpago!</h2>
        <p className="text-sm opacity-90">Ofertas atualizadas em tempo real — aproveite agora.</p>
      </div>
      <button
        onClick={onVerRelampago}
        className="mt-2 sm:mt-0 bg-white text-[#E11D48] font-semibold px-5 py-2 rounded-full hover:bg-[#FCE7EF] transition-all shadow-sm"
      >
        Ver Ofertas
      </button>
    </section>
  )
}
