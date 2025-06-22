// src/app/layout.jsx
+ "use client"
import "./styles/globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "./Providers"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata = {
  title: "Rolezito",
  description: "Seu guia de rolês em Salvador",
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
          bg-white text-black
          dark:bg-[#111827] dark:text-white
          transition-colors duration-300
        `}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
