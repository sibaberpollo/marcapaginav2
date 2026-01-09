import { NextRequest, NextResponse } from 'next/server'
import * as nodemailer from 'nodemailer'

const GMAIL_USER = process.env.GMAIL_USER!
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD!
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY!

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
})

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const contentType = (data.get('contentType') as string) || 'relato'
    const email = data.get('email') as string
    const description = data.get('description') as string
    const token = data.get('response') as string

    const tipoTexto = contentType === 'relato' ? 'relato' : 'artículo'
    const tipoTextoMayus = contentType === 'relato' ? 'Relato' : 'Artículo'

    if (!token) {
      return NextResponse.json({ error: 'Token Turnstile no proporcionado' }, { status: 400 })
    }

    // Verificar Turnstile
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token }),
    })
    const vj = await verify.json()
    if (!vj.success) {
      return NextResponse.json(
        { error: 'Turnstile inválido', details: vj['error-codes'] },
        { status: 400 }
      )
    }

    // Preparar adjuntos
    const attachments: { filename: string; content: Buffer }[] = []
    const files = data.getAll('files') as File[]
    for (const f of files) {
      const buf = Buffer.from(await f.arrayBuffer())
      attachments.push({ filename: f.name, content: buf })
    }

    // Envío de confirmación al remitente
    transporter
      .sendMail({
        from: `MarcaPágina <${GMAIL_USER}>`,
        to: email,
        subject: `MarcaPágina: recibimos tu ${tipoTexto}`,
        text: `¡Hola!\n\n¡Gracias por compartir tu ${tipoTexto} con nosotros! Lo hemos recibido y será considerado para ser publicado en MarcaPágina.\n\nTu texto será evaluado antes de publicarse.\n\nSíguenos en Instagram: https://www.instagram.com/marcapagina.page/\n\n— El equipo de MarcaPágina`,
        html: `<p>¡Hola!</p>
               <p>¡Gracias por compartir tu ${tipoTexto} con nosotros! Lo hemos recibido y será considerado para ser publicado en <strong>MarcaPágina</strong>.</p>
               <p style='background:#faff00; color:#222; padding:8px; border-radius:6px; font-weight:bold;'>Tu texto será evaluado antes de publicarse.</p>
               <p>Síguenos en <a href='https://www.instagram.com/marcapagina.page/' target='_blank'>Instagram</a></p>
               <p>— El equipo de MarcaPágina</p>`,
      })
      .catch((err) => console.error('Error enviando confirmación al remitente:', err))

    // Envío interno
    await transporter.sendMail({
      from: `MarcaPágina <${GMAIL_USER}>`,
      to: GMAIL_USER,
      replyTo: email,
      subject: `[${tipoTextoMayus}] Nuevo envío de ${email}`,
      text: `Tipo: ${tipoTextoMayus}\nDe: ${email}\n\n${description}`,
      attachments,
    })

    return NextResponse.json({ message: `${tipoTextoMayus} enviado correctamente` })
  } catch (err) {
    console.error('Error en /api/publica:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
