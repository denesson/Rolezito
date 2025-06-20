"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function EventoDetail() {
  const params = useParams()
  const eventoId = params?.id

  const [evento, setEvento] = useState(null)
  const [favorito, setFavorito] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!eventoId) return
    async function fetchEvento() {
      try {
        // Busque todos e filtre (ou ideal: crie GET /api/eventos/[id])
        const resp = await fetch(`/api/eventos`)
        const data = await resp.json()
        const ev = data.find(ev => String(ev.id) === String(eventoId))
        setEvento(ev)
        setFavorito(ev?.favorito ?? false)
      } catch {
        setEvento(null)
      } finally {
        setLoading(false)
      }
    }
    fetchEvento()
  }, [eventoId])

  if (loading) return <div style={{ padding: 32 }}>Carregando evento...</div>
  if (!evento) return <div style={{ padding: 32 }}>Evento não encontrado</div>

  return (
    <main style={{
      minHeight: "100vh", background: "#fafafa", padding: 24, maxWidth: 600, margin: "0 auto"
    }}>
      <div style={{ marginBottom: 18 }}>
        <Link href="/" style={{
          color: "#2d6cdf", textDecoration: "none", fontWeight: 500, fontSize: 15
        }}>&larr; Voltar para Home</Link>
      </div>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 0,
        boxShadow: "0 2px 16px #0001", border: "1px solid #ececec"
      }}>
        <img
          src={evento.imagem || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"}
          alt={evento.nome}
          style={{ width: "100%", height: 200, objectFit: "cover", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        />
        <div style={{ padding: 28 }}>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>{evento.nome}</h1>
          <div style={{ color: "#888", marginBottom: 4 }}>
            {(evento.data
              ? new Date(evento.data).toLocaleString("pt-BR")
              : evento.horario) + " · " + evento.local}
          </div>
          <div style={{ margin: "14px 0", color: "#444" }}>{evento.descricao}</div>
          <div style={{ marginBottom: 10 }}>
            <span style={{
              color: "#2d6cdf", fontWeight: "bold", fontSize: 17
            }}>{evento.preco}</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            <button
              onClick={() => setFavorito(fav => !fav)}
              style={{
                background: favorito ? "#ff4477" : "#eee",
                color: favorito ? "#fff" : "#ff4477",
                border: "none", borderRadius: 14, padding: "7px 18px",
                fontWeight: "bold", cursor: "pointer", fontSize: 15
              }}>
              {favorito ? "★ Favorito" : "☆ Favoritar"}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: evento.nome,
                    text: evento.descricao,
                    url: typeof window !== "undefined" ? window.location.href : ""
                  })
                } else {
                  alert("Navegador não suporta compartilhamento.");
                }
              }}
              style={{
                background: "#2d6cdf", color: "#fff", border: "none",
                borderRadius: 14, padding: "7px 18px",
                fontWeight: "bold", cursor: "pointer", fontSize: 15
              }}>
              Compartilhar
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
