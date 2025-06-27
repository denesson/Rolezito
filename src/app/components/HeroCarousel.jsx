"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function HeroCarousel({
  slides = [
    { src: "/slides/event1.jpg", alt: "Show ao vivo" },
    { src: "/slides/event2.jpg", alt: "Festival de música" },
    { src: "/slides/event3.jpg", alt: "Balada noturna" },
  ],
  title = "Bem-vindo ao Rolezito",
  interval = 5000,
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, interval)
    return () => clearInterval(timer)
  }, [slides.length, interval])

  const prevSlide = () => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  }
  const nextSlide = () => {
    setCurrent(prev => (prev + 1) % slides.length)
  }

  return (
    <div className="relative w-full h-64 md:h-40 overflow-hidden">
      {slides.map((slide, idx) => (
        <img
          key={idx}
          src={slide.src}
          alt={slide.alt}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl text-white font-bold">
          {title}
        </h1>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
      >
        <ChevronLeft className="text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
      >
        <ChevronRight className="text-white" />
      </button>

      {/* Indicators */}
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
