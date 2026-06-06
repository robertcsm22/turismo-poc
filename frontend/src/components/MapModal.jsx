import { useEffect, useRef } from 'react'
import { CATEGORY_CONFIG } from '../pages/PlacesPage'

export default function MapModal({ places, town, onClose }) {
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
        html: `<div style="
            width:40px;height:40px;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);background:${cfg.bg};
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 3px 10px rgba(0,0,0,0.35);border:2px solid white;">
            <span style="transform:rotate(45deg);font-size:16px;line-height:1;">${cfg.emoji}</span>
          </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -44],
      })

      L.marker([place.latitude, place.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:190px;font-family:inherit;">
            ${place.imageUrl
              ? `<img src="${place.imageUrl}" style="width:100%;height:90px;object-fit:cover;border-radius:6px;margin-bottom:8px;"/>`
              : ''}
            <div style="margin-bottom:5px;">
              <span style="background:${cfg.bg};color:white;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">
                ${cfg.emoji} ${cfg.label}
              </span>
            </div>
            <strong style="font-size:14px;display:block;margin-bottom:3px;">${place.name}</strong>
            ${place.description
              ? `<p style="font-size:12px;color:#555;margin:0 0 4px;line-height:1.4;">${place.description.slice(0, 80)}${place.description.length > 80 ? '…' : ''}</p>`
              : ''}
            ${place.address
              ? `<p style="font-size:12px;color:#888;margin:0;">📍 ${place.address}</p>`
              : ''}
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
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div style={{
        background: 'white', borderRadius: 16, overflow: 'hidden',
        width: '100%', maxWidth: 900, height: '82vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 20px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #123C3A, #2F7C91)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🗺️</span>
            <div>
              <p style={{ color: 'white', fontWeight: 700, margin: 0, fontSize: 16 }}>
                Mapa de {town?.name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: 12 }}>
                {places.filter(p => p.latitude && p.longitude).length} lugares con ubicación
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
              width: 34, height: 34, borderRadius: 8, cursor: 'pointer', fontSize: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >×</button>
        </div>

        {/* Leyenda */}
        <div style={{
          padding: '8px 16px', background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginRight: 2 }}>
            CATEGORÍAS:
          </span>
          {usedCategories.map(cat => {
            const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.OTRO
            return (
              <span key={cat} style={{
                background: cfg.light, color: cfg.bg,
                padding: '3px 10px', borderRadius: 12,
                fontSize: 12, fontWeight: 600,
              }}>
                {cfg.emoji} {cfg.label}
              </span>
            )
          })}
        </div>

        {/* Mapa */}
        <div ref={mapRef} style={{ flex: 1 }} />
      </div>
    </div>
  )
}