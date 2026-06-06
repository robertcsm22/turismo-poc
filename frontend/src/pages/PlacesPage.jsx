import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { townService } from '../services/api'
import PlaceCard from '../components/PlaceCard'
import Navbar from '../components/Navbar'
import TourismChatbot from '../components/TourismChatbot'

export const CATEGORY_CONFIG = {
  RESTAURANTE: { label: 'Restaurante',  emoji: '🍽️', bg: '#dc2626', light: '#fee2e2' },
  PARQUE:      { label: 'Parque',       emoji: '🌿', bg: '#16a34a', light: '#dcfce7' },
  MUSEO:       { label: 'Museo',        emoji: '🏛️', bg: '#4f46e5', light: '#e0e7ff' },
  MIRADOR:     { label: 'Mirador',      emoji: '🏔️', bg: '#7c3aed', light: '#ede9fe' },
  HOTEL:       { label: 'Hotel',        emoji: '🏨', bg: '#d97706', light: '#fef3c7' },
  PLAYA:       { label: 'Playa',        emoji: '🏖️', bg: '#0284c7', light: '#e0f2fe' },
  CULTURAL:    { label: 'Cultural',     emoji: '🎭', bg: '#db2777', light: '#fce7f3' },
  GASTRONOMIA: { label: 'Gastronomía',  emoji: '🍜', bg: '#ea580c', light: '#ffedd5' },
  OTRO:        { label: 'Otro',         emoji: '📍', bg: '#64748b', light: '#f1f5f9' },
}

