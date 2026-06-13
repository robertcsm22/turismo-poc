import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { placeService, townService } from '../services/api'
import Navbar from '../components/Navbar'
import { localizedField } from '../utils/localized'

const CATEGORIES = {
  PARQUE:      { label: 'Parque',       icon: '🌿', bg: '#16a34a', light: '#dcfce7' },
  PLAYA:       { label: 'Playa',        icon: '🏖️', bg: '#0284c7', light: '#e0f2fe' },
  HOTEL:       { label: 'Hotel',        icon: '🏨', bg: '#d97706', light: '#fef3c7' },
  MIRADOR:     { label: 'Mirador',      icon: '🏔️', bg: '#7c3aed', light: '#ede9fe' },
  RESTAURANTE: { label: 'Restaurante',  icon: '🍽️', bg: '#dc2626', light: '#fee2e2' },
  MUSEO:       { label: 'Museo',        icon: '🏛️', bg: '#4f46e5', light: '#e0e7ff' },
  CULTURAL:    { label: 'Cultural',     icon: '🎭', bg: '#db2777', light: '#fce7f3' },
  GASTRONOMIA: { label: 'Gastronomía',  icon: '🍜', bg: '#ea580c', light: '#ffedd5' },
  OTRO:        { label: 'Otro',         icon: '📍', bg: '#64748b', light: '#f1f5f9' },
}

const EMPTY_FORM = { name: '', description: '', nameEn: '', descriptionEn: '', category: 'PARQUE', address: '', imageUrl: '', latitude: '', longitude: '' }

// Centro por defecto de Santa Teresa, Costa Rica
const DEFAULT_CENTER = [9.6466, -85.1700]

function CoordPicker({ latitude, longitude, onChange }) {
  const { t } = useTranslation('admin')
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    const loadLeaflet = () => {
      const L = window.L
      if (!mapRef.current || mapInstanceRef.current) return

      const lat = parseFloat(latitude) || DEFAULT_CENTER[0]
      const lng = parseFloat(longitude) || DEFAULT_CENTER[1]

      const map = L.map(mapRef.current, { zoomControl: true }).setView([lat, lng], 14)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      if (latitude && longitude) {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map)
        markerRef.current.on('dragend', (e) => {
          const pos = e.target.getLatLng()
          onChange(pos.lat.toFixed(6), pos.lng.toFixed(6))
        })
      }

      map.on('click', (e) => {
        const { lat, lng } = e.latlng
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map)
          markerRef.current.on('dragend', (ev) => {
            const pos = ev.target.getLatLng()
            onChange(pos.lat.toFixed(6), pos.lng.toFixed(6))
          })
        }
        onChange(lat.toFixed(6), lng.toFixed(6))
      })
    }

    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (window.L) {
      loadLeaflet()
    } else {
      const existing = document.querySelector('script[src*="leaflet"]')
      if (existing) {
        existing.addEventListener('load', loadLeaflet)
      } else {
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = loadLeaflet
        document.head.appendChild(script)
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  // Sync marker when lat/lng change externally (e.g. manual input)
  useEffect(() => {
    const map = mapInstanceRef.current
    const L = window.L
    if (!map || !L) return
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    if (!lat || !lng) return
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map)
      markerRef.current.on('dragend', (e) => {
        const pos = e.target.getLatLng()
        onChange(pos.lat.toFixed(6), pos.lng.toFixed(6))
      })
    }
    map.setView([lat, lng], map.getZoom())
  }, [latitude, longitude])

  return (
    <div>
      <div
        ref={mapRef}
        style={{ height: 180, borderRadius: 10, overflow: 'hidden', border: '1.5px solid #d1d5db', cursor: 'crosshair' }}
      />
      <p style={{ margin: '6px 0 0', fontSize: 11, color: '#9ca3af' }}>
        {t('coordPicker.instructions')}
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{t('coordPicker.latitude')}</label>
          <input
            type="number" step="any" placeholder="9.6466"
            value={latitude}
            onChange={e => onChange(e.target.value, longitude)}
            style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 13, fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 3 }}>{t('coordPicker.longitude')}</label>
          <input
            type="number" step="any" placeholder="-85.1700"
            value={longitude}
            onChange={e => onChange(latitude, e.target.value)}
            style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 13, fontFamily: 'inherit' }}
          />
        </div>
      </div>
    </div>
  )
}

