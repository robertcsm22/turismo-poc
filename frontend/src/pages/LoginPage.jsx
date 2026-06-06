import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService, townService } from '../services/api'
import logo from '../assets/Logo de Santa Tereza.png'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const BEACH_IMAGES = [
  'https://plus.unsplash.com/premium_photo-1678600097521-006d3f0d5a6d?q=80&w=687&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1674170110772-2fc6b278658e?q=80&w=1332&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1657092663605-a60d9bd2cfaa?q=80&w=736&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500815845799-7748ca339f27?q=80&w=627&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1657092663712-d415ee23c1f4?q=80&w=736&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1629847172830-c1848b9e513a?q=80&w=1170&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1728932827628-3a577c035817?q=80&w=687&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1643168925003-dac4607ee42f?q=80&w=1170&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1657035312314-85167b14f87e?q=80&w=736&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516468899809-71bc9b73da47?q=80&w=1074&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1742909620139-fafe38f1f054?q=80&w=687&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1630527910939-275499aa3650?q=80&w=1169&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517333719389-5164cfd0406f?q=80&w=1074&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1727640851784-d2a6f6d418c8?q=80&w=687&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1624398626187-747d62b4acfc?q=80&w=764&auto=format&fit=crop',
]

const COLUMNS = Array.from({ length: 7 }, (_, i) =>
  [BEACH_IMAGES[i * 2 % BEACH_IMAGES.length], BEACH_IMAGES[(i * 2 + 1) % BEACH_IMAGES.length]]
)

export default function LoginPage() {
  const { townSlug } = useParams()
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  const [town, setTown] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [googleReady, setGoogleReady] = useState(false)

  useEffect(() => {
    if (isAuthenticated() && townSlug) {
      navigate(`/lugares/${townSlug}`, { replace: true })
    }
  }, [isAuthenticated, townSlug, navigate])

  useEffect(() => {
    if (!townSlug) return
    townService.getTown(townSlug)
      .then(setTown)
      .catch(() => navigate('/error'))
  }, [townSlug, navigate])

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
      setGoogleReady(false)
      setTimeout(() => setGoogleReady(true), 100)
    }
  }

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || loading) return
    const renderGoogleButton = () => {
      if (!window.google) return
      try { window.google.accounts.id.cancel() } catch(e) {}
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
          theme: 'outline', size: 'large',
          text: 'continue_with', locale: 'es', width: 280,
        })
      }
    }
    if (window.google) {
      renderGoogleButton()
    } else {
      const interval = setInterval(() => {
        if (window.google) { clearInterval(interval); renderGoogleButton() }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [loading, googleReady])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      <style>{`
        .lp-flow {
          position: absolute; inset: 0;
          display: flex; align-items: center;
          overflow: hidden; pointer-events: none;
        }
        .lp-col {
          position: absolute; top: 0; left: 50%;
          width: 220px; margin-left: -110px;
          animation: lp-wave 80s linear infinite;
        }
        .lp-col:nth-child(1) { animation-delay: 0s; }
        .lp-col:nth-child(2) { animation-delay: -11.5s; }
        .lp-col:nth-child(3) { animation-delay: -23s; }
        .lp-col:nth-child(4) { animation-delay: -34.5s; }
        .lp-col:nth-child(5) { animation-delay: -46s; }
        .lp-col:nth-child(6) { animation-delay: -57.5s; }
        .lp-col:nth-child(7) { animation-delay: -69s; }
        .lp-card {
          width: 100%; height: 220px; overflow: hidden;
          border-radius: 12px; margin-bottom: 20px;
          box-shadow: 0 10px 28px rgba(0,0,0,0.3);
        }
        .lp-card img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          animation: lp-jiggle 20s infinite alternate;
        }
        @keyframes lp-wave {
          0%   { opacity: 0; transform: rotate(.1deg) translate3d(1400px, 10px, 0); }
          5%   { opacity: 0; }
          6%   { opacity: 1; }
          50%  { transform: rotate(-.05deg) translate3d(0, 180px, 0); }
          94%  { opacity: 1; }
          95%  { opacity: 0; }
          100% { opacity: 0; transform: rotate(.05deg) translate3d(-1400px, 10px, 0); }
        }
        @keyframes lp-jiggle {
          0%,90% { transform: translate3d(-3px,-4px,0); }
          10%    { transform: translate3d(0,-4px,0); }
          20%    { transform: translate3d(-1px,-2px,0); }
          30%    { transform: translate3d(3px,1px,0); }
          40%    { transform: translate3d(-4px,-1px,0); }
          50%    { transform: translate3d(-2px,-3px,0); }
          60%    { transform: translate3d(-3px,-2px,0); }
          70%    { transform: translate3d(-2px,5px,0); }
          80%    { transform: translate3d(-1px,5px,0); }
          100%   { transform: translate3d(-2px,-3px,0); }
        }
        @keyframes lp-spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* Columnas de fotos */}
      <div className="lp-flow" style={{ zIndex: 0 }}>
        {COLUMNS.map((imgs, ci) => (
          <div key={ci} className="lp-col">
            {imgs.map((src, ii) => (
              <div key={ii} className="lp-card">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg, rgba(13,43,42,0.45) 0%, rgba(47,124,145,0.4) 100%)',
      }} />

      {/* Card de login */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 420, padding: '0 16px' }}>
        <div style={{
          background: 'var(--color-crema, #f5f0e8)',
          borderRadius: 16,
          borderTop: '4px solid #F7A640',
          padding: '40px 36px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img src={logo} alt="Logo Santa Teresa" height={110}
              style={{ objectFit: 'contain', width: 'auto', marginBottom: 12 }} />
            <h1 style={{ color: '#123C3A', fontWeight: 800, fontSize: 22, margin: '0 0 4px' }}>
              {town ? town.name : 'Turismo Local'}
            </h1>
            {town?.province && (
              <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                {town.province}, Costa Rica
              </p>
            )}
          </div>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14, margin: '0 0 24px', lineHeight: 1.55 }}>
            {town
              ? `Descubre los mejores lugares de ${town.name}. Inicia sesión con tu cuenta Gmail para continuar.`
              : 'Inicia sesión con tu cuenta Gmail para explorar lugares turísticos.'}
          </p>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5',
              borderRadius: 8, padding: '10px 14px', fontSize: 13,
              textAlign: 'center', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: 36, height: 36, border: '3px solid rgba(18,60,58,0.15)',
                borderTopColor: '#123C3A', borderRadius: '50%',
                animation: 'lp-spin 0.8s linear infinite', margin: '0 auto 10px',
              }} />
              <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Verificando...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div id="google-btn" />
            </div>
          )}

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, margin: '20px 0 0' }}>
            Solo se aceptan cuentas @gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}