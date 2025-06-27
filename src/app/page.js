"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import NavMenu from "../app/components/NavMenu"
import HeroCarousel from "../app/components/HeroCarousel"
import Logo from "../../public/logo-rolezito.png"

// Placeholder de sponsors
const sponsors = [
  "https://placehold.co/100x50?text=Patrocinador+1",
  "https://placehold.co/100x50?text=Patrocinador+2",
  "https://placehold.co/100x50?text=Patrocinador+3",
  "https://placehold.co/100x50?text=Patrocinador+4",
]

export default function Home() {
  const [destaques, setDestaques] = useState([])

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch('/api/eventos')
        if (res.ok) {
          const list = await res.json()
          const proximos = list
            .map(ev => ({ ...ev, date: new Date(ev.data) }))
            .filter(ev => ev.date >= new Date())
            .sort((a, b) => a.date - b.date)
            .slice(0, 3)
          setDestaques(proximos)
        }
      } catch {
        setDestaques([])
      }
    }
    carregar()
  }, [])

  return (
    <>
      <NavMenu />

      <main className="min-h-screen flex flex-col justify-start items-center bg-[#111827] px-4 py-10 font-sans text-white">
        {/* HeroCarousel menor */}
        <div className="w-full mb-10">
          <HeroCarousel
            slides={
              destaques.length
                ? destaques.map(ev => ({
                    src: ev.imagem || "/slides/default.jpg",
                    alt: ev.nome,
                  }))
                : [
                    { src: "/slides/event1.jpg", alt: "Evento 1" },
                    { src: "/slides/event2.jpg", alt: "Evento 2" },
                    { src: "/slides/event3.jpg", alt: "Evento 3" },
                  ]
            }
            title="Destaques da Semana"
            interval={6000}
            height="h-40 md:h-60"
          />
        </div>
        
        {/* Hero Textual do site */}
        <div className="flex flex-col items-center mb-6 space-y-6">
          {/* Logo e Título lado a lado */}
          <div className="flex items-center space-x-4">
            <Image src={Logo} alt="Logo Rolezito" width={100} height={70} />
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#E11D48] tracking-tight">
              Rolezito
            </h1>
          </div>
          {/* Subtítulo */}
          <h2 className="text-xl md:text-2xl text-[#0EA5E9] font-medium text-center">
            Encontre os rolês mais quentes da cidade!
          </h2>
          {/* Descrição */}
          <p className="text-center text-[#D1D5DB] text-lg max-w-2xl leading-relaxed">
            Explore bares, festas, eventos e promoções imperdíveis em um só lugar.
            <br />
            <span className="font-semibold text-[#E11D48]">
              Chega de perder rolê bom!
            </span>
          </p>
          {/* Botão CTA */}
          <Link
            href="/eventos"
            className="bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all text-lg"
          >
            Ver Agenda de Eventos
          </Link>
        </div>

        {/* Próximos Eventos */}
        <section className="w-full max-w-4xl mt-4">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Próximos Eventos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {destaques.map(ev => (
              <div key={ev.id} className="bg-[#1f2937] p-4 rounded-xl shadow-md">
                <h4 className="text-lg font-semibold text-white mb-1">
                  {ev.nome}
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                  {ev.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
                <Link
                  href={`/eventos/${ev.id}`}
                  className="text-[#0EA5E9] hover:underline text-sm"
                >
                  Ver detalhes →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Nossos Patrocinadores */}
        <section className="w-full max-w-4xl bg-[#1F2937] rounded-xl p-6 mt-12">
          <h3 className="text-center text-lg font-semibold text-[#9CA3AF] mb-4">
            Nossos Patrocinadores
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {sponsors.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Patrocinador ${idx + 1}`}
                className="h-12 object-contain"
              />
            ))}
          </div>
        </section>

        {/* Rodapé */}
        <footer className="mt-16 text-[#9CA3AF] text-sm text-center">
          Desenvolvido por <strong className="text-[#0EA5E9]">Denesson Barreto</strong> © {new Date().getFullYear()}
        </footer>
      </main>
    </>
  )
}
