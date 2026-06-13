import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { placeService, townService } from '../services/api'
import Navbar from '../components/Navbar'

function StatCard({ icon, title, children }) {
  return (
    <div style={{
      background: 'white', borderRadius: 18, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)', height: '100%',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #20606e, #123C3A)',
        padding: '16px 20px', color: 'white',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h6 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{title}</h6>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {children}
      </div>
    </div>
  )
}

export default function AdminStatsPage() {
  const { t } = useTranslation(['admin', 'common'])
  const { t: tDest } = useTranslation('destinations')
  const navigate = useNavigate()
  const { user } = useAuth()

  const [places, setPlaces] = useState([])
  const [towns, setTowns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([placeService.getAllPlaces(), townService.getAllTowns()])
      .then(([placesData, townsData]) => {
        setPlaces(placesData)
        setTowns(townsData)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const townName = (slug, fallback) => tDest(`places.${slug}.name`, fallback)

  const townStats = useMemo(() => {
    const counts = {}
    places.forEach(p => {
      counts[p.townSlug] = (counts[p.townSlug] || 0) + 1
    })
    return towns
      .map(town => ({ ...town, placesCount: counts[town.slug] || 0 }))
      .sort((a, b) => b.placesCount - a.placesCount)
  }, [places, towns])

  const maxTownCount = Math.max(1, ...townStats.map(t => t.placesCount))

  const ratedPlaces = useMemo(() => places.filter(p => p.reviewCount > 0), [places])

  const topRated = useMemo(() =>
    [...ratedPlaces].sort((a, b) => b.averageRating - a.averageRating).slice(0, 5),
    [ratedPlaces])

  const worstRated = useMemo(() =>
    [...ratedPlaces].sort((a, b) => a.averageRating - b.averageRating).slice(0, 5),
    [ratedPlaces])

  const mostReviewed = useMemo(() =>
    [...places].filter(p => p.reviewCount > 0).sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5),
    [places])

  const placeRow = (place, metric) => (
    <div key={place.id} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 10, padding: '8px 0', borderBottom: '1px solid #f3f4f6',
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {place.name}
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af' }}>
          📍 {townName(place.townSlug, place.townName)}
        </div>
      </div>
      <div style={{ flexShrink: 0, fontWeight: 700, fontSize: 14, color: '#20606e', whiteSpace: 'nowrap' }}>
        {metric}
      </div>
    </div>
  )

  return (
    <>
      <Navbar town={null} user={user} />

      <div style={{
        background: 'linear-gradient(135deg, #123C3A 0%, #20606e 60%, #2F7C91 100%)',
        padding: '36px 0 32px', color: 'white',
      }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button
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
                {t('stats.header.title')}
              </h1>
              <p style={{ margin: '4px 0 0', opacity: 0.75, fontSize: 14 }}>
                {t('stats.header.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 16px 60px' }}>
        {loading ? (
          <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" />
          </div>
        ) : error ? (
          <div style={{
            background: 'white', borderRadius: 18, padding: '40px 24px',
            textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', color: '#dc2626',
          }}>
            {t('stats.loadError')}
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12">
              <StatCard icon="🏘️" title={t('stats.townsByPlaces.title')}>
                {townStats.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>{t('stats.empty')}</p>
                ) : (
                  townStats.map(town => (
                    <div key={town.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: '#111827' }}>{townName(town.slug, town.name)}</span>
                        <span style={{ color: '#20606e', fontWeight: 700 }}>
                          {t('stats.townsByPlaces.placesCount', { count: town.placesCount })}
                        </span>
                      </div>
                      <div style={{ background: '#f1f5f9', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                        <div style={{
                          width: `${(town.placesCount / maxTownCount) * 100}%`,
                          background: 'linear-gradient(135deg, #20606e, #2F7C91)',
                          height: '100%', borderRadius: 8,
                        }} />
                      </div>
                    </div>
                  ))
                )}
              </StatCard>
            </div>

            <div className="col-md-6 col-lg-4">
              <StatCard icon="🌟" title={t('stats.topRated.title')}>
                {topRated.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>{t('stats.empty')}</p>
                ) : (
                  topRated.map(place => placeRow(place, `⭐ ${place.averageRating.toFixed(1)}`))
                )}
              </StatCard>
            </div>

            <div className="col-md-6 col-lg-4">
              <StatCard icon="📉" title={t('stats.worstRated.title')}>
                {worstRated.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>{t('stats.empty')}</p>
                ) : (
                  worstRated.map(place => placeRow(place, `⭐ ${place.averageRating.toFixed(1)}`))
                )}
              </StatCard>
            </div>

            <div className="col-md-6 col-lg-4">
              <StatCard icon="💬" title={t('stats.mostReviewed.title')}>
                {mostReviewed.length === 0 ? (
                  <p style={{ color: '#9ca3af', fontSize: 13, margin: 0 }}>{t('stats.empty')}</p>
                ) : (
                  mostReviewed.map(place => placeRow(place, t('stats.mostReviewed.reviewsCount', { count: place.reviewCount })))
                )}
              </StatCard>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
