"use client"
import Link from "next/link"

export default function SobrePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6">Sobre o Rolezito</h1>
      <p className="text-lg mb-4 text-gray-800">
        O <span className="font-bold">Rolezito</span> é uma plataforma feita para você descobrir, compartilhar e aproveitar os melhores eventos, baladas, festas e promoções da sua cidade, de forma simples e rápida.
      </p>
      <p className="mb-4 text-gray-700">
        Nosso objetivo é conectar pessoas aos melhores rolês, promovendo experiências incríveis sem complicação. No Rolezito, você pode encontrar eventos gratuitos, bares, festivais, baladas, shows, gastronomia, além de promoções e descontos exclusivos.
      </p>
      <ul className="list-disc ml-5 mb-4 text-gray-700">
        <li>Encontre eventos por categoria e data</li>
        <li>Descubra promoções e descontos de verdade</li>
        <li>Salve seus favoritos e compartilhe com os amigos</li>
        <li>Simples, prático e feito para quem gosta de curtir!</li>
      </ul>
      <p className="mb-6 text-gray-700">
        O site é atualizado constantemente para trazer o que há de melhor em diversão e lazer para você. Tem sugestões, críticas ou quer anunciar seu evento? <Link href="/contato" className="text-blue-700 underline hover:text-blue-900">Fale com a gente!</Link>
      </p>
      <div className="mt-8">
        <span className="text-sm text-gray-500">Feito com ❤️ por Denesson Barreto e equipe. 2024.</span>
      </div>
    </div>
  )
}
