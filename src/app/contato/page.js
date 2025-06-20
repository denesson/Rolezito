"use client"
import { useState } from "react"
import NavMenu from "../components/NavMenu"

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" })
  const [ok, setOk] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setOk(true)
    setForm({ nome: "", email: "", mensagem: "" })
    setTimeout(() => setOk(false), 5000)
  }

  return (
    <>
      <NavMenu />
      <main className="min-h-screen bg-[#111827] text-white px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl font-bold mb-4 text-[#E11D48]">Contato</h1>
          <p className="text-[#D1D5DB] mb-6">
            Tem dúvidas, sugestões ou quer divulgar seu evento? Envie sua mensagem!
          </p>

          {ok && (
            <div className="bg-green-600/20 text-green-400 px-4 py-2 rounded mb-4 text-center font-semibold shadow">
              Mensagem enviada com sucesso! 😉
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-[#1F2937] p-6 rounded-xl shadow-md border border-[#334155]"
          >
            <input
              type="text"
              name="nome"
              placeholder="Seu nome"
              value={form.nome}
              onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              required
              className="w-full p-3 border border-[#334155] rounded bg-[#111827] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
            />
            <input
              type="email"
              name="email"
              placeholder="Seu email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              className="w-full p-3 border border-[#334155] rounded bg-[#111827] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
            />
            <textarea
              name="mensagem"
              placeholder="Sua mensagem"
              value={form.mensagem}
              onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
              required
              rows={4}
              className="w-full p-3 border border-[#334155] rounded bg-[#111827] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
            />
            <button
              type="submit"
              className="bg-[#E11D48] hover:bg-[#F43F5E] text-white px-6 py-2 rounded font-semibold transition w-full"
            >
              Enviar
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
