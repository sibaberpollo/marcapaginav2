'use client'

import { useEffect, useState } from 'react'
import { FormData, FormStatus } from '@/lib/hooks/useFormState'
import { useTurnstile } from '@/lib/hooks/useTurnstile'
import { useFileUpload } from '@/lib/hooks/useFileUpload'

interface FormularioPublicaProps {
  formData: FormData
  setFormData: (data: FormData) => void
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
  status: FormStatus | null
  setStatus: (status: FormStatus | null) => void
  dotCount: number
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  onSubmit: (e: React.FormEvent) => Promise<void>
}

const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!

export default function FormularioPublica({
  formData,
  setFormData,
  isSubmitting,
  setIsSubmitting,
  status,
  setStatus,
  dotCount,
  handleChange,
  onSubmit,
}: FormularioPublicaProps) {
  const { captchaRef, token, setToken, initTurnstile, getTokenManual } =
    useTurnstile(TURNSTILE_SITEKEY)

  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false)
  const [checkingCaptcha, setCheckingCaptcha] = useState<boolean>(false)
  const [dragActive, setDragActive] = useState(false)

  const { handleDrop: originalHandleDrop, handleDragOver, handleFileInput, removeFile } = useFileUpload({
    formData,
    setFormData,
  })

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setDragActive(false)
    originalHandleDrop(e)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
  }

  useEffect(() => {
    if (window.turnstile) {
      initTurnstile()
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          initTurnstile()
          clearInterval(interval)
        }
      }, 300)
      return () => clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setCaptchaVerified(!!token)
  }, [token])

  const handleSubmitWithCaptchaCheck = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.email ||
      !formData.description ||
      formData.files.length === 0 ||
      !formData.agree
    ) {
      setStatus({
        success: false,
        message: 'Por favor completa todos los campos del formulario.',
      })
      return
    }

    setCheckingCaptcha(true)
    let currentToken = token

    if (!currentToken) {
      currentToken = getTokenManual()
    }

    if (!currentToken) {
      try {
        const storedToken = sessionStorage.getItem('turnstileToken')
        if (storedToken) {
          currentToken = storedToken
          setToken(storedToken)
          setCaptchaVerified(true)
        }
      } catch (err) {
        console.error('Error al acceder a sessionStorage:', err)
      }
    }

    setCheckingCaptcha(false)

    if (!currentToken) {
      setStatus({
        success: false,
        message: 'Por favor verifica que eres humano marcando el captcha.',
      })
      return
    }

    onSubmit(e)
  }

  return (
    <div className="w-full">
      {status && (
        <div
          className={`mb-6 rounded-2xl p-4 ${
            status.success
              ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800'
              : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {status.success ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {status.message}
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmitWithCaptchaCheck}
        className="space-y-6 rounded-3xl bg-surface border border-surface-2 p-8 shadow-sm"
        encType="multipart/form-data"
      >
        {/* Tipo de contenido */}
        <div>
          <label htmlFor="contentType" className="block text-sm font-medium text-text-primary mb-2">
            ¿Qué quieres publicar?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, contentType: 'relato' })}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                formData.contentType === 'relato'
                  ? 'border-brand-yellow bg-brand-yellow/10'
                  : 'border-surface-2 hover:border-brand-gray'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <p className="font-medium text-text-primary">Relato</p>
                  <p className="text-xs text-text-secondary">Narrativa, cuento, ficción</p>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, contentType: 'articulo' })}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                formData.contentType === 'articulo'
                  ? 'border-brand-yellow bg-brand-yellow/10'
                  : 'border-surface-2 hover:border-brand-gray'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <p className="font-medium text-text-primary">Artículo</p>
                  <p className="text-xs text-text-secondary">Ensayo, opinión, reseña</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="tu@email.com"
            className="w-full rounded-xl border border-surface-2 bg-bg-primary px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 transition-all"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
            Cuéntanos sobre tu texto
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            placeholder="Una breve descripción de ti y de lo que envías..."
            className="w-full rounded-xl border border-surface-2 bg-bg-primary px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/20 transition-all resize-none"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Archivos */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Archivo
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer ${
              dragActive
                ? 'border-brand-yellow bg-brand-yellow/5'
                : 'border-surface-2 hover:border-brand-gray bg-bg-primary'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-yellow/10 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-primary">
                Arrastra tu archivo aquí
              </p>
              <p className="text-xs text-text-secondary mt-1">
                o haz clic para seleccionar
              </p>
              <p className="text-xs text-text-secondary/70 mt-2">
                PDF, DOCX o TXT • Máximo 1MB
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              required={formData.files.length === 0}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleFileInput}
            />
          </div>
          {formData.files.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-700 dark:text-green-300 truncate">
                      {f.name}
                    </span>
                    <span className="text-xs text-green-600/70 dark:text-green-400/70">
                      ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-1 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                  >
                    <svg className="w-4 h-4 text-green-700 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CAPTCHA */}
        <div className="flex justify-center">
          <div ref={captchaRef}></div>
        </div>

        {/* Consentimiento */}
        <div className="flex items-start gap-3">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-surface-2 text-brand-yellow focus:ring-brand-yellow/20"
            checked={formData.agree}
            onChange={handleChange}
          />
          <label htmlFor="agree" className="text-sm text-text-secondary">
            Acepto que este texto es original y cedo derechos de publicación a MarcaPágina.
          </label>
        </div>

        {/* Enviar */}
        <div className="pt-2">
          {!captchaVerified && !checkingCaptcha && (
            <p className="mb-3 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Completa el captcha antes de enviar
            </p>
          )}
          {checkingCaptcha && (
            <p className="mb-3 text-sm text-blue-600 dark:text-blue-400">Verificando...</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-xl px-6 py-4 font-medium text-base transition-all ${
              isSubmitting
                ? 'bg-brand-gray/50 text-text-secondary cursor-not-allowed'
                : 'bg-brand-yellow text-brand-black hover:bg-brand-yellow/90 hover:shadow-lg hover:shadow-brand-yellow/20'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando{'.'.repeat(dotCount)}
              </span>
            ) : (
              `Enviar ${formData.contentType === 'relato' ? 'relato' : 'artículo'}`
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