// ─── Map Modal ────────────────────────────────────────────────────────────────
function MapModal({ places, town, onClose }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  function initMap() {
    const L = window.L
    if (!mapRef.current || mapInstanceRef.current) return

    const validPlaces = places.filter(p => p.latitude && p.longitude)
    const centerLat = validPlaces.length
      ? validPlaces.reduce((s, p) => s + p.latitude, 0) / validPlaces.length
      : 9.6373
    const centerLng = validPlaces.length
      ? validPlaces.reduce((s, p) => s + p.longitude, 0) / validPlaces.length
      : -85.1669

    const map = L.map(mapRef.current).setView([centerLat, centerLng], 14)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map)

    validPlaces.forEach(place => {
      const cfg = CATEGORY_CONFIG[place.category] || CATEGORY_CONFIG.OTRO
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${cfg.bg};display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:2px solid white;"><span style="transform:rotate(45deg);font-size:16px;line-height:1;">${cfg.emoji}</span></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -44],
      })

      L.marker([place.latitude, place.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:190px;font-family:inherit;">
            ${place.imageUrl ? `<img src="${place.imageUrl}" style="width:100%;height:90px;object-fit:cover;border-radius:6px;margin-bottom:8px;"/>` : ''}
            <div style="margin-bottom:5px;">
              <span style="background:${cfg.bg};color:white;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">${cfg.emoji} ${cfg.label}</span>
            </div>
            <strong style="font-size:14px;display:block;margin-bottom:3px;">${place.name}</strong>
            ${place.description ? `<p style="font-size:12px;color:#555;margin:0 0 4px;line-height:1.4;">${place.description.slice(0, 80)}${place.description.length > 80 ? '…' : ''}</p>` : ''}
            ${place.address ? `<p style="font-size:12px;color:#888;margin:0;">📍 ${place.address}</p>` : ''}
          </div>`)
    })

    if (validPlaces.length > 1) {
      const bounds = L.latLngBounds(validPlaces.map(p => [p.latitude, p.longitude]))
      map.fitBounds(bounds, { padding: [40, 40] })
    }
  }

  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if (window.L) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => initMap()
      document.head.appendChild(script)
    }
  }, [])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const usedCategories = [...new Set(places.map(p => p.category))]

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}
    >
      <div style={{ background:'white',borderRadius:16,overflow:'hidden',width:'100%',maxWidth:900,height:'82vh',display:'flex',flexDirection:'column',boxShadow:'0 24px 64px rgba(0,0,0,0.45)' }}>
        <div style={{ padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'linear-gradient(135deg,#123C3A,#2F7C91)',flexShrink:0 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <span style={{ fontSize:22 }}>🗺️</span>
            <div>
              <p style={{ color:'white',fontWeight:700,margin:0,fontSize:16 }}>Mapa de {town?.name}</p>
              <p style={{ color:'rgba(255,255,255,0.65)',margin:0,fontSize:12 }}>{places.filter(p => p.latitude && p.longitude).length} lugares con ubicación</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.15)',border:'none',color:'white',width:34,height:34,borderRadius:8,cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center' }}>×</button>
        </div>
        <div style={{ padding:'8px 16px',background:'#f8fafc',borderBottom:'1px solid #e2e8f0',display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',flexShrink:0 }}>
          <span style={{ fontSize:11,color:'#94a3b8',fontWeight:600,marginRight:2 }}>CATEGORÍAS:</span>
          {usedCategories.map(cat => {
            const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.OTRO
            return (
              <span key={cat} style={{ background:cfg.light,color:cfg.bg,padding:'3px 10px',borderRadius:12,fontSize:12,fontWeight:600 }}>
                {cfg.emoji} {cfg.label}
              </span>
            )
          })}
        </div>
        <div ref={mapRef} style={{ flex:1 }} />
      </div>
    </div>
  )
}

// ─── QR Modal ─────────────────────────────────────────────────────────────────
function QRModal({ townSlug, town, onClose }) {
  const qrRef = useRef(null)
  const [qrReady, setQrReady] = useState(false)

  function buildQR() {
    if (!qrRef.current || !window.QRCode) return
    qrRef.current.innerHTML = ''
    new window.QRCode(qrRef.current, {
      text: `${window.location.origin}/login/${townSlug}`,
      width: 220, height: 220,
      colorDark: '#123C3A', colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel.H,
    })
    setQrReady(true)
  }

  useEffect(() => {
    if (window.QRCode) {
      buildQR()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
      script.onload = () => buildQR()
      document.head.appendChild(script)
    }
  }, [])

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-${townSlug}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.65)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:16 }}
    >
      <div style={{ background:'white',borderRadius:20,padding:'36px 32px',textAlign:'center',maxWidth:360,width:'100%',boxShadow:'0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ fontSize:36,marginBottom:8 }}>📲</div>
        <h2 style={{ color:'#123C3A',fontWeight:800,margin:'0 0 4px',fontSize:20 }}>Código QR</h2>
        <p style={{ color:'#64748b',fontSize:13,margin:'0 0 24px' }}>{town?.name || townSlug} · {town?.province || 'Costa Rica'}</p>
        <div style={{ display:'inline-flex',padding:16,background:'#f8fafc',borderRadius:16,border:'2px dashed #e2e8f0',marginBottom:16,minWidth:252,minHeight:252,alignItems:'center',justifyContent:'center' }}>
          <div ref={qrRef} />
        </div>
        <p style={{ color:'#94a3b8',fontSize:11,margin:'0 0 20px',lineHeight:1.5 }}>
          Escanear redirige a<br />
          <span style={{ color:'#123C3A',fontWeight:600,fontSize:12 }}>{window.location.origin}/login/{townSlug}</span>
        </p>
        <div style={{ display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap' }}>
          <button onClick={handleDownload} disabled={!qrReady}
            style={{ background:'#123C3A',color:'white',border:'none',padding:'10px 20px',borderRadius:10,fontWeight:600,fontSize:13,cursor:qrReady?'pointer':'not-allowed',opacity:qrReady?1:0.5 }}>
            ⬇️ Descargar PNG
          </button>
          <button onClick={onClose}
            style={{ background:'transparent',color:'#64748b',border:'2px solid #e2e8f0',padding:'10px 20px',borderRadius:10,fontWeight:600,fontSize:13,cursor:'pointer' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Sunset Hero ──────────────────────────────────────────────────────────────
const BIRD_DATA = [
  [-200,-60,7500,-8000],[80,-90,9000,-3000],[-60,40,6000,-12000],[120,-30,11000,-5000],
  [-150,10,8000,-9000],[30,-70,7000,-2000],[-80,60,10000,-6000],[160,-50,6500,-14000],
  [-20,30,9500,-4000],[50,-100,8500,-7000],[-130,-20,7200,-11000],[90,50,10500,-3500],
  [-40,-80,6800,-8500],[140,20,9200,-5500],[-90,70,7800,-10000],[-170,-40,8200,-13000],
  [70,-60,11500,-2500],[110,40,6200,-9500],[-50,90,10000,-7500],[30,-15,8800,-4500],
]

function SunsetHero({ town, searchTerm, setSearchTerm, places, onShowMap, onShowQR }) {
  const birdsRef = useRef(null)

  useEffect(() => {
    const layer = birdsRef.current
    if (!layer) return
    layer.innerHTML = ''
    BIRD_DATA.forEach(([tx, ty, dur, delay]) => {
      const bp = document.createElement('div')
      bp.style.cssText = `position:absolute;top:50%;left:50%;transform:translate(${tx}px,${ty}px)`
      const b = document.createElement('div')
      b.className = 'sh-bird'
      b.style.cssText = `animation-duration:${dur}ms;animation-delay:${delay}ms`
      const wl = document.createElement('div')
      wl.className = 'sh-wing sh-wl'
      wl.style.animationDelay = `${delay}ms`
      const wr = document.createElement('div')
      wr.className = 'sh-wing sh-wr'
      wr.style.animationDelay = `${delay}ms`
      b.appendChild(wl)
      b.appendChild(wr)
      bp.appendChild(b)
      layer.appendChild(bp)
    })
  }, [])

  return (
    <div style={{ position:'relative', width:'100%' }}>
      <style>{`
        .sh-sky{position:absolute;inset:0;background:radial-gradient(ellipse at bottom,#FFD700 0%,#F4A300 15%,#E05A00 45%,#C0392B 70%,#7B1FA2 100%);}
        .sh-glow{position:absolute;bottom:40%;left:50%;transform:translateX(-50%);width:120%;height:120px;background:radial-gradient(ellipse at center,rgba(255,220,100,0.55) 0%,transparent 70%);filter:blur(12px);}
        .sh-sun{position:absolute;bottom:40%;left:50%;transform:translateX(-50%) translateY(50%);width:90px;height:45px;border-radius:90px 90px 0 0;background:linear-gradient(0deg,rgba(255,255,255,0.5) 0%,#fff 100%);filter:blur(3px);z-index:4;}
        .sh-sea{position:absolute;bottom:0;left:0;right:0;height:40%;background:radial-gradient(ellipse at top,rgba(255,255,220,0.8) 0%,rgba(255,180,50,0.3) 10%,#5D1A00 100%);z-index:3;}
        .sh-sea-shine{height:100%;background:linear-gradient(0deg,transparent 0%,rgba(255,200,50,0.15) 60%,rgba(255,220,100,0.35) 100%);}
        .sh-waves{position:absolute;bottom:40%;left:50%;transform:translateX(-50%);z-index:5;}
        .sh-wave{position:absolute;left:-60px;width:120px;height:10px;background:rgba(255,255,255,0.75);border-radius:50%;}
        .sh-wave:nth-child(n+2){animation:sh-wave 2s linear infinite;}
        .sh-wave:nth-child(2){animation-delay:-0.5s;}.sh-wave:nth-child(3){animation-delay:-1s;}
        .sh-wave:nth-child(4){animation-delay:-1.5s;}.sh-wave:nth-child(5){animation-delay:-1.8s;}.sh-wave:nth-child(6){animation-delay:-2s;}
        @keyframes sh-wave{0%{transform:translateY(0) scale(1) rotateZ(0);opacity:.8}50%{transform:translateY(30px) scale(.6) rotateZ(4deg);opacity:.5}100%{transform:translateY(40px) scale(0) rotateZ(-30deg);opacity:0}}
        .sh-bird{position:absolute;width:60px;animation:sh-fly linear infinite;}
        .sh-wing{position:absolute;width:48%;height:14px;border-top:3px solid rgba(30,10,0,0.85);border-radius:50%;}
        .sh-wl{transform-origin:100% 50%;animation:sh-wL .75s cubic-bezier(.445,.05,.55,.95) infinite alternate;}
        .sh-wr{right:0;transform-origin:0 50%;animation:sh-wR .75s cubic-bezier(.445,.05,.55,.95) infinite alternate;}
        @keyframes sh-fly{0%{opacity:0;transform:translateZ(500px)}15%{opacity:1}100%{opacity:.4;transform:translateZ(-100px) scale(.2)}}
        @keyframes sh-wL{0%{transform:rotateZ(25deg)}100%{transform:rotateZ(-18deg)}}
        @keyframes sh-wR{0%{transform:rotateZ(-25deg)}100%{transform:rotateZ(18deg)}}
        .sh-search::placeholder{color:rgba(255,255,255,0.5);}
        .sh-search:focus{outline:none;box-shadow:0 0 0 3px rgba(247,166,64,0.4);border-color:#F7A640!important;}
        .sh-btn-map:hover{background:rgba(255,255,255,0.25)!important;}
        .sh-btn-qr:hover{opacity:0.88;}
      `}</style>

      {/* Escena sunset */}
      <div style={{ position:'relative',width:'100%',height:320,overflow:'hidden' }}>
        <div className="sh-sky" />
        <div className="sh-glow" />
        <div className="sh-sun" />
        <div className="sh-sea"><div className="sh-sea-shine" /></div>
        <div className="sh-waves">
          {[0,1,2,3,4,5].map(i => <div key={i} className="sh-wave" />)}
        </div>
        <div ref={birdsRef} style={{ position:'absolute',inset:0,zIndex:6,perspective:'600px',transformStyle:'preserve-3d' }} />

        {/* Overlay de contenido */}
        <div style={{
          position:'absolute',inset:0,zIndex:10,
          background:'linear-gradient(180deg,rgba(0,0,0,0.05) 0%,rgba(0,0,0,0.6) 100%)',
          display:'flex',flexDirection:'column',alignItems:'flex-start',
          justifyContent:'flex-end',padding:'0 5% 28px',
        }}>
          <span style={{
            display:'inline-block',background:'rgba(247,166,64,0.25)',color:'#F7A640',
            padding:'3px 12px',borderRadius:20,fontSize:12,fontWeight:600,marginBottom:8,
            border:'1px solid rgba(247,166,64,0.4)',
          }}>🗺️ Turismo Local</span>

          <h1 style={{ color:'white',fontSize:36,fontWeight:800,margin:'0 0 6px',textShadow:'0 2px 16px rgba(0,0,0,0.5)',lineHeight:1.1 }}>
            {town?.name}
          </h1>

          {town?.description && (
            <p style={{ color:'rgba(255,255,255,0.82)',fontSize:14,margin:'0 0 16px',maxWidth:500,lineHeight:1.5 }}>
              {town.description}
            </p>
          )}

          <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
            <button className="sh-btn-map" onClick={onShowMap}
              style={{ display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,0.15)',color:'white',
                border:'1.5px solid rgba(255,255,255,0.35)',padding:'9px 18px',borderRadius:10,
                fontWeight:600,fontSize:13,cursor:'pointer',backdropFilter:'blur(4px)',
                fontFamily:'inherit',transition:'background 0.2s' }}>
              🗺️ Ver mapa
            </button>
            <button className="sh-btn-qr" onClick={onShowQR}
              style={{ display:'flex',alignItems:'center',gap:7,background:'#F7A640',color:'white',
                border:'none',padding:'9px 18px',borderRadius:10,fontWeight:600,
                fontSize:13,cursor:'pointer',fontFamily:'inherit',transition:'opacity 0.2s' }}>
              📲 Código QR
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda + stats */}
      <div style={{ background:'rgba(13,43,42,0.95)',backdropFilter:'blur(8px)',padding:'12px 5%',display:'flex',alignItems:'center',gap:24,flexWrap:'wrap' }}>
        <div style={{ position:'relative',flex:'1',minWidth:200,maxWidth:380 }}>
          <span style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',fontSize:15,pointerEvents:'none' }}>🔍</span>
          <input className="sh-search" type="text" placeholder="Buscar lugar por nombre..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width:'100%',padding:'10px 13px 10px 38px',borderRadius:10,
              border:'1.5px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.1)',
              color:'white',fontSize:13,fontFamily:'inherit',transition:'border-color 0.2s,box-shadow 0.2s' }} />
        </div>
        {[
          { value: places.length, label: 'Lugares' },
          { value: new Set(places.map(p => p.category)).size, label: 'Categorías' },
        ].map(s => (
          <div key={s.label}>
            <div style={{ color:'#F7A640',fontSize:20,fontWeight:800,lineHeight:1 }}>{s.value}</div>
            <div style={{ color:'rgba(255,255,255,0.55)',fontSize:11,marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── PlacesPage ───────────────────────────────────────────────────────────────
export default function PlacesPage() {
  const { townSlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [town, setTown] = useState(null)
  const [places, setPlaces] = useState([])
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    Promise.all([townService.getTown(townSlug), townService.getPlaces(townSlug)])
      .then(([townData, placesData]) => {
        setTown(townData)
        setPlaces(placesData)
        setFilteredPlaces(placesData)
      })
      .catch(() => navigate('/error'))
      .finally(() => setLoading(false))
  }, [townSlug, navigate])

  useEffect(() => {
    let result = [...places]
    if (selectedCategory !== 'ALL') result = result.filter(p => p.category === selectedCategory)
    if (searchTerm.trim()) result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredPlaces(result)
  }, [selectedCategory, searchTerm, places])

  const categories = ['ALL', ...new Set(places.map(p => p.category))]

  if (loading) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <div style={{ textAlign:'center',color:'white' }}>
          <div style={{ width:52,height:52,border:'4px solid rgba(255,255,255,0.2)',borderTopColor:'#F7A640',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 16px' }} />
          <p style={{ fontSize:16,opacity:0.85 }}>Cargando lugares...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .cat-pill{transition:all 0.18s ease;}
        .cat-pill:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.15);}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .places-grid>*{animation:fadeUp 0.4s ease both;}
        ${Array.from({length:12},(_,i)=>`.places-grid>*:nth-child(${i+1}){animation-delay:${i*0.05}s}`).join('\n')}
      `}</style>

      <Navbar town={town} user={user} />

      {/* ── Sunset Hero ── */}
      {town && (
        <SunsetHero
          town={town}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          places={places}
          onShowMap={() => setShowMap(true)}
          onShowQR={() => setShowQR(true)}
        />
      )}

      {/* ── Category filters ── */}
      <div className="container" style={{ marginTop: -2, position:'relative',zIndex:10, paddingTop: 20 }}>
        <div style={{ background:'white',borderRadius:18,padding:'18px 20px',boxShadow:'0 8px 32px rgba(0,0,0,0.14)',display:'flex',gap:10,flexWrap:'wrap',alignItems:'center' }}>
          <span style={{ fontSize:13,fontWeight:600,color:'#6b7280',marginRight:4 }}>Filtrar:</span>
          {categories.map(cat => {
            const cfg = cat === 'ALL'
              ? { label:'Todos',emoji:'🗺️',bg:'#20606e',light:'#e6f4f6' }
              : CATEGORY_CONFIG[cat]
            const active = selectedCategory === cat
            return (
              <button key={cat} className="cat-pill" onClick={() => setSelectedCategory(cat)}
                style={{ padding:'7px 16px',borderRadius:24,fontSize:13,fontWeight:600,cursor:'pointer',
                  border:active?`2px solid ${cfg?.bg}`:'2px solid #e5e7eb',
                  background:active?cfg?.bg:cfg?.light||'#f9fafb',
                  color:active?'white':cfg?.bg||'#374151',
                  transition:'all 0.18s ease',fontFamily:'inherit' }}>
                {cfg?.emoji} {cfg?.label||cat}
                {active && (
                  <span style={{ marginLeft:6,background:'rgba(255,255,255,0.3)',borderRadius:10,padding:'1px 7px',fontSize:11 }}>
                    {cat==='ALL'?places.length:places.filter(p=>p.category===cat).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="container" style={{ padding:'32px 16px 64px' }}>
        {filteredPlaces.length === 0 ? (
          <div style={{ background:'rgba(255,255,255,0.1)',borderRadius:18,padding:'64px 24px',textAlign:'center',color:'white',backdropFilter:'blur(4px)',border:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize:52,marginBottom:12 }}>🔍</div>
            <h5 style={{ fontWeight:700 }}>Sin resultados</h5>
            <p style={{ opacity:0.7,marginBottom:20 }}>No encontramos lugares con ese criterio.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('ALL') }}
              style={{ background:'#F7A640',color:'white',border:'none',padding:'10px 24px',borderRadius:10,fontWeight:600,cursor:'pointer',fontSize:14,fontFamily:'inherit' }}>
              Ver todos
            </button>
          </div>
        ) : (
          <>
            <p style={{ color:'rgba(255,255,255,0.6)',fontSize:14,marginBottom:20 }}>
              {filteredPlaces.length} lugar{filteredPlaces.length!==1?'es':''} encontrado{filteredPlaces.length!==1?'s':''}
              {selectedCategory!=='ALL'&&` en ${CATEGORY_CONFIG[selectedCategory]?.label||selectedCategory}`}
            </p>
            <div className="places-grid row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredPlaces.map(place => (
                <div className="col" key={place.id}>
                  <PlaceCard place={place} categoryInfo={CATEGORY_CONFIG[place.category]} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {showMap && <MapModal places={places} town={town} onClose={() => setShowMap(false)} />}
      {showQR && <QRModal townSlug={townSlug} town={town} onClose={() => setShowQR(false)} />}
        
         <TourismChatbot town={town} places={places} />
    </>
  )
}