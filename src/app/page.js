// src/app/page.jsx (ou Home)
"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import NavMenu from "../app/components/NavMenu"
import EventCard from "../app/components/EventCard"
import Logo from "../../public/logo-rolezito.png"

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
      <main className="min-h-screen flex flex-col justify-center items-center bg-[#111827] px-4 py-16 font-sans text-white">
        {/* Logo e título */}
        <div className="flex items-center space-x-4 mb-6">
          <Image src={Logo} alt="Logo Rolezito" width={100} height={70} />
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#E11D48] tracking-tight">
            Rolezito
          </h1>
        </div>

        {/* Subtítulo */}
        <h2 className="text-xl md:text-2xl text-[#0EA5E9] mb-4 font-medium text-center">
          Encontre os rolês mais quentes da cidade!
        </h2>

        {/* Descrição */}
        <p className="text-center text-[#D1D5DB] text-lg max-w-2xl mb-8 leading-relaxed">
          Explore bares, festas, eventos e promoções imperdíveis em um só lugar.
          <br />
          <span className="font-semibold text-[#E11D48]">
            Chega de perder rolê bom!
          </span>
        </p>

        {/* Botão */}
        <Link
          href="/eventos"
          className="bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all text-lg"
        >
          Ver Agenda de Eventos
        </Link>

        {/* Destaques (próximos eventos) */}
        <section className="w-full max-w-4xl mt-12">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Próximos Eventos
          </h3>
          <div className="flex overflow-x-auto gap-4">
            {destaques.map(ev => (
              <div key={ev.id} className="min-w-[280px] bg-[#1f2937] p-4 rounded-xl shadow-md">
                <h4 className="text-lg font-semibold text-white mb-1">
                  {ev.nome}
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                  {new Date(ev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
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

        {/* Rodapé */}
        <footer className="mt-16 text-[#9CA3AF] text-sm text-center">
          Desenvolvido por <strong className="text-[#0EA5E9]">Denesson Barreto</strong> © {new Date().getFullYear()}
        </footer>
      </main>
    </>
  )
}
