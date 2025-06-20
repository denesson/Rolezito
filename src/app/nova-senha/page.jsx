"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function NovaSenhaPage() {
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const handleSalvar = async () => {
    setErro("")
    setMensagem("")

    if (novaSenha !== confirmar) {
      return setErro("As senhas não coincidem")
    }

    const res = await fetch("/api/nova-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, novaSenha }),
    })

    const data = await res.json()
    if (!res.ok) return setErro(data.erro)

    setMensagem("Senha redefinida com sucesso! Redirecionando...")
    setTimeout(() => router.push("/login"), 3000)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl space-y-4">
      <h2 className="text-2xl font-bold text-center">Nova Senha</h2>

      {erro && <p className="text-red-500">{erro}</p>}
      {mensagem && <p className="text-green-500">{mensagem}</p>}

      <input type="password" placeholder="Nova senha" className="w-full border px-3 py-2 rounded"
        value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />

      <input type="password" placeholder="Confirmar nova senha" className="w-full border px-3 py-2 rounded"
        value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />

      <button onClick={handleSalvar}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700">
        Salvar nova senha
      </button>
    </div>
  )
}
