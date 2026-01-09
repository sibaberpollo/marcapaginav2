import { Metadata } from 'next'
import PublicaClient from './PublicaClient'

export const metadata: Metadata = {
  title: 'Publica con nosotros | MarcaPágina',
  description: 'Envía tu relato o artículo para ser publicado en MarcaPágina. Aceptamos textos originales.',
}

export default function PublicaPage() {
  return (
    <main className="min-h-screen bg-bg-primary py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold text-text-primary">Publica con nosotros</h1>
        <p className="mb-8 text-text-secondary">
          ¿Tienes una historia que contar o una idea que compartir? Envíanos tu texto y podría ser publicado en MarcaPágina.
        </p>
        <PublicaClient />
      </div>
    </main>
  )
}
