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
    // Só deixa admin acessar
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const admin = localStorage.getItem("admin")
      if (!token || admin !== "true") {
        router.push("/login")
      }
    }
  }, [])

  // Buscar eventos ao carregar
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

  // SUBMIT: Cadastra novo evento OU atualiza existente
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
      // Atualizar evento existente (PUT)
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

    // Criar novo evento (POST)
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
      destaque: !!ev.destaque, // sempre booleano
    })
    setEditId(id)
  }

  async function handleExcluir(id) {
    if (confirm("Quer mesmo excluir esse evento?")) {
      // Excluir evento do backend (DELETE)
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
    <main className="max-w-4xl mx-auto px-4 py-8 mb-16">
      <h1 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400 text-center">
        Painel Admin — Gerenciar Eventos
      </h1>

      {/* Formulário de Cadastro/Edição */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4 bg-white p-6 rounded shadow dark:bg-gray-800">
        <input
          type="text"
          name="nome"
          placeholder="Nome do evento"
          value={form.nome}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="datetime-local"
          name="data"
          placeholder="Data e horário"
          value={form.data}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          name="local"
          placeholder="Local"
          value={form.local}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          name="preco"
          placeholder="Preço (ex: Grátis, R$ 15)"
          value={form.preco}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoria (ex: Música, Bar)"
          value={form.categoria}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="url"
          name="imagem"
          placeholder="URL da imagem"
          value={form.imagem}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          rows={4}
        />
        {/* Checkbox Promoção/Destaque */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="destaque"
            checked={form.destaque}
            onChange={handleChange}
            className="accent-blue-600"
          />
          Evento em destaque / Promoção
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          {editId !== null ? "Atualizar Evento" : "Adicionar Evento"}
        </button>
        {editId !== null && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 px-6 py-2 rounded border border-gray-400 hover:bg-gray-100 transition dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de eventos cadastrados */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Eventos Cadastrados</h2>
        {eventos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Nenhum evento cadastrado.</p>
        ) : (
          <ul className="space-y-3">
            {eventos.map((ev) => (
              <li
                key={ev.id}
                className={`border rounded p-3 flex justify-between items-center ${ev.destaque
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900"
                  : "border-gray-300 dark:border-gray-700"
                  }`}
              >
                <div>
                  <strong>{ev.nome}</strong>
                  <span className="ml-2 text-xs text-gray-400">
                    {ev.data && new Date(ev.data).toLocaleString("pt-BR")}
                  </span>
                  {ev.destaque && (
                    <span className="ml-2 px-2 py-1 rounded bg-yellow-300 text-yellow-900 text-xs font-bold">Promoção</span>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {ev.local} — {ev.categoria} — {ev.preco}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditar(ev.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(ev.id)}
                    className="text-red-600 hover:underline"
                  >
                    Excluir
                  </button>
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
