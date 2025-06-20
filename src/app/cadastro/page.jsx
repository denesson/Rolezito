"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import NavMenu from "../components/NavMenu"

export default function CadastroPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const router = useRouter()

  const handleCadastro = async () => {
    setErro("")
    setSucesso("")

    if (senha.length < 6 || !/\d/.test(senha)) {
      return setErro("A senha deve ter pelo menos 6 caracteres e conter números")
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha, confirmarSenha }),
    })

    const data = await res.json()
    if (!res.ok) return setErro(data.erro)

    setSucesso("Conta criada com sucesso! Redirecionando para login...")
    setTimeout(() => router.push("/login"), 2000)
  }

  return (
    <>
      <NavMenu />
      <div className="max-w-md mx-auto mt-10 p-6 bg-[#fff1f5] border border-[#fbb6ce] shadow-md rounded-xl space-y-4">
        <h2 className="text-2xl font-bold text-center text-[#be185d]">Criar Conta</h2>

        {erro && <p className="text-red-600 font-medium">{erro}</p>}
        {sucesso && <p className="text-green-600 font-medium">{sucesso}</p>}

        <input
          type="text"
          placeholder="Nome de usuário"
          className="w-full p-3 border rounded bg-white placeholder-[#be185d] text-[#831843] border-[#fbb6ce]"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded bg-white placeholder-[#be185d] text-[#831843] border-[#fbb6ce]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            className="w-full p-3 border rounded bg-white placeholder-[#be185d] text-[#831843] pr-10 border-[#fbb6ce]"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <span
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-3 cursor-pointer text-[#be185d]"
          >
            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <div className="relative">
          <input
            type={mostrarConfirmacao ? "text" : "password"}
            placeholder="Confirmar senha"
            className="w-full p-3 border rounded bg-white placeholder-[#be185d] text-[#831843] pr-10 border-[#fbb6ce]"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <span
            onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
            className="absolute right-3 top-3 cursor-pointer text-[#be185d]"
          >
            {mostrarConfirmacao ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <p className="text-sm text-[#831843]">A senha deve conter pelo menos 6 caracteres e incluir números.</p>

        <button
          onClick={handleCadastro}
          className="w-full bg-[#be185d] text-white font-semibold py-3 rounded hover:bg-[#9d174d] transition"
        >
          Cadastrar
        </button>

        <p className="text-center text-sm mt-2 text-[#831843]">
          Já tem conta?{" "}
          <a href="/login" className="text-[#be185d] underline hover:text-[#881337]">Faça login</a>
        </p>
      </div>
    </>
  )
}
