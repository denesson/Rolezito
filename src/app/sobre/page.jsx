"use client"
import Link from "next/link"
import NavMenu from "../components/NavMenu"

export default function SobrePage() {
  return (
    <>
      <NavMenu />
      <div className="bg-[#111827] min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#E11D48] mb-6 text-center">Sobre o Rolezito</h1>

          <p className="text-lg mb-4 text-[#D1D5DB]">
            O <span className="font-bold text-white">Rolezito</span> é uma plataforma feita para você descobrir, compartilhar e aproveitar os melhores eventos, baladas, festas e promoções da sua cidade, de forma simples e rápida.
          </p>

          <p className="mb-4 text-[#D1D5DB]">
            Nosso objetivo é conectar pessoas aos melhores rolês, promovendo experiências incríveis sem complicação. No Rolezito, você pode encontrar eventos gratuitos, bares, festivais, baladas, shows, gastronomia, além de promoções e descontos exclusivos.
          </p>

          <ul className="list-disc list-inside mb-4 text-[#F43F5E] font-medium">
            <li>Encontre eventos por categoria e data</li>
            <li>Descubra promoções e descontos de verdade</li>
            <li>Salve seus favoritos e compartilhe com os amigos</li>
            <li>Simples, prático e feito para quem gosta de curtir!</li>
          </ul>

          <p className="mb-6 text-[#D1D5DB]">
            O site é atualizado constantemente para trazer o que há de melhor em diversão e lazer para você. Tem sugestões, críticas ou quer anunciar seu evento?{" "}
            <Link href="/contato" className="text-[#0EA5E9] underline hover:text-[#38BDF8]">
              Fale com a gente!
            </Link>
          </p>

          <div className="mt-8 text-center">
            <span className="text-sm text-[#9CA3AF]">
              Feito com ❤️ por Denesson Barreto e equipe. {new Date().getFullYear()}.
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
