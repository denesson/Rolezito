import { useState, useEffect } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) setUser(JSON.parse(userData))
  }, [])

  function login(usuario) {
    localStorage.setItem("user", JSON.stringify(usuario))
    setUser(usuario)
  }

  function logout() {
    localStorage.removeItem("user")
    setUser(null)
  }

  return { user, login, logout }
}
