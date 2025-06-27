"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import NavMenu from "../components/NavMenu"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Categorias fixas
const CATEGORIAS = [
  "Música",
  "Bar",
  "Gastronomia",
  "Festival",
  "Cultura",
  "Grátis",
]

export default function AdminPanel() {
  const router = useRouter()
  const [eventos, setEventos] = useState([])
  const [form, setForm] = useState({ nome: '', data: '', local: '', preco: '', descricao: '', imagem: '', categoria: '', destaque: false })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [filterName, setFilterName] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [sortOrder, setSortOrder] = useState(null)

  // Guard de rota
  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = localStorage.getItem("user")
    if (!raw) {
      router.replace("/login")
      return
    }
    let user
    try { user = JSON.parse(raw) } catch { router.replace("/login"); return }
    if (
      user.role !== "admin" &&
      user.role !== "produtor" &&
      user.admin !== true
    ) {
      router.replace("/login")
    }
  }, [router])

  // Sempre pega token do localStorage
  function getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  // *** SEMPRE CARREGUE OS EVENTOS AO MONTAR ***
  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos() {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Sem token")
      const resp = await fetch("/api/admin", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
      if (!resp.ok) throw new Error()
      setEventos(await resp.json())
    } catch {
      toast.error("Erro ao carregar eventos")
    }
  }

  // Upload de arquivo para imagem (sem alteração)
  async function handleFileSelect(e) {
    const file = e.target.files[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setForm(f => ({ ...f, imagem: previewUrl }))
    const formData = new FormData()
    formData.append("file", file)
    try {
      const resp = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!resp.ok) throw new Error()
      const { url } = await resp.json()
      setForm(f => ({ ...f, imagem: url }))
    } catch {
      toast.error('Falha ao enviar a imagem')
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }
  function resetForm() {
    setForm({ nome: '', data: '', local: '', preco: '', descricao: '', imagem: '', categoria: '', destaque: false })
    setEditId(null)
  }
  function openModal(isNew, id) {
    if (isNew) {
      resetForm()
    } else if (id != null) {
      const ev = eventos.find(e => e.id === id)
      setForm({
        nome: ev.nome,
        data: ev.data ? new Date(ev.data).toISOString().slice(0, 16) : '',
        local: ev.local,
        preco: ev.preco,
        descricao: ev.descricao,
        imagem: ev.imagem || '',
        categoria: ev.categoria,
        destaque: ev.destaque,
      })
      setEditId(id)
    }
    setShowFormModal(true)
  }

  // Adiciona Authorization nos fetch
  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    const payload = { ...form, data: form.data ? new Date(form.data).toISOString() : new Date().toISOString() }
    const url = editId != null ? `/api/admin/${editId}` : '/api/admin'
    const method = editId != null ? 'PUT' : 'POST'
    try {
      const token = getToken()
      const resp = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      if (!resp.ok) throw new Error()
      toast.success(editId != null ? 'Evento atualizado' : 'Evento criado')
      resetForm(); fetchEventos(); setShowFormModal(false)
    } catch {
      toast.error('Erro ao salvar evento')
    } finally { setLoading(false) }
  }

  async function handleExcluir(id) {
    if (!window.confirm('Quer excluir este evento?')) return
    setDeleteId(id)
    try {
      const token = getToken()
      const resp = await fetch(`/api/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!resp.ok) throw new Error()
      toast.success('Evento excluído')
      resetForm(); fetchEventos()
    } catch {
      toast.error('Erro ao excluir evento')
    } finally { setDeleteId(null) }
  }

  // Filtrar e ordenar
  const filtered = eventos.filter(ev =>
    ev.nome.toLowerCase().includes(filterName.toLowerCase()) &&
    (!filterCategory || ev.categoria === filterCategory)
  )
  const sorted = filtered.slice().sort((a, b) => {
    if (!sortOrder) return 0
    return sortOrder === 'asc'
      ? new Date(a.data) - new Date(b.data)
      : new Date(b.data) - new Date(a.data)
  })

  return (
    <>
      <NavMenu />
      <ToastContainer position='top-right' autoClose={3000} hideProgressBar />
      <main className="min-h-screen bg-[#111827] p-6 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          <h1 className="text-3xl text-red-500 font-bold text-center">Painel Admin — Gerenciar Eventos</h1>

          {/* Botão de adicionar */}
          <div className="flex justify-end">
            <button onClick={() => openModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold">Adicionar Evento</button>
          </div>

          {/* Filtros & Ordenação */}
          <div className="flex flex-wrap gap-4 items-center">
            <input value={filterName} onChange={e => setFilterName(e.target.value)} placeholder="Buscar por nome..." className="flex-1 p-3 bg-[#1e293b] rounded border border-[#475569] text-white" />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="p-3 bg-[#1e293b] rounded border border-[#475569] text-white">
              <option value="">Todas categorias</option>
              {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button onClick={() => { setFilterName(''); setFilterCategory('') }} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">Limpar</button>
            <div className="ml-auto flex gap-2">
              <button onClick={() => setSortOrder('asc')} className={`p-2 rounded ${sortOrder === 'asc' ? 'bg-blue-600' : 'bg-gray-600'} text-white`}>Data ↑</button>
              <button onClick={() => setSortOrder('desc')} className={`p-2 rounded ${sortOrder === 'desc' ? 'bg-blue-600' : 'bg-gray-600'} text-white`}>Data ↓</button>
            </div>
          </div>

          {/* Lista de eventos */}
          {sorted.length === 0 ? (
            <p className="text-center text-gray-400">Nenhum evento encontrado.</p>
          ) : (
            <ul className="space-y-3">
              {sorted.map(ev => (
                <li key={ev.id} className={`flex justify-between items-center p-4 rounded-xl border shadow ${ev.destaque ? 'border-yellow-500 bg-[#1e293b]' : 'border-gray-600 bg-[#0f172a]'}`}>
                  <div>
                    <strong className="text-white">{ev.nome}</strong>
                    <span className="ml-2 text-xs text-gray-400">{ev.data && new Date(ev.data).toLocaleString('pt-BR')}</span>
                    <div className="text-sm text-gray-400">{ev.local} — {ev.categoria} — {ev.preco}</div>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={() => openModal(false, ev.id)} className="text-blue-400 hover:underline">Editar</button>
                    <button onClick={() => handleExcluir(ev.id)} disabled={deleteId === ev.id} className={`${deleteId === ev.id ? 'text-gray-500' : 'text-red-400 hover:underline'}`}>{deleteId === ev.id ? '...' : 'Excluir'}</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modal de Formulário */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
            <div className="bg-[#1e293b] w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-white">{editId != null ? 'Editar Evento' : 'Adicionar Evento'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome do evento *" required className="w-full p-3 bg-[#1e293b] rounded border border-[#475569] text-white" />
                <input type="datetime-local" name="data" value={form.data} onChange={handleChange} required className="w-full p-3 bg-[#1e293b] rounded border border-[#475569] text-white" />
                <input name="local" value={form.local} onChange={handleChange} placeholder="Local *" required className="w-full p-3 bg-[#1e293b] rounded border border-[#475569] text-white" />
                <input name="preco" value={form.preco} onChange={handleChange} placeholder="Preço (ex: Grátis)" className="w-full p-3 bg-[#1e293b] rounded border border-[#475569] text-white" />
                <select name="categoria" value={form.categoria} onChange={handleChange} required className="w-full p-3 bg-[#1e293b] rounded border border-[#475569] text-white">
                  <option value="" disabled>-- Categoria * --</option>
                  {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {/* Upload de arquivo **/}
                <div>
                  <label className="block text-white mb-1">Upload de imagem</label>
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="w-full text-white" />
                </div>
                <input name="imagem" value={form.imagem} onChange={handleChange} placeholder="URL da imagem" className="w-full p-3 bg-[#1e293b] rounded border border-[#475569] text-white" />
                {form.imagem && <img src={form.imagem} onError={e => e.currentTarget.style.display = 'none'} className="w-full rounded" alt="Preview" />}
                <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descrição" rows={3} className="w-full p-3 bg-[#1e293b] rounded border border-[#475569] text-white" />
                <label className="flex items-center gap-2 text-white"><input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} className="accent-red-500" />Evento em destaque / Promoção</label>
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 rounded border border-gray-500 text-gray-300 hover:bg-gray-700">Cancelar</button>
                  <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold">{loading ? 'Salvando...' : (editId != null ? 'Atualizar Evento' : 'Adicionar Evento')}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
