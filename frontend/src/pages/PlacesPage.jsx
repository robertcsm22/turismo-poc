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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  // Filtro por categoría
  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setFilteredPlaces(places)
    } else {
      setFilteredPlaces(places.filter((p) => p.category === selectedCategory))
    }
  }, [selectedCategory, places])

  const categories = ['ALL', ...new Set(places.map((p) => p.category))]

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <p className="text-muted">Cargando lugares...</p>
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
          <div className="mb-4">
            <h2 className="fw-bold">{town.name}</h2>
            <p className="text-muted">{town.description}</p>
          </div>
        )}

        {/* Filtros por categoría (bonus) */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => {
            const info = cat === 'ALL' ? { label: 'Todos', emoji: '🗺️' } : CATEGORY_LABELS[cat]
            return (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {info?.emoji} {info?.label || cat}
              </button>
            )
          })}
        </div>

        {/* Grid de tarjetas */}
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-5 text-muted">
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
