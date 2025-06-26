"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NavMenu from "../components/NavMenu"

export default function AdminPanel() {
  const [eventos, setEventos] = useState([])
  const [form, setForm] = useState({
    nome: "",
    data: "",
    local: "",
    preco: "",
    descricao: "",
    imagem: "",
    categoria: "",
    destaque: false,
  })
  const [editId, setEditId] = useState(null)
  const router = useRouter()

  // Proteção de rota (cliente) usando role
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (!userStr) {
        router.push("/login")
        return
      }
      const user = JSON.parse(userStr)
      if (user.role !== "produtor" && user.role !== "admin") {
        router.push("/login")
      }
    }
  }, [router])

  // Carrega lista de eventos
  useEffect(() => {
    fetchEventos()
  }, [])

  async function fetchEventos() {
    try {
      const resp = await fetch("/api/admin")
      if (!resp.ok) throw new Error("Falha ao buscar eventos")
      const data = await resp.json()
      setEventos(data)
    } catch (err) {
      console.error(err)
      alert("Erro ao carregar eventos")
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  function resetForm() {
    setForm({
      nome: "",
      data: "",
      local: "",
      preco: "",
      descricao: "",
      imagem: "",
      categoria: "",
      destaque: false,
    })
    setEditId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      nome: form.nome,
      data: form.data
        ? new Date(form.data).toISOString()
        : new Date().toISOString(),
      local: form.local,
      descricao: form.descricao,
      preco: form.preco,
      categoria: form.categoria,
      imagem: form.imagem,
      destaque: form.destaque,
    }

    const url = editId !== null ? `/api/admin/${editId}` : "/api/admin"
    const method = editId !== null ? "PUT" : "POST"

    try {
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) throw new Error("Erro ao salvar evento")
      resetForm()
      fetchEventos()
    } catch (err) {
      console.error(err)
      alert(err.message || "Erro na conexão com a API")
    }
  }

  function handleEditar(id) {
    const ev = eventos.find(e => e.id === id)
    setForm({
      nome: ev.nome,
      data: ev.data
        ? new Date(ev.data).toISOString().slice(0, 16)
        : "",
      local: ev.local,
      preco: ev.preco,
      descricao: ev.descricao,
      imagem: ev.imagem || "",
      categoria: ev.categoria,
      destaque: ev.destaque,
    })
    setEditId(id)
  }

  async function handleExcluir(id) {
    if (!confirm("Quer mesmo excluir esse evento?")) return
    try {
      const resp = await fetch(`/api/admin/${id}`, { method: "DELETE" })
      if (!resp.ok) throw new Error("Erro ao excluir evento")
      resetForm()
      fetchEventos()
    } catch (err) {
      console.error(err)
      alert(err.message || "Erro na conexão com a API")
    }
  }

  return (
    <>
      <NavMenu />
      <main className="min-h-screen bg-[#111827] text-white px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-3xl bg-[#1e293b] border border-[#334155] rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-red-500">
            Painel Admin — Gerenciar Eventos
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mb-10 space-y-4 bg-[#0f172a] p-6 rounded-xl border border-[#334155] shadow-md"
          >
            <input
              type="text"
              name="nome"
              placeholder="Nome do evento"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white placeholder-gray-400"
            />
            <input
              type="datetime-local"
              name="data"
              value={form.data}
              onChange={handleChange}
              required
              className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white placeholder-gray-400"
            />
            <input
              type="text"
              name="local"
              placeholder="Local"
              value={form.local}
              onChange={handleChange}
              required
              className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white placeholder-gray-400"
            />
            <input
              type="text"
              name="preco"
              placeholder="Preço (ex: Grátis, R$ 15)"
              value={form.preco}
              onChange={handleChange}
              className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white placeholder-gray-400"
            />
            <input
              type="text"
              name="categoria"
              placeholder="Categoria (ex: Música, Bar)"
              value={form.categoria}
              onChange={handleChange}
              className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white placeholder-gray-400"
            />
            <input
              type="url"
              name="imagem"
              placeholder="URL da imagem"
              value={form.imagem}
              onChange={handleChange}
              className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white placeholder-gray-400"
            />
            <textarea
              name="descricao"
              placeholder="Descrição"
              value={form.descricao}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white placeholder-gray-400"
            />
            <label className="flex items-center gap-2 font-medium text-white">
              <input
                type="checkbox"
                name="destaque"
                checked={form.destaque}
                onChange={handleChange}
                className="accent-red-500"
              />
              Evento em destaque / Promoção
            </label>

            <div className="flex flex-wrap gap-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition"
              >
                {editId !== null ? "Atualizar Evento" : "Adicionar Evento"}
              </button>
              {editId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded border border-gray-400 text-gray-300 hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-red-400">
              Eventos Cadastrados
            </h2>
            {eventos.length === 0 ? (
              <p className="text-gray-400">Nenhum evento cadastrado.</p>
            ) : (
              <ul className="space-y-3">
                {eventos.map(ev => (
                  <li
                    key={ev.id}
                    className={`border rounded-xl p-4 flex justify-between items-center ${
                      ev.destaque
                        ? "border-yellow-500 bg-[#1e293b]"
                        : "border-gray-600 bg-[#0f172a]"
                    } shadow-sm`}
                  >
                    <div>
                      <strong className="text-white">{ev.nome}</strong>
                      <span className="ml-2 text-xs text-gray-400">
                        {ev.data &&
                          new Date(ev.data).toLocaleString("pt-BR")}
                      </span>
                      {ev.destaque && (
                        <span className="ml-2 px-2 py-1 rounded bg-yellow-400 text-black text-xs font-bold">
                          Promoção
                        </span>
                      )}
                      <div className="text-sm text-gray-400">
                        {ev.local} — {ev.categoria} — {ev.preco}
                      </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <button
                        onClick={() => handleEditar(ev.id)}
                        className="text-blue-400 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleExcluir(ev.id)}
                        className="text-red-400 hover:underline"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
