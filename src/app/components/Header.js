"use client"
import Link from "next/link"
import RolezitoLogo from "./RolezitoLogo"
import NavMenu from "./NavMenu" // Importando o componente NavMenu

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
  <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <Link href="/" className="flex items-center space-x-3">
      <RolezitoLogo size={36} />
      <span className="text-xl font-bold text-blue-600 select-none">Rolezito</span>
    </Link>
    <div className="hidden sm:flex space-x-6 text-gray-700 font-semibold">
      <Link href="/" className="hover:text-blue-600 transition">Home</Link>
      <Link href="/categorias" className="hover:text-blue-600 transition">Categorias</Link>
      <Link href="/sobre" className="hover:text-blue-600 transition">Sobre</Link>
      <Link href="/contato" className="hover:text-blue-600 transition">Contato</Link>
    </div>
    {/* Mobile menu placeholder */}
  </nav>

  {/* NavMenu sem sticky, dentro do header */}
  <NavMenu />
</header>
  )
}
