import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req) {
  // Parse the incoming multipart/form-data request
  const formData = await req.formData()
  const file = formData.get('file')
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Read file data
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  // Generate filename and save
  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name}`
  const filepath = path.join(uploadsDir, filename)
  fs.writeFileSync(filepath, buffer)

  // Return public URL
  const url = `/uploads/${filename}`
  return NextResponse.json({ url })
}
