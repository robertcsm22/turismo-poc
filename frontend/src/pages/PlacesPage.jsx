import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { townService } from '../services/api'
import PlaceCard from '../components/PlaceCard'
import Navbar from '../components/Navbar'

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
    if (selectedCategory !== 'ALL') result = result.filter((p) => p.category === selectedCategory)
    if (searchTerm.trim()) result = result.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredPlaces(result)
  }, [selectedCategory, searchTerm, places])

  const categories = ['ALL', ...new Set(places.map((p) => p.category))]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: 52, height: 52, border: '4px solid rgba(255,255,255,0.2)',
            borderTopColor: '#F7A640', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ fontSize: 16, opacity: 0.85 }}>Cargando lugares...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        .cat-pill { transition: all 0.18s ease; }
        .cat-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .search-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(247,166,64,0.35); border-color: #F7A640 !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .places-grid > * { animation: fadeUp 0.4s ease both; }
        ${Array.from({ length: 12 }, (_, i) => `.places-grid > *:nth-child(${i + 1}) { animation-delay: ${i * 0.05}s }`).join('\n')}
      `}</style>

      <Navbar town={town} user={user} />

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0d2b2a 0%, #123C3A 35%, #1a5060 70%, #2F7C91 100%)',
        padding: '28px 0 52px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(247,166,64,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(47,124,145,0.15)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative' }}>
          {town && (
            <div style={{ maxWidth: 680 }}>
              <span style={{
                display: 'inline-block', background: 'rgba(247,166,64,0.2)',
                color: '#F7A640', padding: '3px 12px', borderRadius: 20,
                fontSize: 12, fontWeight: 600, marginBottom: 10,
                border: '1px solid rgba(247,166,64,0.3)',
              }}>
                🗺️ Turismo Local
              </span>
              <h1 style={{ color: 'white', fontSize: 32, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15, letterSpacing: -0.5 }}>
                {town.name}
              </h1>
              {town.description && (
                <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, margin: '0 0 18px', lineHeight: 1.5, maxWidth: 520 }}>
                  {town.description}
                </p>
              )}

              {/* Search bar + stats row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: 380 }}>
                  <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 16, pointerEvents: 'none',
                  }}>🔍</span>
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Buscar lugar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%', padding: '11px 14px 11px 42px',
                      borderRadius: 12, border: '2px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.12)', color: 'white',
                      fontSize: 14, backdropFilter: 'blur(8px)',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 20 }}>
                  {[
                    { value: places.length, label: 'Lugares' },
                    { value: new Set(places.map(p => p.category)).size, label: 'Categorías' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div style={{ color: '#F7A640', fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Category filters ── */}
      <div className="container" style={{ marginTop: -28, position: 'relative', zIndex: 10 }}>
        <div style={{
          background: 'white', borderRadius: 18, padding: '18px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginRight: 4 }}>Filtrar:</span>
          {categories.map((cat) => {
            const cfg = cat === 'ALL' ? { label: 'Todos', emoji: '🗺️', bg: '#20606e', light: '#e6f4f6' } : CATEGORY_CONFIG[cat]
            const active = selectedCategory === cat
            return (
              <button
                key={cat}
                className="cat-pill"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 16px', borderRadius: 24, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', border: active ? `2px solid ${cfg?.bg}` : '2px solid #e5e7eb',
                  background: active ? cfg?.bg : cfg?.light || '#f9fafb',
                  color: active ? 'white' : cfg?.bg || '#374151',
                  transition: 'all 0.18s ease',
                }}
              >
                {cfg?.emoji} {cfg?.label || cat}
                {active && places.filter(p => cat === 'ALL' || p.category === cat).length > 0 && (
                  <span style={{
                    marginLeft: 6, background: 'rgba(255,255,255,0.3)',
                    borderRadius: 10, padding: '1px 7px', fontSize: 11,
                  }}>
                    {cat === 'ALL' ? places.length : places.filter(p => p.category === cat).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="container" style={{ padding: '32px 16px 64px' }}>
        {filteredPlaces.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: 18,
            padding: '64px 24px', textAlign: 'center', color: 'white',
            backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
            <h5 style={{ fontWeight: 700 }}>Sin resultados</h5>
            <p style={{ opacity: 0.7, marginBottom: 20 }}>
              No encontramos lugares con ese criterio.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('ALL') }}
              style={{
                background: '#F7A640', color: 'white', border: 'none',
                padding: '10px 24px', borderRadius: 10, fontWeight: 600,
                cursor: 'pointer', fontSize: 14,
              }}
            >
              Ver todos
            </button>
          </div>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 20 }}>
              {filteredPlaces.length} lugar{filteredPlaces.length !== 1 ? 'es' : ''} encontrado{filteredPlaces.length !== 1 ? 's' : ''}
              {selectedCategory !== 'ALL' && ` en ${CATEGORY_CONFIG[selectedCategory]?.label || selectedCategory}`}
            </p>
            <div className="places-grid row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredPlaces.map((place) => (
                <div className="col" key={place.id}>
                  <PlaceCard place={place} categoryInfo={CATEGORY_CONFIG[place.category]} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
