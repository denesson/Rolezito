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
  useEffect(() => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user")
    if (!userStr) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userStr)
    if (!user.admin) {
      router.push("/login")
    }
  }
}, [])

  useEffect(() => {
    fetchEventos()
  }, [])

  async function fetchEventos() {
    const resp = await fetch("/api/eventos")
    if (resp.ok) {
      const lista = await resp.json()
      setEventos(lista)
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
      data: form.data ? new Date(form.data).toISOString() : new Date().toISOString(),
      local: form.local,
      descricao: form.descricao,
      preco: form.preco,
      categoria: form.categoria,
      imagem: form.imagem,
      destaque: form.destaque,
    }

    if (editId !== null) {
      try {
        const resp = await fetch(`/api/eventos/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!resp.ok) {
          alert("Erro ao atualizar evento")
          return
        }
        resetForm()
        fetchEventos()
      } catch (err) {
        alert("Erro na conexão com a API")
      }
      return
    }

    try {
      const resp = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) {
        alert("Erro ao cadastrar evento")
        return
      }
      resetForm()
      fetchEventos()
    } catch (err) {
      alert("Erro na conexão com a API")
    }
  }

  function handleEditar(id) {
    const ev = eventos.find((e) => e.id === id)
    setForm({
      nome: ev.nome,
      data: ev.data ? ev.data.slice(0, 16) : "",
      local: ev.local,
      preco: ev.preco,
      descricao: ev.descricao,
      imagem: ev.imagem || "",
      categoria: ev.categoria,
      destaque: !!ev.destaque,
    })
    setEditId(id)
  }

  async function handleExcluir(id) {
    if (confirm("Quer mesmo excluir esse evento?")) {
      try {
        const resp = await fetch(`/api/eventos/${id}`, { method: "DELETE" })
        if (!resp.ok) {
          alert("Erro ao excluir evento")
          return
        }
        fetchEventos()
        if (editId === id) resetForm()
      } catch (err) {
        alert("Erro na conexão com a API")
      }
    }
  }

  return (
    <>
      <NavMenu />
      <main className="max-w-5xl mx-auto px-6 py-10 mb-16 bg-[#fff8e1] border border-[#e8d8aa] rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-[#7b3f00] text-center">
          Painel Admin — Gerenciar Eventos
        </h1>

        <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded-xl border border-[#e0c38b] shadow-md">
          <input type="text" name="nome" placeholder="Nome do evento" value={form.nome} onChange={handleChange} required className="w-full p-3 border border-[#d6b98a] rounded bg-[#fdf6e3] text-[#5c3b00]" />
          <input type="datetime-local" name="data" placeholder="Data e horário" value={form.data} onChange={handleChange} required className="w-full p-3 border border-[#d6b98a] rounded bg-[#fdf6e3] text-[#5c3b00]" />
          <input type="text" name="local" placeholder="Local" value={form.local} onChange={handleChange} required className="w-full p-3 border border-[#d6b98a] rounded bg-[#fdf6e3] text-[#5c3b00]" />
          <input type="text" name="preco" placeholder="Preço (ex: Grátis, R$ 15)" value={form.preco} onChange={handleChange} className="w-full p-3 border border-[#d6b98a] rounded bg-[#fdf6e3] text-[#5c3b00]" />
          <input type="text" name="categoria" placeholder="Categoria (ex: Música, Bar)" value={form.categoria} onChange={handleChange} className="w-full p-3 border border-[#d6b98a] rounded bg-[#fdf6e3] text-[#5c3b00]" />
          <input type="url" name="imagem" placeholder="URL da imagem" value={form.imagem} onChange={handleChange} className="w-full p-3 border border-[#d6b98a] rounded bg-[#fdf6e3] text-[#5c3b00]" />
          <textarea name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} className="w-full p-3 border border-[#d6b98a] rounded bg-[#fdf6e3] text-[#5c3b00]" rows={4} />
          <label className="flex items-center gap-2 text-[#5c3b00] font-medium">
            <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} className="accent-[#7b3f00]" />
            Evento em destaque / Promoção
          </label>
          <div className="flex flex-wrap gap-4">
            <button type="submit" className="bg-[#2e7d32] text-white px-6 py-2 rounded font-semibold hover:bg-[#1b5e20] transition">
              {editId !== null ? "Atualizar Evento" : "Adicionar Evento"}
            </button>
            {editId !== null && (
              <button type="button" onClick={resetForm} className="px-6 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 transition">
                Cancelar
              </button>
            )}
          </div>
        </form>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#7b3f00]">Eventos Cadastrados</h2>
          {eventos.length === 0 ? (
            <p className="text-gray-500">Nenhum evento cadastrado.</p>
          ) : (
            <ul className="space-y-3">
              {eventos.map((ev) => (
                <li key={ev.id} className={`border rounded-xl p-4 flex justify-between items-center ${ev.destaque ? "border-[#d4af37] bg-[#fff9e6]" : "border-[#e0c38b] bg-white"} shadow-sm`}>
                  <div>
                    <strong className="text-[#5c3b00]">{ev.nome}</strong>
                    <span className="ml-2 text-xs text-gray-500">
                      {ev.data && new Date(ev.data).toLocaleString("pt-BR")}
                    </span>
                    {ev.destaque && (
                      <span className="ml-2 px-2 py-1 rounded bg-[#ffe08a] text-[#5c3b00] text-xs font-bold">Promoção</span>
                    )}
                    <div className="text-sm text-gray-600">{ev.local} — {ev.categoria} — {ev.preco}</div>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <button onClick={() => handleEditar(ev.id)} className="text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => handleExcluir(ev.id)} className="text-red-600 hover:underline">Excluir</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}
