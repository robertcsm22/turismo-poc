import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService, townService } from '../services/api'
import logo from '../assets/Logo de Santa Tereza.png'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function LoginPage() {
  const { townSlug } = useParams()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [town, setTown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [googleReady, setGoogleReady] = useState(false)

  // Si ya está autenticado, redirigir directo a lugares
  useEffect(() => {
    if (isAuthenticated() && townSlug) {
      navigate(`/lugares/${townSlug}`, { replace: true })
    }
  }, [isAuthenticated, townSlug, navigate])

  // Cargar datos del pueblo si hay slug (vino del QR)
  useEffect(() => {
    if (!townSlug) return
    townService.getTown(townSlug)
      .then(setTown)
      .catch(() => navigate('/error'))
  }, [townSlug, navigate])

  // Callback que recibe el credential de Google
  const handleGoogleResponse = async (response) => {
    setLoading(true)
    setError(null)
    try {
      const authResponse = await authService.loginWithGoogle(response.credential)
      login(authResponse)
      navigate(townSlug ? `/lugares/${townSlug}` : '/lugares/santa-teresa')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.')
      setLoading(false)
      // Re-renderizar el botón si hay error
      setGoogleReady(false)
      setTimeout(() => setGoogleReady(true), 100)
    }
  }

  // Cargar y renderizar el botón de Google
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('VITE_GOOGLE_CLIENT_ID no está definido en .env')
      return
    }
    if (loading) return

    const renderGoogleButton = () => {
      if (!window.google) return
      
      try {
        window.google.accounts.id.cancel()
      } catch(e) {}

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
      })

      const btnEl = document.getElementById('google-btn')
      if (btnEl) {
        btnEl.innerHTML = ''
        window.google.accounts.id.renderButton(btnEl, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          locale: 'es',
          width: 280,
        })
      }
    }

    if (window.google) {
      renderGoogleButton()
    } else {
      // Esperar a que el SDK cargue
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval)
          renderGoogleButton()
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [loading, googleReady])

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ background: 'linear-gradient(135deg, #123C3A 0%, #2F7C91 100%)' }}>
      <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: 420, width: '100%', borderRadius: 16, borderTop: '4px solid var(--color-naranja)', background: 'var(--color-crema)' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo Santa Teresa" height={120} style={{ objectFit: 'contain', width: 'auto' }} />
          <h1 className="h4 fw-bold mt-2 mb-0" style={{ color: 'var(--color-verde-oscuro)' }}>
            {town ? town.name : 'Turismo Local'}
          </h1>
          {town?.province && (
            <p className="text-muted small">{town.province}, Costa Rica</p>
          )}
        </div>

        <p className="text-center text-muted mb-4">
          {town
            ? `Descubre los mejores lugares de ${town.name}. Inicia sesión con tu cuenta Gmail para continuar.`
            : 'Inicia sesión con tu cuenta Gmail para explorar lugares turísticos.'}
        </p>

        {error && (
          <div className="alert alert-danger py-2 text-center small">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border text-info" role="status" />
            <p className="mt-2 text-muted small">Verificando...</p>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <div id="google-btn"></div>
          </div>
        )}

        <p className="text-center text-muted mt-4" style={{ fontSize: 11 }}>
          Solo se aceptan cuentas @gmail.com
        </p>
      </div>
    </div>
  )
}