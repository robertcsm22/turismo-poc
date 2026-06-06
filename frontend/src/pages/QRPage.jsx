import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { townService } from '../services/api'

export default function QRPage() {
  const { townSlug } = useParams()
  const navigate = useNavigate()
  const qrRef = useRef(null)
  const [town, setTown] = useState(null)
  const [qrReady, setQrReady] = useState(false)

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
      setQrReady(true)
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
    <>
      <style>{`
        @keyframes qr-scan {
          0%   { transform: translateY(0px); opacity: 1; }
          50%  { opacity: 0.8; }
          100% { transform: translateY(200px); opacity: 1; }
        }
        @keyframes qr-fadein {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .qr-wrapper {
          position: relative;
          display: inline-block;
          padding: 16px;
          background: #f8fafc;
          border-radius: 16px;
          border: 2px dashed #e2e8f0;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .qr-scan-line {
          position: absolute;
          left: 12px;
          right: 12px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #2F7C91, #F7A640, #2F7C91, transparent);
          border-radius: 2px;
          animation: qr-scan 2s linear infinite;
          box-shadow: 0 0 8px rgba(47,124,145,0.8), 0 0 16px rgba(247,166,64,0.4);
          top: 16px;
          z-index: 10;
        }
        .qr-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: #F7A640;
          border-style: solid;
        }
        .qr-corner-tl { top: 8px; left: 8px; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
        .qr-corner-tr { top: 8px; right: 8px; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
        .qr-corner-bl { bottom: 8px; left: 8px; border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }
        .qr-corner-br { bottom: 8px; right: 8px; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }
        .qr-page-content { animation: qr-fadein 0.5s ease; }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0d2b2a 0%, #123C3A 40%, #2F7C91 100%)',
        padding: 24,
      }}>
        <div className="qr-page-content" style={{
          background: 'white', borderRadius: 20, padding: '40px 36px',
          textAlign: 'center', maxWidth: 360, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📲</div>
          <h2 style={{ color: '#123C3A', fontWeight: 800, margin: '0 0 4px', fontSize: 22 }}>
            {town?.name || 'Turismo Local'}
          </h2>
          {town?.province && (
            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 24px' }}>
              {town.province}, Costa Rica
            </p>
          )}

          {/* QR con efecto de scan */}
          <div className="qr-wrapper">
            {qrReady && <div className="qr-scan-line" />}
            <div className="qr-corner qr-corner-tl" />
            <div className="qr-corner qr-corner-tr" />
            <div className="qr-corner qr-corner-bl" />
            <div className="qr-corner qr-corner-br" />
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
    </>
  )
}