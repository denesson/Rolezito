"use client"
import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext({ user: null, login: async () => {}, logout: () => {} })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Ao montar, carrega user/token do localStorage ou da API
  useEffect(() => {
    async function loadUser() {
      if (typeof window !== "undefined") {
        const rawUser = localStorage.getItem("user")
        if (rawUser) {
          try {
            setUser(JSON.parse(rawUser))
            return
          } catch { /* ignora e segue para /me */ }
        }
      }
      // fallback: tenta via API (cookie)
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(data.user))
          }
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }
    loadUser()
  }, [])

  // Login: salva user e token no localStorage
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
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data))
        if (data.token) localStorage.setItem("token", data.token)
      }
      return data
    } catch (err) {
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
      throw err
    }
  }

  // Logout: limpa tudo do localStorage e recarrega
  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch { /* ignora */ }
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
    window.location.href = "/login"
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
