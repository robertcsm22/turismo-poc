import { useEffect, useMemo, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { townService } from '../services/api'
import PlaceCard from '../components/PlaceCard'
import ReviewSection from '../components/ReviewSection'
import Navbar from '../components/Navbar'
import TourismChatbot from '../components/TourismChatbot'
import tropicalScene from '../assets/tropical-scene.svg'

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
  const { t } = useTranslation('places')
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
      const catLabel = t(`categories.${place.category}`, cfg.label)
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
              <span style="background:${cfg.bg};color:white;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">${cfg.emoji} ${catLabel}</span>
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
              <p style={{ color:'white',fontWeight:700,margin:0,fontSize:16 }}>{t('mapModal.title', { town: town?.name })}</p>
              <p style={{ color:'rgba(255,255,255,0.65)',margin:0,fontSize:12 }}>{t('mapModal.withLocation', { count: places.filter(p => p.latitude && p.longitude).length })}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.15)',border:'none',color:'white',width:34,height:34,borderRadius:8,cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center' }}>×</button>
        </div>
        <div style={{ padding:'8px 16px',background:'#f8fafc',borderBottom:'1px solid #e2e8f0',display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',flexShrink:0 }}>
          <span style={{ fontSize:11,color:'#94a3b8',fontWeight:600,marginRight:2 }}>{t('mapModal.categoriesLabel')}</span>
          {usedCategories.map(cat => {
            const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.OTRO
            return (
              <span key={cat} style={{ background:cfg.light,color:cfg.bg,padding:'3px 10px',borderRadius:12,fontSize:12,fontWeight:600 }}>
                {cfg.emoji} {t(`categories.${cat}`, cfg.label)}
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
  const { t } = useTranslation(['places', 'common'])
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
      <style>{`
        @keyframes qr-scan {
          0% { transform: translateY(0px); }
          100% { transform: translateY(200px); }
        }
        .qr-scan-line {
          position: absolute; left: 16px; right: 16px; height: 3px;
          background: linear-gradient(90deg, transparent, #2F7C91, #F7A640, #2F7C91, transparent);
          border-radius: 2px; animation: qr-scan 2s linear infinite;
          box-shadow: 0 0 8px rgba(47,124,145,0.8), 0 0 16px rgba(247,166,64,0.4);
          top: 16px; z-index: 10;
        }
        .qr-corner { position: absolute; width: 20px; height: 20px; border-color: #F7A640; border-style: solid; }
        .qr-corner-tl { top: 8px; left: 8px; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
        .qr-corner-tr { top: 8px; right: 8px; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
        .qr-corner-bl { bottom: 8px; left: 8px; border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }
        .qr-corner-br { bottom: 8px; right: 8px; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }
      `}</style>
      <div style={{ background:'white',borderRadius:20,padding:'36px 32px',textAlign:'center',maxWidth:360,width:'100%',boxShadow:'0 24px 64px rgba(0,0,0,0.4)' }}>
        <div style={{ fontSize:36,marginBottom:8 }}>📲</div>
        <h2 style={{ color:'#123C3A',fontWeight:800,margin:'0 0 4px',fontSize:20 }}>{t('qrModal.title', { ns: 'places' })}</h2>
        <p style={{ color:'#64748b',fontSize:13,margin:'0 0 24px' }}>{town?.name || townSlug} · {town?.province || 'Costa Rica'}</p>

        {/* QR con efecto scan */}
        <div style={{ position:'relative',display:'inline-block',marginBottom:16 }}>
          <div style={{ padding:16,background:'#f8fafc',borderRadius:16,border:'2px dashed #e2e8f0',minWidth:252,minHeight:252,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',position:'relative' }}>
            {qrReady && <div className="qr-scan-line" />}
            <div className="qr-corner qr-corner-tl" />
            <div className="qr-corner qr-corner-tr" />
            <div className="qr-corner qr-corner-bl" />
            <div className="qr-corner qr-corner-br" />
            <div ref={qrRef} />
          </div>
        </div>

        <p style={{ color:'#94a3b8',fontSize:11,margin:'0 0 20px',lineHeight:1.5 }}>
          {t('qrModal.scanRedirect', { ns: 'places' })}<br />
          <span style={{ color:'#123C3A',fontWeight:600,fontSize:12 }}>{window.location.origin}/login/{townSlug}</span>
        </p>
        <div style={{ display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap' }}>
          <button onClick={handleDownload} disabled={!qrReady}
            style={{ background:'#123C3A',color:'white',border:'none',padding:'10px 20px',borderRadius:10,fontWeight:600,fontSize:13,cursor:qrReady?'pointer':'not-allowed',opacity:qrReady?1:0.5 }}>
            {t('qrModal.download', { ns: 'places' })}
          </button>
          <button onClick={onClose}
            style={{ background:'transparent',color:'#64748b',border:'2px solid #e2e8f0',padding:'10px 20px',borderRadius:10,fontWeight:600,fontSize:13,cursor:'pointer' }}>
            {t('buttons.close', { ns: 'common' })}
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
  const { t } = useTranslation('places')
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
        .sh-bird{position:absolute;width:60px;animation:sh-fly linear infinite;}
        .sh-wing{position:absolute;width:48%;height:14px;border-top:3px solid rgba(30,10,0,0.7);border-radius:50%;}
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

      <div style={{ position:'relative',width:'100%',height:340,overflow:'hidden' }}>
        {/* Fondo: ilustración de atardecer tropical */}
        <img
          src={tropicalScene}
          alt=""
          style={{
            position:'absolute',inset:0,
            width:'100%',height:'100%',
            objectFit:'cover',objectPosition:'center 40%',
            pointerEvents:'none',
          }}
        />
        <div ref={birdsRef} style={{ position:'absolute',inset:0,zIndex:6,perspective:'600px',transformStyle:'preserve-3d' }} />

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
          }}>{t('badge')}</span>

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
              {t('showMap')}
            </button>
            <button className="sh-btn-qr" onClick={onShowQR}
              style={{ display:'flex',alignItems:'center',gap:7,background:'#F7A640',color:'white',
                border:'none',padding:'9px 18px',borderRadius:10,fontWeight:600,
                fontSize:13,cursor:'pointer',fontFamily:'inherit',transition:'opacity 0.2s' }}>
              {t('showQR')}
            </button>
          </div>
        </div>
      </div>

      <div style={{ background:'rgba(13,43,42,0.95)',backdropFilter:'blur(8px)',padding:'12px 5%',display:'flex',alignItems:'center',gap:24,flexWrap:'wrap' }}>
        <div style={{ position:'relative',flex:'1',minWidth:200,maxWidth:380 }}>
          <span style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',fontSize:15,pointerEvents:'none' }}>🔍</span>
          <input className="sh-search" type="text" placeholder={t('searchPlaceholder')}
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width:'100%',padding:'10px 13px 10px 38px',borderRadius:10,
              border:'1.5px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.1)',
              color:'white',fontSize:13,fontFamily:'inherit',transition:'border-color 0.2s,box-shadow 0.2s' }} />
        </div>
        {[
          { value: places.length, label: t('statsPlaces') },
          { value: new Set(places.map(p => p.category)).size, label: t('statsCategories') },
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
  const { t } = useTranslation('places')
  const { townSlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [town, setTown] = useState(null)
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [selectedReviewPlace, setSelectedReviewPlace] = useState(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'ALL'
  const searchTerm = searchParams.get('search') || ''
  const sortBy = searchParams.get('sort') || 'name'

  const setSelectedCategory = (cat) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (cat === 'ALL') next.delete('category')
      else next.set('category', cat)
      return next
    })
  }

  const setSearchTerm = (term) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (term) next.set('search', term)
      else next.delete('search')
      return next
    })
  }

  const setSortBy = (sort) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (sort === 'name') next.delete('sort')
      else next.set('sort', sort)
      return next
    })
  }

  useEffect(() => {
    Promise.all([townService.getTown(townSlug), townService.getPlaces(townSlug)])
      .then(([townData, placesData]) => {
        setTown(townData)
        setPlaces(placesData)
      })
      .catch(() => navigate('/error'))
      .finally(() => setLoading(false))
  }, [townSlug, navigate])

  const filteredPlaces = useMemo(() => {
    let result = [...places]
    if (selectedCategory !== 'ALL') result = result.filter(p => p.category === selectedCategory)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term)
      )
    }
    result.sort((a, b) => {
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      if (sortBy === 'createdAt') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      return a.name.localeCompare(b.name)
    })
    return result
  }, [selectedCategory, searchTerm, sortBy, places])

  useEffect(() => {
    if (!selectedReviewPlace) return
    const stillVisible = filteredPlaces.some(place => place.id === selectedReviewPlace.id)
    if (!stillVisible) setSelectedReviewPlace(null)
  }, [filteredPlaces, selectedReviewPlace])

  const categories = ['ALL', ...new Set(places.map(p => p.category))]
  const visiblePlaces = selectedReviewPlace ? [selectedReviewPlace] : filteredPlaces

  if (loading) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <div style={{ textAlign:'center',color:'white' }}>
          <div style={{ width:52,height:52,border:'4px solid rgba(255,255,255,0.2)',borderTopColor:'#F7A640',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 16px' }} />
          <p style={{ fontSize:16,opacity:0.85 }}>{t('loadingPlaces')}</p>
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

      <div className="container" style={{ marginTop:-2, position:'relative', zIndex:10, paddingTop:20 }}>
        <div style={{ background:'white',borderRadius:18,padding:'18px 20px',boxShadow:'0 8px 32px rgba(0,0,0,0.14)',display:'flex',gap:10,flexWrap:'wrap',alignItems:'center' }}>
          <span style={{ fontSize:13,fontWeight:600,color:'#6b7280',marginRight:4 }}>{t('filterLabel')}</span>
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
                {cfg?.emoji} {t(`categories.${cat}`, cfg?.label || cat)}
                {active && (
                  <span style={{ marginLeft:6,background:'rgba(255,255,255,0.3)',borderRadius:10,padding:'1px 7px',fontSize:11 }}>
                    {cat==='ALL'?places.length:places.filter(p=>p.category===cat).length}
                  </span>
                )}
              </button>
            )
          })}
          <div style={{ marginLeft:'auto',display:'flex',alignItems:'center',gap:8 }}>
            <label htmlFor="sort-select" style={{ fontSize:13,fontWeight:600,color:'#6b7280' }}>{t('sortLabel')}</label>
            <select id="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding:'7px 12px',borderRadius:10,border:'2px solid #e5e7eb',fontSize:13,fontWeight:600,color:'#374151',fontFamily:'inherit',cursor:'pointer',background:'#f9fafb' }}>
              <option value="name">{t('sortOptions.name')}</option>
              <option value="category">{t('sortOptions.category')}</option>
              <option value="createdAt">{t('sortOptions.createdAt')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'32px 16px 64px' }}>
        {filteredPlaces.length === 0 ? (
          <div style={{ background:'rgba(255,255,255,0.1)',borderRadius:18,padding:'64px 24px',textAlign:'center',color:'white',backdropFilter:'blur(4px)',border:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize:52,marginBottom:12 }}>🔍</div>
            <h5 style={{ fontWeight:700 }}>{t('noResultsTitle')}</h5>
            <p style={{ opacity:0.7,marginBottom:20 }}>{t('noResultsBody')}</p>
            <button onClick={() => { setSearchTerm(''); setSelectedCategory('ALL') }}
              style={{ background:'#F7A640',color:'white',border:'none',padding:'10px 24px',borderRadius:10,fontWeight:600,cursor:'pointer',fontSize:14,fontFamily:'inherit' }}>
              {t('viewAll')}
            </button>
          </div>
        ) : (
          <>
            <p style={{ color:'rgba(255,255,255,0.6)',fontSize:14,marginBottom:20 }}>
              {selectedReviewPlace
                ? t('viewingReviews', { name: selectedReviewPlace.name })
                : selectedCategory !== 'ALL'
                  ? t('foundInCategory', { count: filteredPlaces.length, category: t(`categories.${selectedCategory}`, CATEGORY_CONFIG[selectedCategory]?.label || selectedCategory) })
                  : t('found', { count: filteredPlaces.length })}
            </p>
            {selectedReviewPlace && (
              <button
                type="button"
                onClick={() => setSelectedReviewPlace(null)}
                style={{
                  background: 'rgba(255,255,255,0.14)',
                  color: 'white',
                  border: '1.5px solid rgba(255,255,255,0.28)',
                  padding: '9px 16px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  marginBottom: 18,
                }}
              >
                {t('viewAllPlaces')}
              </button>
            )}
            <div className={`places-grid row g-4 ${selectedReviewPlace ? 'row-cols-1 row-cols-lg-2' : 'row-cols-1 row-cols-md-2 row-cols-lg-3'}`}>
              {visiblePlaces.map(place => (
                <div className="col" key={place.id}>
                  <PlaceCard
                    place={place}
                    categoryInfo={CATEGORY_CONFIG[place.category]}
                    categoryLabel={t(`categories.${place.category}`, CATEGORY_CONFIG[place.category]?.label)}
                    isSelected={selectedReviewPlace?.id === place.id}
                    onSelect={() => setSelectedReviewPlace(current =>
                      current?.id === place.id ? null : place
                    )}
                  />
                </div>
              ))}
              {selectedReviewPlace && (
                <div className="col">
                  <ReviewSection key={selectedReviewPlace.id} place={selectedReviewPlace} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showMap && <MapModal places={places} town={town} onClose={() => setShowMap(false)} />}
      {showQR && <QRModal townSlug={townSlug} town={town} onClose={() => setShowQR(false)} />}
      <TourismChatbot town={town} places={places} />
    </>
  )
}
