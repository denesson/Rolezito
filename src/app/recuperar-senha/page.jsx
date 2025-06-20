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
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl space-y-4">
        <h2 className="text-2xl font-bold text-center">Recuperar Senha</h2>

        {erro && <p className="text-red-500">{erro}</p>}
        {mensagem && <p className="text-green-500">{mensagem}</p>}

        <input
          type="email"
          placeholder="Digite seu e-mail"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleEnviar}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          Enviar link de recuperação
        </button>
      </div>
    </>
  )
}
