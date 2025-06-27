import "./styles/globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "./Providers"
import NavMenu from "./components/NavMenu"
import Footer from "./components/Footer"
import NotificationsClient from "./components/NotificationsClient"

// Definições de fonte do Next Font
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata = {
  title: "Rolezito",
  description: "Seu guia de rolês em Salvador",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="antialiased bg-white text-black dark:bg-[#111827] dark:text-white transition-colors duration-300">
        <Providers>
          {/* Componente client para notificações Web Push */}
          <NotificationsClient />
          {children}
        </Providers>
      </body>
    </html>
  )
}
