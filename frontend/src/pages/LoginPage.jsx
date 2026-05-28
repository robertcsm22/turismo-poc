import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService, townService } from '../services/api'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function LoginPage() {
  const { townSlug } = useParams()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [town, setTown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  // Inicializar Google Sign-In cuando el SDK cargue
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('VITE_GOOGLE_CLIENT_ID no está definido en .env')
      return
    }

    const initGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
      })

      window.google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          locale: 'es',
          width: 280,
        }
      )
    }

    // El SDK puede ya estar cargado o aún cargando
    if (window.google) {
      initGoogle()
    } else {
      window.addEventListener('load', initGoogle)
    }

    return () => window.removeEventListener('load', initGoogle)
  }, [])

  // Callback que recibe el credential de Google
  const handleGoogleResponse = async (response) => {
    setLoading(true)
    setError(null)
    try {
      // Enviar el ID Token al backend para verificación
      const authResponse = await authService.loginWithGoogle(response.credential)
      login(authResponse)
      navigate(townSlug ? `/lugares/${townSlug}` : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: 420, width: '100%', borderRadius: 16 }}>
        {/* Logo o imagen del pueblo */}
        <div className="text-center mb-4">
          <span style={{ fontSize: 48 }}>🌴</span>
          <h1 className="h4 fw-bold mt-2 mb-0" style={{ color: '#2d3748' }}>
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
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2 text-muted small">Verificando...</p>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            {/* El SDK de Google renderiza el botón aquí */}
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
