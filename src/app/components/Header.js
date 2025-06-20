"use client"
import Link from "next/link"
import RolezitoLogo from "./RolezitoLogo"
import NavMenu from "./NavMenu"

export default function Header() {
  return (
    <header className="bg-[#111827] shadow-md sticky top-0 z-50 border-b border-[#334155]">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <RolezitoLogo size={36} />
          <span className="text-xl font-bold text-[#E11D48] select-none">Rolezito</span>
        </Link>
        <div className="hidden sm:flex space-x-6 text-white font-medium">
          <Link href="/" className="hover:text-[#F43F5E] transition">Home</Link>
          <Link href="/categorias" className="hover:text-[#F43F5E] transition">Categorias</Link>
          <Link href="/sobre" className="hover:text-[#F43F5E] transition">Sobre</Link>
          <Link href="/contato" className="hover:text-[#F43F5E] transition">Contato</Link>
        </div>
      </nav>

      {/* NavMenu - visível apenas no mobile */}
      <div className="sm:hidden border-t border-[#334155]">
        <NavMenu />
      </div>
    </header>
  )
}
