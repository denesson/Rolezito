"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEventos() {
      try {
        const resp = await fetch("/api/eventos")
        const data = await resp.json()
        setEventos(data)
      } catch {
        setEventos([])
      } finally {
        setLoading(false)
      }
    }
    fetchEventos()
  }, [])

  // // Exemplo: Para filtro por categoria, descomente e use o estado abaixo
  // const [categoriaAtiva, setCategoriaAtiva] = useState("Todos")
  // const eventosFiltrados = categoriaAtiva === "Todos"
  //   ? eventos
  //   : eventos.filter(ev =>
  //       Array.isArray(ev.categoria)
  //         ? ev.categoria.includes(categoriaAtiva)
  //         : ev.categoria === categoriaAtiva
  //     )

  if (loading) return <div className="text-center py-20 text-gray-400">Carregando eventos...</div>

  return (
    <main className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-4">Rolezito</h1>
      <div className="flex space-x-2 mb-4">
        {/* 
        Para filtros funcionar, use estado e onClick:
        <button
          className={`px-3 py-1 rounded-full ${categoriaAtiva === "Todos" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setCategoriaAtiva("Todos")}
        >Todos</button>
        */}
        <button className="bg-blue-600 text-white px-3 py-1 rounded-full">Todos</button>
        <button className="bg-gray-200 px-3 py-1 rounded-full">Promoções</button>
        <button className="bg-gray-200 px-3 py-1 rounded-full">Música</button>
        <button className="bg-gray-200 px-3 py-1 rounded-full">Bar</button>
        <button className="bg-gray-200 px-3 py-1 rounded-full">Balada</button>
      </div>
      <div className="space-y-6">
        {eventos.map((evento) => (
          <Link
            key={evento.id}
            href={`/eventos/${evento.id}`}
            className="block bg-white rounded-xl shadow p-4 hover:shadow-lg transition border border-gray-100"
          >
            <h2 className="font-semibold text-lg">{evento.nome}</h2>
            <p className="text-sm text-gray-600">
              {evento.data ? new Date(evento.data).toLocaleString("pt-BR") : ""} • {evento.local}
            </p>
            <p className="text-sm mt-2 text-gray-800">{evento.descricao}</p>
            <span className="block mt-1 font-bold text-blue-600">{evento.preco}</span>
          </Link>
        ))}
      </div>
      <footer className="text-center text-xs text-gray-400 py-8">
        Desenvolvido por Denesson Barreto © {new Date().getFullYear()}
      </footer>
    </main>
  )
}
