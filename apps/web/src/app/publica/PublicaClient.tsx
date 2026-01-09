'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useFormState } from '@/lib/hooks/useFormState'
import FormularioPublica from '@/components/forms/FormularioPublica'

export default function PublicaClient() {
  const router = useRouter()
  const {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    status,
    setStatus,
    dotCount,
    handleChange,
    setupDotCountInterval,
  } = useFormState({
    contentType: 'relato',
    email: '',
    description: '',
    files: [],
    agree: false,
  })

  useEffect(() => {
    return setupDotCountInterval()
  }, [isSubmitting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    try {
      const fd = new FormData()
      fd.append('contentType', formData.contentType)
      fd.append('email', formData.email)
      fd.append('description', formData.description)
      formData.files.forEach((file) => fd.append('files', file))

      // Obtener token de Turnstile
      const token = sessionStorage.getItem('turnstileToken')
      if (token) {
        fd.append('response', token)
      }

      const res = await fetch('/api/publica', {
        method: 'POST',
        body: fd,
      })

      const data = await res.json()

      if (res.ok) {
        const tipo = formData.contentType === 'relato' ? 'relato' : 'artículo'
        setStatus({
          success: true,
          message: `¡Gracias! Tu ${tipo} ha sido enviado correctamente. Te contactaremos pronto.`,
        })
        setFormData({
          contentType: 'relato',
          email: '',
          description: '',
          files: [],
          agree: false,
        })
        // Limpiar token
        sessionStorage.removeItem('turnstileToken')
      } else {
        setStatus({
          success: false,
          message: data.error || 'Error al enviar el relato. Por favor intenta de nuevo.',
        })
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'Error de conexión. Por favor intenta de nuevo.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <FormularioPublica
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        status={status}
        setStatus={setStatus}
        dotCount={dotCount}
        handleChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  )
}
