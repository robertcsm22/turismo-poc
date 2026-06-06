import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { townService } from '../services/api'

export default function QRPage() {
  const { townSlug } = useParams()
  const navigate = useNavigate()
  const qrRef = useRef(null)
  const [town, setTown] = useState(null)

  useEffect(() => {
    if (townSlug) {
      townService.getTown(townSlug)
        .then(setTown)
        .catch(() => {})
    }
  }, [townSlug])

  useEffect(() => {
    if (!qrRef.current) return
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
    script.onload = () => {
      qrRef.current.innerHTML = ''
      new window.QRCode(qrRef.current, {
        text: `${window.location.origin}/login/${townSlug || 'santa-teresa'}`,
        width: 220,
        height: 220,
        colorDark: '#123C3A',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H,
      })
    }
    document.head.appendChild(script)
    if (window.QRCode) script.onload()
  }, [townSlug])

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-${townSlug || 'turismo'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0d2b2a 0%, #123C3A 40%, #2F7C91 100%)',
      padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 20, padding: '40px 36px',
        textAlign: 'center', maxWidth: 360, width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🗺️</div>
        <h2 style={{ color: '#123C3A', fontWeight: 800, margin: '0 0 4px', fontSize: 22 }}>
          {town?.name || 'Turismo Local'}
        </h2>
        {town?.province && (
          <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 24px' }}>
            {town.province}, Costa Rica
          </p>
        )}

        {/* QR */}
        <div style={{
          display: 'inline-flex', padding: 16, background: '#f8fafc',
          borderRadius: 16, border: '2px dashed #e2e8f0', marginBottom: 20,
        }}>
          <div ref={qrRef} />
        </div>

        <p style={{ color: '#94a3b8', fontSize: 12, margin: '0 0 20px', lineHeight: 1.5 }}>
          Escanea para acceder a los lugares turísticos de{' '}
          <strong style={{ color: '#123C3A' }}>{town?.name || 'este pueblo'}</strong>
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownload}
            style={{
              background: '#123C3A', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: 10, fontWeight: 600,
              fontSize: 13, cursor: 'pointer',
            }}
          >
            ⬇️ Descargar PNG
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent', color: '#64748b',
              border: '2px solid #e2e8f0', padding: '10px 20px',
              borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  )
}