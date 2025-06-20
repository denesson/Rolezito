"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"

export default function NavMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  // Links normais SEM admin
  const links = [
    { href: "/", label: "Home" },
    { href: "/eventos", label: "Eventos" },
    { href: "/promocoes", label: "Promoções" },
    { href: "/ranking", label: "Ranking" },
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
  ]

  function handleLoginClick() {
    setOpen(false)
    router.push("/login")
  }

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow mb-8 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-3 px-4 md:px-6 relative">
        {/* LOGO */}
        <div className="font-extrabold text-2xl text-blue-700 tracking-tight flex-shrink-0">
          <Link href="/">Rolezito</Link>
        </div>
        {/* MENU DESKTOP */}
        <ul className="hidden md:flex space-x-3 items-center">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-3 py-2 rounded-md font-semibold transition ${pathname === link.href
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-700"
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {/* Só mostra ADMIN se logado e admin */}
          {user && user.admin && (
            <li key="/admin">
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-md font-semibold transition ${pathname === "/admin"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-700"
                  }`}
              >
                Admin
              </Link>
            </li>
          )}
        </ul>
        {/* LOGIN/SAIR */}
        <div className="flex items-center ml-4">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-600 dark:text-blue-200">{user.nome}</span>
              <button
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 font-bold transition"
                onClick={() => {
                  logout()
                  window.location.reload()
                }}
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-bold transition"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
          {/* MENU HAMBÚRGUER - MOBILE */}
          <button
            className="md:hidden ml-2 flex flex-col justify-center items-center w-10 h-10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1.5 rounded"></span>
            <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 mb-1.5 rounded"></span>
            <span className="block w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded"></span>
          </button>
        </div>
        {/* MENU MOBILE */}
        {open && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-20 flex justify-end md:hidden">
            <div className="w-64 bg-white dark:bg-gray-900 h-full shadow-lg flex flex-col p-6 gap-2 animate-slide-in">
              <button
                className="self-end text-2xl mb-2"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
              >×</button>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 px-2 rounded-md font-semibold transition ${pathname === link.href
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-700"
                    }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {/* Só mostra ADMIN se logado e admin */}
              {user && user.admin && (
                <Link
                  key="/admin"
                  href="/admin"
                  className={`py-2 px-2 rounded-md font-semibold transition ${pathname === "/admin"
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-700"
                    }`}
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user && user.admin && (
                <li>
                  <Link
                    href="/admin/usuarios"
                    className={`px-3 py-2 rounded-md font-semibold transition ${pathname === "/admin/usuarios"
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-700 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-700"
                      }`}
                  >
                    Usuários
                  </Link>
                </li>
              )}
              <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-200">{user.nome}</span>
                    <button
                      className="w-full px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 font-bold transition"
                      onClick={() => {
                        setOpen(false)
                        logout()
                        window.location.reload()
                      }}
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-bold transition"
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
            <style jsx>{`
              .animate-slide-in {
                animation: slide-in 0.2s;
              }
              @keyframes slide-in {
                from { transform: translateX(100%); opacity: 0;}
                to { transform: translateX(0); opacity: 1;}
              }
            `}</style>
          </div>
        )}
      </div>
    </nav>
  )
}
