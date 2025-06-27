"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import NavMenu from "../components/NavMenu"
import Footer from "../components/Footer"

// Função de validação de força
function validaSenha(senha) {
  return {
    min: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
  }
}

export default function CadastroPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [role, setRole] = useState("usuario")
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const router = useRouter()

  // Validação visual de senha
  const regras = validaSenha(senha)
  const força = Object.values(regras).filter(v => v).length

  const handleCadastro = async () => {
    setErro("")
    setSucesso("")

    // Checagem completa dos critérios de senha forte
    if (
      !regras.min ||
      !regras.maiuscula ||
      !regras.minuscula ||
      !regras.numero ||
      !regras.especial
    ) {
      return setErro(
        "A senha deve ter pelo menos 8 caracteres, incluir letra maiúscula, minúscula, número e caractere especial."
      )
    }

    if (senha !== confirmarSenha) {
      return setErro("As senhas não coincidem")
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        email,
        senha,
        confirmarSenha,
        role,
      }),
    })

    const data = await res.json()
    if (!res.ok) return setErro(data.erro)

    setSucesso("Conta criada com sucesso! Redirecionando para login...")
    setTimeout(() => router.push("/login"), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      <NavMenu />
      <div className="max-w-md mx-auto mt-10 p-6 bg-[#1e293b] border border-[#334155] shadow-md rounded-xl space-y-4">
        <h2 className="text-3xl font-bold text-center text-[#E11D48]">
          Criar Conta
        </h2>

        {erro && <p className="text-red-600">{erro}</p>}
        {sucesso && <p className="text-green-500">{sucesso}</p>}

        {/* Nome */}
        <input
          type="text"
          placeholder="Nome de usuário"
          className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white placeholder-[#9CA3AF]"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white placeholder-[#9CA3AF]"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        {/* Senha */}
        <div className="relative">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white pr-10 placeholder-[#9CA3AF]"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            autoComplete="new-password"
          />
          <span
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-3 cursor-pointer text-red-500"
          >
            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {/* Barra de força */}
        <div className="flex gap-2 mb-2">
          <div className={`h-2 w-10 rounded ${força >= 1 ? "bg-red-500" : "bg-gray-300"}`} />
          <div className={`h-2 w-10 rounded ${força >= 3 ? "bg-yellow-400" : "bg-gray-300"}`} />
          <div className={`h-2 w-10 rounded ${força === 5 ? "bg-green-500" : "bg-gray-300"}`} />
        </div>
        {/* Regras visuais */}
        <ul className="text-xs mt-0 mb-2 space-y-1">
          <li className={regras.min ? "text-green-500" : "text-red-400"}>• 8+ caracteres</li>
          <li className={regras.maiuscula ? "text-green-500" : "text-red-400"}>• Letra maiúscula</li>
          <li className={regras.minuscula ? "text-green-500" : "text-red-400"}>• Letra minúscula</li>
          <li className={regras.numero ? "text-green-500" : "text-red-400"}>• Número</li>
          <li className={regras.especial ? "text-green-500" : "text-red-400"}>• Caractere especial (!@#...)</li>
        </ul>

        {/* Confirmar senha */}
        <div className="relative">
          <input
            type={mostrarConfirmacao ? "text" : "password"}
            placeholder="Confirmar senha"
            className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white pr-10 placeholder-[#9CA3AF]"
            value={confirmarSenha}
            onChange={e => setConfirmarSenha(e.target.value)}
            autoComplete="new-password"
          />
          <span
            onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
            className="absolute right-3 top-3 cursor-pointer text-red-500"
          >
            {mostrarConfirmacao ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Select de papel */}
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full p-3 border border-[#475569] rounded bg-[#1e293b] text-white"
        >
          <option value="usuario">Usuário</option>
          <option value="produtor">Produtor</option>
        </select>

        <button
          onClick={handleCadastro}
          className="w-full bg-[#E11D48] text-white py-2 rounded font-semibold hover:bg-[#F43F5E] transition"
        >
          Cadastrar
        </button>

        <p className="text-center text-sm text-[#9CA3AF]">
          Já tem conta?{" "}
          <a
            href="/login"
            className="underline text-[#0EA5E9] hover:text-[#38BDF8]"
          >
            Faça login
          </a>
        </p>
      </div>
      <Footer />
    </div>
  )
}
