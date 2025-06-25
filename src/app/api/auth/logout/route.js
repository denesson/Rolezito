// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete("token", { path: "/" })  // <- ESSENCIAL para remover o cookie em todos os caminhos!
  return res
}
