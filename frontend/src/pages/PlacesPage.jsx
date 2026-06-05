import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { townService } from '../services/api'
import PlaceCard from '../components/PlaceCard'
import Navbar from '../components/Navbar'

const CATEGORY_LABELS = {
  RESTAURANTE: { label: 'Restaurante', emoji: '🍽️', color: 'danger' },
  PARQUE: { label: 'Parque', emoji: '🌳', color: 'success' },
  MUSEO: { label: 'Museo', emoji: '🏛️', color: 'info' },
  MIRADOR: { label: 'Mirador', emoji: '🔭', color: 'warning' },
  HOTEL: { label: 'Hotel', emoji: '🏨', color: 'primary' },
  PLAYA: { label: 'Playa', emoji: '🏖️', color: 'info' },
  CULTURAL: { label: 'Cultural', emoji: '🎭', color: 'secondary' },
  GASTRONOMIA: { label: 'Gastronomía', emoji: '🥘', color: 'danger' },
  OTRO: { label: 'Otro', emoji: '📍', color: 'dark' },
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
  const [error, setError] = useState(null)
  const [hoveredCategory, setHoveredCategory] = useState(null)

  useEffect(() => {
    Promise.all([
      townService.getTown(townSlug),
      townService.getPlaces(townSlug),
    ])
      .then(([townData, placesData]) => {
        setTown(townData)
        setPlaces(placesData)
        setFilteredPlaces(placesData)
      })
      .catch(() => {
        setError('No se pudo cargar la información del pueblo.')
        navigate('/error')
      })
      .finally(() => setLoading(false))
  }, [townSlug, navigate])

 // Filtro por categoría y búsqueda
useEffect(() => {
  let result = [...places]

  if (selectedCategory !== 'ALL') {
    result = result.filter(
      (p) => p.category === selectedCategory
    )
  }

  if (searchTerm.trim() !== '') {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  setFilteredPlaces(result)
}, [selectedCategory, searchTerm, places])

  const categories = ['ALL', ...new Set(places.map((p) => p.category))]

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border mb-3" style={{ color: 'var(--color-naranja)' }} />
          <p className="text-white">Cargando lugares...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar town={town} user={user} />

      <div className="container py-4">
        {/* Header del pueblo */}
        {town && (
          <div className="mb-4" style={{ background: 'var(--color-crema)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--color-naranja)' }}>
            <h2 className="fw-bold" style={{ color: 'var(--color-verde-oscuro)' }}>{town.name}</h2>
            <p className="text-muted">{town.description}</p>
          </div>
        )}

        <div className="mb-4">
  <input
    type="text"
    className="form-control"
    placeholder="Buscar lugar por nombre..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

        {/* Filtros por categoría (bonus) */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => {
            const info = cat === 'ALL' ? { label: 'Todos', emoji: '🗺️' } : CATEGORY_LABELS[cat]
            const isHovered = hoveredCategory === cat
            return (
              <button
                key={cat}
                className={`btn btn-sm`}
                onClick={() => setSelectedCategory(cat)}
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  background: selectedCategory === cat 
                    ? 'var(--color-verde-selva)' 
                    : isHovered 
                    ? 'var(--color-azul-oceano)'
                    : 'transparent',
                  color: selectedCategory === cat || isHovered ? 'var(--color-crema)' : 'var(--color-crema)',
                  border: '2px solid var(--color-arena)',
                  transition: 'background 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                {info?.emoji} {info?.label || cat}
              </button>
            )
          })}
        </div>

        {/* Grid de tarjetas */}
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-5 text-white" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '2rem' }}>
            <span style={{ fontSize: 48 }}>🔍</span>
            <p className="mt-2">No hay lugares en esta categoría.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredPlaces.map((place) => (
              <div className="col" key={place.id}>
                <PlaceCard place={place} categoryInfo={CATEGORY_LABELS[place.category]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
