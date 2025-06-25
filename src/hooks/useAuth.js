// src/hooks/useAuth.js
"use client"
import { useState, useEffect, createContext, useContext } from "react"

const AuthContext = createContext({
  user: null,
  login: () => Promise.resolve(),
  logout: () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // 1) Ao montar, pergunta ao servidor “quem sou eu?”
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          localStorage.setItem("user", JSON.stringify(data.user))
        }
      })
  }, [])

  // 2) login: além de setar no state/localStorage,
  //    manda um POST pra /api/auth/login e aguarda o cookie
  async function login({ nome, senha }) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, senha })
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.erro || "Falha no login")
    setUser(data)           // data = { nome, email, admin }
    localStorage.setItem("user", JSON.stringify(data))
    return data
  }

  // 3) logout limpa tudo
  function logout() {
    // opcional: chamar /api/auth/logout para zerar cookie no servidor
    localStorage.removeItem("user")
    setUser(null)
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
