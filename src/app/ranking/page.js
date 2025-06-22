"use client"
import React from "react"
import NavMenu from "../components/NavMenu"
import Footer from "../components/Footer"

export default function RankingPage() {
  const ranking = [
    { nome: "Bar do Zé", pontuacao: 9.7 },
    { nome: "Choperia Central", pontuacao: 9.3 },
    { nome: "Pagodeiro's", pontuacao: 8.9 },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      {/* Navbar fixa no topo */}
      <NavMenu />

      {/* Main cresce pra preencher o espaço disponível */}
      <main className="flex-grow max-w-xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-[#E11D48] text-center">
          Ranking de Bares
        </h1>

        <ol className="list-decimal pl-5 space-y-4">
          {ranking.map((b, i) => (
            <li
              key={i}
              className="bg-[#1F2937] border border-[#334155] flex justify-between items-center px-4 py-3 rounded-lg shadow-sm font-medium text-[#D1DDB]">
              <span>{b.nome}</span>
              <span className="font-bold text-[#F43F5E]">{b.pontuacao}</span>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-center text-sm text-[#9CA3AF]">
          Quer indicar um bar ou evento?{" "}
          <a
            href="/contato"
            className="underline text-[#0EA5E9] hover:text-[#38BDF8]">
            Fale com a gente
          </a>
        </p>
      </main>

      {/* Footer “grudado” no pé da viewport */}
      <Footer />
    </div>
  )
}
