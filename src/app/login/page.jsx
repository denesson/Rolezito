// src/app/login/page.jsx
"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import NavMenu from "../components/NavMenu"
import Footer from "../components/Footer"

export default function LoginPage() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")

  // Redireciona se já estiver logado (token no localStorage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) router.replace("/eventos")
    }
  }, [router])

  async function handleLogin(e) {
    e.preventDefault()
    setErro("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, senha }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || "Erro ao logar")

      // Salva token e user no localStorage - role vindo do backend!
      localStorage.setItem("token", data.token)
      localStorage.setItem(
        "user",
        JSON.stringify({
          nome: data.nome,      // nome correto do banco
          email: data.email,
          admin: data.admin,
          role: data.role,      // role correta do banco
        })
      )
      router.push("/eventos")
    } catch (err) {
      setErro(err.message || "Erro ao logar")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <NavMenu />
      <main className="flex-grow flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-[#1F2937] border border-[#334155] rounded-xl shadow p-6 space-y-6 text-white"
        >
          <h1 className="text-3xl font-bold text-center text-[#E11D48]">
            Login Admin
          </h1>

          <input
            type="text"
            placeholder="Nome de usuário"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border border-[#334155] bg-[#111827] text-white placeholder-gray-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
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

          <div className="flex justify-between text-sm text-[#9CA3AF]">
            <Link
              href="/cadastro"
              className="underline text-[#0EA5E9] hover:text-[#38BDF8]"
            >
              Cadastre-se
            </Link>
            <Link
              href="/recuperar-senha"
              className="underline text-[#0EA5E9] hover:text-[#38BDF8]"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
