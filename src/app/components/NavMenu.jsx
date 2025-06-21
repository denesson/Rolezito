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
    { href: "/promocoes", label: "Promoções" },
    { href: "/ranking", label: "Ranking" },
    { href: "/sobre", label: "Sobre" },
    { href: "/contato", label: "Contato" },
  ]

  const isActive = (href) => pathname === href

  function handleLoginClick() {
    setOpen(false)
    router.push("/login")
  }

  return (
    <nav className="w-full bg-black shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4 md:px-6 relative">
        <Link href="/" className="text-2xl font-extrabold text-[#E11D48] tracking-tight">
          Rolezito
        </Link>

        <ul className="hidden md:flex space-x-4 items-center">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-4 py-2 rounded-full font-semibold transition duration-200 ease-in-out ${
                  isActive(link.href)
                    ? "bg-[#E11D48] text-white shadow"
                    : "text-white hover:bg-[#F43F5E] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {user?.admin && (
            <>
              <li>
                <Link
                  href="/admin"
                  className={`px-4 py-2 rounded-full font-semibold transition duration-200 ease-in-out ${
                    isActive("/admin")
                      ? "bg-[#E11D48] text-white shadow"
                      : "text-white hover:bg-[#F43F5E] hover:text-white"
                  }`}
                >
                  Admin
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/usuarios"
                  className={`px-4 py-2 rounded-full font-semibold transition duration-200 ease-in-out ${
                    isActive("/admin/usuarios")
                      ? "bg-[#E11D48] text-white shadow"
                      : "text-white hover:bg-[#F43F5E] hover:text-white"
                  }`}
                >
                  Usuários
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="font-semibold text-white hidden md:inline">{user.nome}</span>
              <button
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 font-bold transition hidden md:inline"
                onClick={() => {
                  logout()
                  window.location.reload()
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 rounded-full bg-[#E11D48] text-white hover:bg-[#F43F5E] font-bold transition hidden md:inline"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}

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

        {open && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-80 flex justify-end md:hidden">
            <div className="w-64 bg-[#1F2937] h-full shadow-lg flex flex-col p-6 gap-2 animate-slide-in">
              <button
                className="self-end text-2xl mb-2 text-white"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
              >
                ×
              </button>
              {[...links, ...(user?.admin ? [
                { href: "/admin", label: "Admin" },
                { href: "/admin/usuarios", label: "Usuários" }
              ] : [])].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 px-3 rounded-full font-semibold transition duration-200 ease-in-out ${
                    isActive(link.href)
                      ? "bg-[#E11D48] text-white shadow"
                      : "text-white hover:bg-[#F43F5E] hover:text-white"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-gray-700">
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{user.nome}</span>
                    <button
                      className="w-full px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 font-bold transition"
                      onClick={() => {
                        logout()
                        setOpen(false)
                        window.location.reload()
                      }}
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full px-4 py-2 rounded-full bg-[#E11D48] text-white hover:bg-[#F43F5E] font-bold transition"
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                )}
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
      </div>
    </nav>
  )
}
