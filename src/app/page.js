import Link from "next/link"
import Image from "next/image"
import NavMenu from "./components/NavMenu"
import Logo from "../../public/logo-rolezito.png"

export default function Home() {
  return (
    <>
      <NavMenu />
      <main className="min-h-screen flex flex-col justify-center items-center bg-[#111827] px-4 py-16 font-sans text-white">
        {/* Logo e título */}
        <div className="flex items-center space-x-4 mb-6">
          <Image src={Logo} alt="Logo Rolezito" width={70} height={70} />
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#E11D48] tracking-tight">
            Rolezito
          </h1>
        </div>

        {/* Subtítulo */}
        <h2 className="text-xl md:text-2xl text-[#0EA5E9] mb-4 font-medium text-center">
          Encontre os rolês mais quentes da cidade!
        </h2>

        {/* Descrição */}
        <p className="text-center text-[#D1D5DB] text-lg max-w-2xl mb-8 leading-relaxed">
          Explore bares, festas, eventos e promoções imperdíveis em um só lugar.
          <br />
          <span className="font-semibold text-[#E11D48]">
            Chega de perder rolê bom!
          </span>
        </p>

        {/* Botão */}
        <Link
          href="/eventos"
          className="bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all text-lg"
        >
          Ver Agenda de Eventos
        </Link>

        {/* Rodapé */}
        <footer className="mt-12 text-[#9CA3AF] text-sm text-center">
          Desenvolvido por <strong className="text-[#0EA5E9]">Denesson Barreto</strong> © {new Date().getFullYear()}
        </footer>
      </main>
    </>
  )
}
