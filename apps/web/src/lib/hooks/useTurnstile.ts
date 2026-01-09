import { useRef, useEffect, useState } from 'react'

declare global {
  interface Window {
    turnstile: {
      render: (
        container: HTMLElement,
        options: { sitekey: string; callback: (token: string) => void }
      ) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export function useTurnstile(sitekey: string) {
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const initTurnstile = () => {
    if (!window.turnstile || !captchaRef.current) return

    if (widgetIdRef.current) {
      try {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
        setToken(null)
      } catch (error) {
        console.error('Error al eliminar widget existente:', error)
      }
    }

    setTimeout(() => {
      if (window.turnstile && captchaRef.current && widgetIdRef.current === null) {
        try {
          const onTokenCallback = (t: string) => {
            setToken(t)
            if (t) {
              try {
                sessionStorage.setItem('turnstileToken', t)
              } catch (err) {
                console.error('Error al guardar token en sessionStorage', err)
              }
            }
          }

          const id = window.turnstile.render(captchaRef.current, {
            sitekey: sitekey,
            callback: onTokenCallback,
          })
          widgetIdRef.current = id
          setIsReady(true)

          try {
            const storedToken = sessionStorage.getItem('turnstileToken')
            if (storedToken && !token) {
              setToken(storedToken)
            }
          } catch (err) {
            console.error('Error al recuperar token de sessionStorage', err)
          }
        } catch (error) {
          console.error('Error al renderizar Turnstile:', error)
        }
      }
    }, 500)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsReady(true)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (isReady && !token) {
      const timeoutId = setTimeout(
        () => {
          initTurnstile()
        },
        Math.min(attempts * 500, 3000)
      )

      return () => clearTimeout(timeoutId)
    }
  }, [isReady, attempts, token, sitekey])

  useEffect(() => {
    if (isReady && !token && attempts < 10) {
      const intervalId = setInterval(() => {
        setAttempts((prev) => prev + 1)
      }, 2000)

      return () => clearInterval(intervalId)
    }
  }, [isReady, token, attempts])

  const resetTurnstile = () => {
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current)
        setToken(null)
        try {
          sessionStorage.removeItem('turnstileToken')
        } catch (err) {
          console.error('Error al eliminar token de sessionStorage', err)
        }
      } catch (error) {
        console.error('Error al resetear Turnstile:', error)
      }
    }
  }

  const getTokenManual = () => {
    try {
      const storedToken = sessionStorage.getItem('turnstileToken')
      if (storedToken) {
        setToken(storedToken)
        return storedToken
      }
    } catch (err) {
      console.error('Error al obtener token de sessionStorage', err)
    }
    return token
  }

  return {
    captchaRef,
    token,
    setToken,
    initTurnstile,
    resetTurnstile,
    getTokenManual,
    isReady,
  }
}
