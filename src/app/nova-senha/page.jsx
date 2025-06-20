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
    <div className="min-h-screen bg-[#111827] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1F2937] border border-[#334155] shadow rounded-xl p-6 space-y-4 text-white">
        <h2 className="text-3xl font-bold text-center text-[#E11D48]">Nova Senha</h2>

        {erro && <p className="text-red-500 text-center">{erro}</p>}
        {mensagem && <p className="text-green-500 text-center">{mensagem}</p>}

        <input
          type="password"
          placeholder="Nova senha"
          className="w-full border border-[#334155] bg-[#111827] text-white placeholder-gray-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          className="w-full border border-[#334155] bg-[#111827] text-white placeholder-gray-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />

        <button
          onClick={handleSalvar}
          className="w-full bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold py-2 rounded transition-all"
        >
          Salvar nova senha
        </button>
      </div>
    </div>
  )
}
