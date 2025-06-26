"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NavMenu from "../../components/NavMenu"

export default function GerenciarUsuarios() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState("")

  // Proteção de rota: só permite acesso a admins
  useEffect(() => {
    if (typeof window === "undefined") return

    const raw = localStorage.getItem("user")
    if (!raw) {
      router.push("/login")
      return
    }

    let user
    try {
      user = JSON.parse(raw)
    } catch {
      router.push("/login")
      return
    }

    if (!user.admin) {
      router.push("/login")
    }
  }, [router])

  // Carrega lista de usuários
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
      <main className="min-h-screen bg-[#0f172a] text-white px-4 py-12 flex flex-col items-center justify-start">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-red-500 text-center">Gerenciar Usuários</h1>

        {erro && <div className="text-red-400 font-semibold mb-4 text-center">{erro}</div>}

        <div className="w-full max-w-5xl overflow-x-auto rounded-xl shadow-sm">
          {loading ? (
            <div className="text-gray-400 text-center">Carregando usuários...</div>
          ) : (
            <table className="w-full border-collapse bg-[#1e293b] rounded-xl overflow-hidden">
              <thead className="bg-[#334155] text-white font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-center">Tipo</th>
                  <th className="py-3 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-t border-[#475569] hover:bg-[#1e293b] transition">
                    <td className="py-3 px-4 text-white font-medium">{u.nome}</td>
                    <td className="py-3 px-4 text-gray-300">{u.email}</td>
                    <td className="py-3 px-4 text-center text-gray-300">
                      {u.admin ? "Admin" : "Comum"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm transition ${
                          u.admin
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
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
          )}
        </div>
      </main>
    </>
  )
}