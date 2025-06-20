"use client"
import { useState } from "react"
import NavMenu from "../components/NavMenu"

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" })
  const [ok, setOk] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    // Aqui só simula envio. Depois pode integrar com backend/email/Telegram.
    setOk(true)
    setForm({ nome: "", email: "", mensagem: "" })
    setTimeout(() => setOk(false), 5000) // Esconde o aviso depois de 5s
  }

  return (
    <>
    <NavMenu />
      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Contato</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Tem dúvidas, sugestões ou quer divulgar seu evento? Envie sua mensagem!
        </p>
        {ok && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center font-semibold shadow">
            Mensagem enviada com sucesso! 😉
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            value={form.nome}
            onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Seu email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <textarea
            name="mensagem"
            placeholder="Sua mensagem"
            value={form.mensagem}
            onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
            required
            rows={4}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition w-full"
          >
            Enviar
          </button>
        </form>
      </main>
    </>
  )
}
