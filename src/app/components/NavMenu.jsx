// components/NavMenu.jsx
"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import ThemeToggle from "./ThemeToggle"

export default function NavMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/eventos", label: "Eventos" },
    { href: "/ofertas", label: "Ofertas" },
    { href: "/ranking", label: "Ranking" },
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
  ]

  const isActive = (href) => pathname === href

  const adminLinks = [
    { href: "/admin", label: "Gerenciar Eventos" },
    { href: "/admin/usuarios", label: "Gerenciar Usuários" },
  ]

  function handleLoginClick() {
    setOpen(false)
    router.push("/login")
  }

  return (
    <nav className="w-full bg-black shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4 md:px-6">
        <Link href="/" className="text-2xl font-extrabold text-[#E11D48]">
          Rolezito
        </Link>

        {/* desktop */}
        <ul className="hidden md:flex items-center space-x-4">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  isActive(href)
                    ? "bg-[#E11D48] text-white"
                    : "text-white hover:bg-[#F43F5E]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}

          {user?.admin && (
            <li className="relative group">
              <button
                className={`px-4 py-2 rounded-full font-semibold flex items-center transition ${
                  adminLinks.some(a => isActive(a.href))
                    ? "bg-[#E11D48] text-white"
                    : "text-white hover:bg-[#F43F5E]"
                }`}
              >
                Administração
                <span className="ml-1 text-sm">▾</span>
              </button>
              <ul className="absolute right-0 mt-2 w-48 bg-[#1F2937] border border-[#334155] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {adminLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`block px-4 py-2 text-sm ${
                        isActive(href)
                          ? "bg-[#334155] text-white"
                          : "text-[#9CA3AF] hover:bg-[#334155] hover:text-white"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}

          {user ? (
            <>
              <li>
                <span className="px-4 py-2 text-white font-semibold">
                  {user.nome}
                </span>
              </li>
              <li>
                <button
                  onClick={() => { logout(); window.location.reload() }}
                  className="px-4 py-2 rounded-full bg-red-600 text-white font-bold hover:bg-red-700"
                >
                  Sair
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 rounded-full bg-[#E11D48] text-white font-bold hover:bg-[#F43F5E]"
              >
                Entrar
              </button>
            </li>
          )}

          <li>
          </li>
        </ul>

        {/* mobile toggle */}
        <button
          className="md:hidden ml-2 flex flex-col justify-center items-center w-10 h-10"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
        >
          <span className="w-6 h-0.5 bg-white mb-1.5 rounded"></span>
          <span className="w-6 h-0.5 bg-white mb-1.5 rounded"></span>
          <span className="w-6 h-0.5 bg-white rounded"></span>
        </button>
      </div>

      {/* mobile panel */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-80 z-40">
          <div className="w-64 bg-[#1F2937] h-full p-6 space-y-4 animate-slide-in relative">
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 rounded-full font-semibold transition ${
                  isActive(href)
                    ? "bg-[#E11D48] text-white"
                    : "text-white hover:bg-[#F43F5E]"
                }`}
              >
                {label}
              </Link>
            ))}

            {user?.admin && (
              <>
                <div className="pt-4 border-t border-gray-700"></div>
                {adminLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2 rounded-full font-semibold transition ${
                      isActive(href)
                        ? "bg-[#E11D48] text-white"
                        : "text-white hover:bg-[#F43F5E]"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </>
            )}

            <div className="pt-4 border-t border-gray-700"></div>
            {user ? (
              <>
                <span className="block text-white font-semibold mb-2">
                  {user.nome}
                </span>
                <button
                  onClick={() => { logout(); setOpen(false); window.location.reload() }}
                  className="w-full px-4 py-2 rounded-full bg-red-600 text-white font-bold hover:bg-red-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <button
                onClick={() => { handleLoginClick(); setOpen(false) }}
                className="w-full px-4 py-2 rounded-full bg-[#E11D48] text-white font-bold hover:bg-[#F43F5E]"
              >
                Entrar
              </button>
            )}

            <div className="pt-4 border-t border-gray-700">
              <ThemeToggle />
            </div>
          </div>
          <style jsx>{`
            .animate-slide-in {
              animation: slide-in 0.2s ease-out;
            }
            @keyframes slide-in {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </nav>
  )
}
