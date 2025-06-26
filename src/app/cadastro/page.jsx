"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import NavMenu from "../components/NavMenu"
import Footer from "../components/Footer"

export default function CadastroPage() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [role, setRole] = useState("usuario")           // ← novo estado
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] =
    useState(false)
  const router = useRouter()

  const handleCadastro = async () => {
    setErro("")
    setSucesso("")

    if (senha.length < 6 || !/\d/.test(senha)) {
      return setErro(
        "A senha deve ter pelo menos 6 caracteres e conter números"
      )
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        email,
        senha,
        confirmarSenha,
        role,           // ← envio do tipo de usuário
      }),
    })

    const data = await res.json()
    if (!res.ok) return setErro(data.erro)

    setSucesso(
      "Conta criada com sucesso! Redirecionando para login..."
    )
    setTimeout(() => router.push("/login"), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827] text-white">
      <NavMenu />
      <div className="max-w-md mx-auto mt-10 p-6
                      bg-[#1e293b] border border-[#334155]
                      shadow-md rounded-xl space-y-4">
        <h2 className="text-3xl font-bold text-center text-[#E11D48]">
          Criar Conta
        </h2>

        {erro && <p className="text-red-600">{erro}</p>}
        {sucesso && <p className="text-green-500">{sucesso}</p>}

        {/* Nome */}
        <input
          type="text"
          placeholder="Nome de usuário"
          className="w-full p-3 border border-[#475569]
                     rounded bg-[#1e293b] text-white
                     placeholder-[#9CA3AF]"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-[#475569]
                     rounded bg-[#1e293b] text-white
                     placeholder-[#9CA3AF]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Senha */}
        <div className="relative">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            className="w-full p-3 border border-[#475569]
                       rounded bg-[#1e293b] text-white pr-10
                       placeholder-[#9CA3AF]"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <span
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-3 top-3 cursor-pointer text-red-500"
          >
            {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Confirmar senha */}
        <div className="relative">
          <input
            type={mostrarConfirmacao ? "text" : "password"}
            placeholder="Confirmar senha"
            className="w-full p-3 border border-[#475569]
                       rounded bg-[#1e293b] text-white pr-10
                       placeholder-[#9CA3AF]"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <span
            onClick={() =>
              setMostrarConfirmacao(!mostrarConfirmacao)
            }
            className="absolute right-3 top-3 cursor-pointer text-red-500"
          >
            {mostrarConfirmacao ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </span>
        </div>

        {/* Select de papel */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 border border-[#475569]
                     rounded bg-[#1e293b] text-white"
        >
          <option value="usuario">Usuário</option>
          <option value="produtor">Produtor</option>
        </select>

        <p className="text-sm text-[#9CA3AF]">
          A senha deve conter pelo menos 6 caracteres e incluir
          números.
        </p>

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
      <Footer/>
    </div>
  )
}
