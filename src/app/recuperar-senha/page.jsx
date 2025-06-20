"use client"
import { useState } from "react"
import NavMenu from "../components/NavMenu"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")

  const handleEnviar = async () => {
    setErro("")
    setMensagem("")

    const res = await fetch("/api/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (!res.ok) return setErro(data.erro)

    setMensagem("Enviamos um link de recuperação para seu e-mail.")
  }

  return (
    <>
      <NavMenu />
      <div className="min-h-screen flex items-center justify-center bg-[#111827] px-4">
        <div className="max-w-md w-full bg-[#1F2937] shadow-lg rounded-xl p-6 space-y-5">
          <h2 className="text-3xl font-bold text-center text-[#E11D48] mb-2">Recuperar Senha</h2>

          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          {mensagem && <p className="text-green-500 text-sm">{mensagem}</p>}

          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full border border-[#334155] px-4 py-2 rounded text-[#D1D5DB] bg-[#111827] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleEnviar}
            className="w-full bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold py-2 rounded-full transition-all"
          >
            Enviar link de recuperação
          </button>
        </div>
      </div>
    </>
  )
}
