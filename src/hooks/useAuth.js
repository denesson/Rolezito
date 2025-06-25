// src/hooks/useAuth.js
"use client"
import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext({ user: null, login: async () => {}, logout: () => {} })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  // 1) ao montar, pergunta ao servidor quem está logado
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        console.error("Erro ao buscar usuário:", err)
        setUser(null)
      }
    }
    loadUser()
  }, [])

  // 2) login chama /api/auth/login e grava o usuário
  async function login({ nome, senha }) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, senha }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.erro || "Falha no login")
      setUser(data)
      return data
    } catch (err) {
      console.error("Login falhou:", err)
      throw err
    }
  }

  // 3) logout limpa o cookie via endpoint e faz hard reload para login
  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout falhou:", err)
    } finally {
      setUser(null)
      // Hard reload para garantir remoção completa do cookie e SSR revalidado
      window.location.href = "/login"
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
