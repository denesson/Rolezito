"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const slides = [
  { src: "/slides/event1.jpg", alt: "Evento 1: Show ao vivo" },
  { src: "/slides/event2.jpg", alt: "Evento 2: Festival de música" },
  { src: "/slides/event3.jpg", alt: "Evento 3: Balada noturna" },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden">
      <AnimatePresence>
        {slides.map((slide, index) =>
          index === current && (
            <motion.img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className="absolute w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl text-white font-bold animate-fadeIn">
          Bem-vindo ao Rolezito
        </h1>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-gray-400'} transition`}
          />
        ))}
      </div>
    </div>
  )
}
