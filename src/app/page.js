import Link from "next/link"
import RolezitoLogo from "./components/RolezitoLogo"
import NavMenu from "./components/NavMenu"

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center">
      <RolezitoLogo size={72} className="mb-8" />
      <h1 className="text-4xl font-bold mb-6 text-blue-700 dark:text-blue-400 text-center">
        Bem-vindo ao Rolezito!
      </h1>
      <p className="text-xl mb-8 text-center text-gray-700 dark:text-gray-300">
        O seu site para encontrar os melhores rolês, eventos e promoções da cidade. <br />
        <span className="font-semibold text-blue-600 dark:text-blue-400">Não fique de fora!</span>
      </p>
      <Link
        href="/eventos"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition text-lg"
      >
        Ver Agenda de Eventos
      </Link>
      <div className="mt-12 text-gray-500 dark:text-gray-400 text-center text-sm">
        Desenvolvido por Denesson Barreto &copy; {new Date().getFullYear()}
      </div>
    </main>
  )
}
