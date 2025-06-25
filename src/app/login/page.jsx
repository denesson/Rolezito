// src/app/login/page.jsx
"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import NavMenu from "../components/NavMenu"
import Footer from "../components/Footer"
import { useAuth } from "../hooks/useAuth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [nome, setNome] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")

  async function handleLogin(e) {
    e.preventDefault()
    setErro("")

    try {
      // usa o login do hook, que faz o POST e já guarda o usuário
      await login({ nome, senha })
      router.push("/eventos")
    } catch (err) {
      // o hook lança com err.message vindo do backend
      setErro(err.message || "Erro ao logar")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <NavMenu />
      <main className="flex-grow flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="max-w-md w-full bg-[#1F2937] border border-[#334155] rounded-xl shadow p-6 space-y-6 text-white"
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

          {erro && (
            <div className="text-red-500 text-sm text-center">{erro}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#E11D48] text-white py-2 rounded font-semibold hover:bg-[#F43F5E] transition"
          >
            Entrar
          </button>

          <div className="text-sm text-center space-x-2 text-[#9CA3AF]">
            <a
              href="/cadastro"
              className="underline text-[#0EA5E9] hover:text-[#38BDF8]"
            >
              Cadastre-se
            </a>
            <a
              href="/recuperar-senha"
              className="underline text-[#0EA5E9] hover:text-[#38BDF8]"
            >
              Esqueceu sua senha?
            </a>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  )
}
