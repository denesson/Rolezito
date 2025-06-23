"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import NavMenu from "../components/NavMenu"
import Footer from "../components/Footer"

export default function LoginPage() {
  const [nome, setNome] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setErro("")
    const resp = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, senha }),
    })
    const data = await resp.json()
    if (!resp.ok) {
      setErro(data.erro || "Erro ao logar")
      return
    }

    localStorage.setItem("user", JSON.stringify({
      nome: data.nome,
      email: data.email,
      admin: data.admin,
    }))
    router.push("/eventos")
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <NavMenu />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#1F2937] border border-[#334155] rounded-xl shadow p-6 space-y-6 text-white">
          <h1 className="text-3xl font-bold text-center text-[#E11D48]">Login Admin</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Nome de usuário"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              className="w-full border border-[#334155] bg-[#111827] text-white placeholder-gray-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              required
              className="w-full border border-[#334155] bg-[#111827] text-white placeholder-gray-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
            />

            {erro && <div className="text-red-500 text-sm text-center">{erro}</div>}

            <button
              type="submit"
              className="w-full bg-[#E11D48] text-white py-2 rounded font-semibold hover:bg-[#F43F5E] transition"
            >
              Entrar
            </button>
          </form>

          <div className="text-sm text-center space-y-1 text-[#9CA3AF]">
            <p>
              Não tem conta?{' '}
              <a href="/cadastro" className="underline text-[#0EA5E9] hover:text-[#38BDF8]">Cadastre-se</a>
            </p>
            <p>
              <a href="/recuperar-senha" className="underline text-[#0EA5E9] hover:text-[#38BDF8]">
                Esqueceu sua senha?
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
