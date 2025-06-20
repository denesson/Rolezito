"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import NavMenu from "../components/NavMenu"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setErro("")
    const resp = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    })
    const data = await resp.json()
    if (!resp.ok) {
      setErro(data.erro || "Erro ao logar")
      return
    }
    // Salva token (poderia usar cookie seguro no back depois)
    localStorage.setItem("user", JSON.stringify({
      nome: data.nome,
      email: data.email,
      admin: data.admin,
    }))
    router.push("/eventos")
  }

  return (
    <>
      <NavMenu />
      <main className="max-w-md mx-auto mt-24 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Login Admin</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          {erro && <div className="text-red-600 text-sm">{erro}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
      </main>
    </>
  )
}
