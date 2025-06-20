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
    } catch {
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
      <div className="max-w-4xl mx-auto py-12 px-6 bg-[#fff8e1] border border-[#e0c38b] rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-[#7b3f00] text-center">Gerenciar Usuários</h1>

        {erro && <div className="text-red-600 font-semibold mb-4 text-center">{erro}</div>}

        {loading ? (
          <div className="text-[#5c3b00] text-center">Carregando usuários...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-sm">
            <table className="w-full border-collapse bg-white rounded-xl overflow-hidden">
              <thead className="bg-[#faeecf] text-[#5c3b00] font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-center">Tipo</th>
                  <th className="py-3 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-t border-[#f0e5c4] hover:bg-[#fffdf6] transition">
                    <td className="py-3 px-4 text-[#4b2c00] font-medium">{u.nome}</td>
                    <td className="py-3 px-4 text-[#4b2c00]">{u.email}</td>
                    <td className="py-3 px-4 text-center text-[#4b2c00]">
                      {u.admin ? "Admin" : "Comum"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm transition ${
                          u.admin
                            ? "bg-[#c0392b] hover:bg-[#a93226]"
                            : "bg-[#2e7d32] hover:bg-[#1b5e20]"
                        } text-white`}
                        onClick={() => toggleAdmin(u.id, u.admin)}
                      >
                        {u.admin ? "Tornar Comum" : "Tornar Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
