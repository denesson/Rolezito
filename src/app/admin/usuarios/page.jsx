"use client"
import { useEffect, useState } from "react"
import NavMenu from "../../components/NavMenu"

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {
    setLoading(true)
    setErro("")
    try {
      const resp = await fetch("/api/usuarios")
      const data = await resp.json()
      setUsuarios(data)
    } catch (err) {
      setErro("Erro ao buscar usuários")
    }
    setLoading(false)
  }

  async function toggleAdmin(id, adminAtual) {
    try {
      const resp = await fetch(`/api/usuarios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin: !adminAtual }),
      })
      if (resp.ok) {
        fetchUsuarios()
      } else {
        setErro("Erro ao atualizar usuário")
      }
    } catch {
      setErro("Erro ao atualizar usuário")
    }
  }

  return (
    <>
      <NavMenu />
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-8">Gerenciar Usuários</h1>
        {erro && <div className="text-red-500 mb-4">{erro}</div>}
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <table className="w-full border rounded-xl overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-3 text-left">Nome</th>
                <th className="py-2 px-3 text-left">Email</th>
                <th className="py-2 px-3 text-center">Tipo</th>
                <th className="py-2 px-3 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-2 px-3">{u.nome}</td>
                  <td className="py-2 px-3">{u.email}</td>
                  <td className="py-2 px-3 text-center">
                    {u.admin ? "Admin" : "Comum"}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      className={`px-3 py-1 rounded ${u.admin ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"} text-white`}
                      onClick={() => toggleAdmin(u.id, u.admin)}
                    >
                      {u.admin ? "Tornar Comum" : "Tornar Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