function Toast({ toast }) {
  if (!toast) return null
  const isSuccess = toast.type === 'success'
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: isSuccess ? '#16a34a' : '#dc2626',
      color: 'white', padding: '14px 20px', borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', gap: 10,
      fontSize: 15, fontWeight: 500,
      animation: 'slideIn 0.3s ease',
      maxWidth: 340,
    }}>
      <span style={{ fontSize: 18 }}>{isSuccess ? '✅' : '❌'}</span>
      {toast.message}
    </div>
  )
}

function CategoryBadge({ category }) {
  const { t: tp } = useTranslation('places')
  const cfg = CATEGORIES[category] || CATEGORIES.OTRO
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: cfg.light, color: cfg.bg,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      border: `1px solid ${cfg.bg}33`,
    }}>
      {cfg.icon} {tp(`categories.${category}`, cfg.label)}
    </span>
  )
}

export default function AdminPlacesPage() {
  const { t, i18n } = useTranslation(['admin', 'common'])
  const { t: tp } = useTranslation('places')
  const navigate = useNavigate()
  const { user } = useAuth()
  const { townSlug = 'santa-teresa' } = useParams()

  const [town, setTown] = useState(null)
  const [places, setPlaces] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [toast, setToast] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [townTranslation, setTownTranslation] = useState({ nameEn: '', descriptionEn: '' })
  const [savingTranslation, setSavingTranslation] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    Promise.all([townService.getTown(townSlug), townService.getPlaces(townSlug)])
      .then(([townData, placesData]) => {
        setTown(townData)
        setPlaces(placesData)
        setTownTranslation({
          nameEn: townData.nameEn || '',
          descriptionEn: townData.descriptionEn || '',
        })
      })
      .catch(console.error)
  }, [townSlug])

  const handleTownTranslationChange = (e) =>
    setTownTranslation({ ...townTranslation, [e.target.name]: e.target.value })

  const handleSaveTownTranslation = async (e) => {
    e.preventDefault()
    if (!town?.id) return
    setSavingTranslation(true)
    try {
      const updated = await townService.updateTranslation(town.id, townTranslation)
      setTown(updated)
      showToast(t('translation.saveSuccess'))
    } catch {
      showToast(t('translation.saveError'), 'error')
    } finally {
      setSavingTranslation(false)
    }
  }

  const loadPlaces = () => {
    townService.getPlaces(townSlug).then(setPlaces).catch(console.error)
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!town?.id) {
      showToast(t('messages.townLoadError'), 'error')
      return
    }
    try {
      const payload = {
        ...formData,
        latitude: formData.latitude !== '' ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude !== '' ? parseFloat(formData.longitude) : null,
      }
      if (editingId) {
        await placeService.updatePlace(editingId, payload)
        showToast(t('messages.placeUpdated'))
      } else {
        await placeService.createPlace(town.id, payload)
        showToast(t('messages.placeCreated'))
      }
      setEditingId(null)
      setFormData(EMPTY_FORM)
      loadPlaces()
    } catch (err) {
      console.error('Error al guardar lugar:', err?.response?.data ?? err)
      const status = err?.response?.status
      if (status === 401 || status === 403) {
        showToast(t('messages.noPermission'), 'error')
      } else if (status === 400) {
        showToast(t('messages.invalidData'), 'error')
      } else {
        showToast(t('messages.saveError'), 'error')
      }
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      await placeService.deletePlace(id)
      showToast(t('messages.placeDeleted'))
      loadPlaces()
    } catch {
      showToast(t('messages.deleteError'), 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (place) => {
    setEditingId(place.id)
    setFormData({
      name: place.name || '',
      description: place.description || '',
      nameEn: place.nameEn || '',
      descriptionEn: place.descriptionEn || '',
      category: place.category || 'PARQUE',
      address: place.address || '',
      imageUrl: place.imageUrl || '',
      latitude: place.latitude != null ? String(place.latitude) : '',
      longitude: place.longitude != null ? String(place.longitude) : '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData(EMPTY_FORM)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #d1d5db', fontSize: 14, outline: 'none',
    background: 'white', transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: '#374151', marginBottom: 6,
  }

  return (
    <>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform: translateX(40px) } to { opacity:1; transform: translateX(0) } }
        .admin-input:focus { border-color: #20606e !important; box-shadow: 0 0 0 3px #20606e22; }
        .place-admin-card { transition: transform 0.2s, box-shadow 0.2s; }
        .place-admin-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.15) !important; }
        .btn-edit:hover { background: #d97706 !important; }
        .btn-delete:hover { background: #b91c1c !important; }
        .btn-back:hover { background: #1a4d56 !important; transform: translateX(-3px); }
        .btn-submit:hover { background: #1a4d56 !important; }
      `}</style>

      <Toast toast={toast} />
      <Navbar town={town} user={user} />

      <div style={{
        background: 'linear-gradient(135deg, #123C3A 0%, #20606e 60%, #2F7C91 100%)',
        padding: '36px 0 32px', color: 'white',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button
              className="btn-back"
              onClick={() => navigate(-1)}
              style={{
                background: 'rgba(255,255,255,0.15)', color: 'white',
                border: '1.5px solid rgba(255,255,255,0.3)',
                padding: '8px 18px', borderRadius: 10, fontSize: 14,
                fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                backdropFilter: 'blur(4px)',
              }}
            >
              ← {t('buttons.back', { ns: 'common' })}
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
                {t('header.title')}
              </h1>
              <p style={{ margin: '4px 0 0', opacity: 0.75, fontSize: 14 }}>
                {t('header.subtitle', { town: town ? localizedField(town, 'name', i18n.language) : 'Santa Teresa' })}
              </p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => navigate('/admin/estadisticas')}
                style={{
                  background: 'rgba(255,255,255,0.15)', color: 'white',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                  padding: '8px 18px', borderRadius: 10, fontSize: 14,
                  fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {t('stats.navLink')}
              </button>
              <span style={{
                background: 'rgba(255,255,255,0.2)', padding: '6px 16px',
                borderRadius: 20, fontSize: 14, fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
              }}>
                {t('placesCount', { count: places.length })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 16px 60px' }}>
        <div className="row g-4">

          <div className="col-lg-4">
            <div style={{
              background: 'white', borderRadius: 18, overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)', position: 'sticky', top: 80,
            }}>
              <div style={{
                background: editingId
                  ? 'linear-gradient(135deg, #d97706, #b45309)'
                  : 'linear-gradient(135deg, #20606e, #123C3A)',
                padding: '20px 24px', color: 'white',
              }}>
                <h5 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                  {editingId ? t('form.editTitle') : t('form.newTitle')}
                </h5>
                {editingId && (
                  <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: 13 }}>
                    {t('form.editingId', { id: editingId })}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t('form.nameLabel')}</label>
                  <input className="admin-input" style={inputStyle} type="text" name="name"
                    placeholder={t('form.namePlaceholder')} value={formData.name} onChange={handleChange} required />
                </div>

                <div>
                  <label style={labelStyle}>{t('form.descriptionLabel')}</label>
                  <textarea className="admin-input" style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                    name="description" placeholder={t('form.descriptionPlaceholder')}
                    value={formData.description} onChange={handleChange} />
                </div>

                <div>
                  <label style={labelStyle}>{t('form.nameEnLabel')}</label>
                  <input className="admin-input" style={inputStyle} type="text" name="nameEn"
                    placeholder={t('form.nameEnPlaceholder')} value={formData.nameEn} onChange={handleChange} />
                </div>

                <div>
                  <label style={labelStyle}>{t('form.descriptionEnLabel')}</label>
                  <textarea className="admin-input" style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                    name="descriptionEn" placeholder={t('form.descriptionEnPlaceholder')}
                    value={formData.descriptionEn} onChange={handleChange} />
                </div>

                <div>
                  <label style={labelStyle}>{t('form.categoryLabel')}</label>
                  <select className="admin-input" style={{ ...inputStyle, cursor: 'pointer' }}
                    name="category" value={formData.category} onChange={handleChange}>
                    {Object.entries(CATEGORIES).map(([val, cfg]) => (
                      <option key={val} value={val}>{cfg.icon} {tp(`categories.${val}`, cfg.label)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>{t('form.addressLabel')}</label>
                  <input className="admin-input" style={inputStyle} type="text" name="address"
                    placeholder={t('form.addressPlaceholder')} value={formData.address} onChange={handleChange} />
                </div>

                <div>
                  <label style={labelStyle}>{t('form.imageUrlLabel')}</label>
                  <input className="admin-input" style={inputStyle} type="text" name="imageUrl"
                    placeholder={t('form.imageUrlPlaceholder')} value={formData.imageUrl} onChange={handleChange} />
                  {formData.imageUrl && (
                    <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', height: 120 }}>
                      <img src={formData.imageUrl} alt={t('form.imagePreviewAlt')}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none' }} />
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>{t('form.locationLabel')}</label>
                  <CoordPicker
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onChange={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button className="btn-submit" type="submit" disabled={!town} style={{
                    flex: 1, padding: '11px 0',
                    background: !town ? '#9ca3af' : editingId ? '#d97706' : '#20606e',
                    color: 'white', border: 'none', borderRadius: 10,
                    fontWeight: 700, fontSize: 15,
                    cursor: !town ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}>
                    {editingId ? t('form.saveChanges') : t('form.createPlace')}
                  </button>
                  {editingId && (
                    <button type="button" onClick={handleCancel} style={{
                      padding: '11px 16px', background: '#f1f5f9',
                      color: '#64748b', border: 'none', borderRadius: 10,
                      fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    }}>
                      {t('buttons.cancel', { ns: 'common' })}
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div style={{
              background: 'white', borderRadius: 18, overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)', marginTop: 24,
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #2F7C91, #123C3A)',
                padding: '20px 24px', color: 'white',
              }}>
                <h5 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                  {t('translation.title')}
                </h5>
                <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: 13 }}>
                  {t('translation.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSaveTownTranslation} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>{t('translation.nameEnLabel')}</label>
                  <input className="admin-input" style={inputStyle} type="text" name="nameEn"
                    placeholder={t('translation.nameEnPlaceholder')} value={townTranslation.nameEn} onChange={handleTownTranslationChange} />
                </div>

                <div>
                  <label style={labelStyle}>{t('translation.descriptionEnLabel')}</label>
                  <textarea className="admin-input" style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                    name="descriptionEn" placeholder={t('translation.descriptionEnPlaceholder')}
                    value={townTranslation.descriptionEn} onChange={handleTownTranslationChange} />
                </div>

                <button className="btn-submit" type="submit" disabled={!town || savingTranslation} style={{
                  padding: '11px 0',
                  background: !town ? '#9ca3af' : '#20606e',
                  color: 'white', border: 'none', borderRadius: 10,
                  fontWeight: 700, fontSize: 15,
                  cursor: !town ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}>
                  {savingTranslation ? t('loading', { ns: 'common' }) : t('translation.save')}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            {places.length === 0 ? (
              <div style={{
                background: 'white', borderRadius: 18, padding: '60px 24px',
                textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📍</div>
                <h4 style={{ color: '#374151', fontWeight: 700 }}>{t('empty.title')}</h4>
                <p style={{ color: '#9ca3af', fontSize: 15 }}>
                  {t('empty.body')}
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {places.map((place) => {
                  const cfg = CATEGORIES[place.category] || CATEGORIES.OTRO
                  const placeName = localizedField(place, 'name', i18n.language)
                  const placeDescription = localizedField(place, 'description', i18n.language)
                  return (
                    <div key={place.id} className="col-md-6">
                      <div className="place-admin-card" style={{
                        background: 'white', borderRadius: 16,
                        overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                        display: 'flex', flexDirection: 'column', height: '100%',
                      }}>
                        <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: '#f3f4f6' }}>
                          {place.imageUrl ? (
                            <img src={place.imageUrl} alt={placeName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <div style={{
                              width: '100%', height: '100%',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: `linear-gradient(135deg, ${cfg.light}, white)`,
                              fontSize: 40,
                            }}>
                              {cfg.icon}
                            </div>
                          )}
                          <div style={{ position: 'absolute', top: 10, right: 10 }}>
                            <CategoryBadge category={place.category} />
                          </div>
                        </div>

                        <div style={{ padding: '14px 16px', flex: 1 }}>
                          <h6 style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 16, color: '#111827' }}>
                            {placeName}
                          </h6>
                          {place.address && (
                            <p style={{ margin: '0 0 6px', fontSize: 12, color: '#6b7280' }}>
                              📍 {place.address}
                            </p>
                          )}
                          {placeDescription && (
                            <p style={{
                              margin: 0, fontSize: 13, color: '#4b5563',
                              display: '-webkit-box', WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                              {placeDescription}
                            </p>
                          )}
                        </div>

                        <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8 }}>
                          <button className="btn-edit" onClick={() => handleEdit(place)} style={{
                            flex: 1, padding: '8px 0', borderRadius: 8,
                            background: '#fef3c7', color: '#92400e',
                            border: '1.5px solid #fcd34d', fontSize: 13,
                            fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s',
                          }}>
                            {t('card.editButton')}
                          </button>
                          <button className="btn-delete" onClick={() => handleDelete(place.id)}
                            disabled={deletingId === place.id} style={{
                              flex: 1, padding: '8px 0', borderRadius: 8,
                              background: deletingId === place.id ? '#f9a8a8' : '#fee2e2',
                              color: '#991b1b', border: '1.5px solid #fca5a5', fontSize: 13,
                              fontWeight: 600, cursor: deletingId === place.id ? 'not-allowed' : 'pointer',
                              transition: 'background 0.2s',
                            }}>
                            {deletingId === place.id ? t('loading', { ns: 'common' }) : t('card.deleteButton')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}