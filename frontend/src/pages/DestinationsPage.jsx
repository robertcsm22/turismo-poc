import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Logo de Santa Tereza.png'
import TravelTransition from '../components/TravelTransition'
import LanguageSwitcher from '../components/LanguageSwitcher'

// Imágenes de las playas del proyecto (Unsplash)
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1535262412227-85541e910204?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1521292270410-a8c4d716d518?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1583212292454-39e0e2c9a5c6?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1600&q=80',
]

function HeroCarousel() {
  const { t } = useTranslation('destinations')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ position: 'relative', height: 460, overflow: 'hidden' }}>
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          onError={(e) => { e.target.style.display = 'none' }}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: i === index ? 1 : 0,
            transition: 'opacity 1.8s ease',
          }}
        />
      ))}

      {/* Overlay para legibilidad */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(15,32,39,0.55) 0%, rgba(15,32,39,0.55) 40%, rgba(15,32,39,0.92) 100%)',
      }} />

      {/* Texto */}
      <div className="text-center px-3" style={{
        position: 'relative', zIndex: 2,
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 56 }}>🌴</div>
        <h1 className="fw-bold text-white mt-3" style={{ fontSize: '2.4rem', letterSpacing: '-0.5px', textShadow: '0 2px 18px rgba(0,0,0,0.5)' }}>
          {t('hero.title')}
        </h1>
        <p className="text-white-50 mt-3" style={{ fontSize: '1.05rem', maxWidth: 720, margin: '8px auto 0', lineHeight: 1.7 }}>
          {t('hero.description')}
        </p>
        <p className="text-white-50 mt-2" style={{ fontSize: '0.9rem', maxWidth: 600, opacity: 0.8 }}>
          {t('hero.cta')}
        </p>
      </div>
    </div>
  )
}

const DESTINATIONS = [
  {
    slug: 'santa-teresa',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    slug: 'tamarindo',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    slug: 'manuel-antonio',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    slug: 'jaco',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    slug: 'conchal',
    image: 'https://images.unsplash.com/photo-1535262412227-85541e910204?auto=format&fit=crop&w=800&q=80',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
]

export default function DestinationsPage() {
  const { t } = useTranslation('destinations')
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [traveling, setTraveling] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (traveling) {
    return (
      <TravelTransition
        destinationName={t(`places.${traveling.slug}.name`)}
        onComplete={() => navigate(`/lugares/${traveling.slug}`)}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}>

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(13,43,42,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={logo} alt="Logo" style={{ height: 38, width: 'auto' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{t('navbar.brand')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user?.pictureUrl && (
            <img src={user.pictureUrl} alt={user.name} referrerPolicy="no-referrer"
              style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />
          )}
          {user?.name && (
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, display: 'none' }}
              className="d-md-inline">{user.name}</span>
          )}
          <LanguageSwitcher />
          {user?.role === 'ADMIN' && (
            <button onClick={() => navigate('/admin/lugares/santa-teresa')} style={{
              background: 'rgba(247,166,64,0.15)', color: '#F7A640',
              border: '1.5px solid rgba(247,166,64,0.5)', padding: '6px 16px',
              borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(247,166,64,0.28)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(247,166,64,0.15)' }}
            >
              {t('navbar.dashboard')}
            </button>
          )}
          <button onClick={handleLogout} style={{
            background: 'transparent', color: 'rgba(255,255,255,0.8)',
            border: '1.5px solid rgba(255,255,255,0.3)', padding: '6px 16px',
            borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#F7A640'; e.currentTarget.style.color = '#F7A640' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
          >
            {t('navbar.logout')}
          </button>
        </div>
      </nav>

      {/* Hero carrusel */}
      <HeroCarousel />

      {/* Cards grid */}
      <div className="container pb-5">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
          {DESTINATIONS.map((dest) => (
            <div className="col" key={dest.slug} style={{ maxWidth: 380 }}>
              <div
                className="card h-100 border-0 shadow-lg"
                style={{
                  borderRadius: 20,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transform: 'translateY(0)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onClick={() => setTraveling(dest)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                {/* Banner con foto */}
                <div
                  style={{
                    height: 140,
                    background: dest.gradient,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={dest.image}
                    alt={t(`places.${dest.slug}.name`)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Contenido */}
                <div className="card-body p-4">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold mb-1" style={{ color: '#1a202c' }}>
                        {t(`places.${dest.slug}.name`)}
                      </h5>
                      <span className="badge bg-light text-secondary mb-2" style={{ fontSize: '0.75rem' }}>
                        📍 {t(`places.${dest.slug}.province`)}
                      </span>
                    </div>
                  </div>
                  <p className="card-text text-muted small">{t(`places.${dest.slug}.description`)}</p>
                  <button
                    className="btn btn-sm w-100 mt-2 fw-semibold text-white"
                    style={{ background: dest.gradient, border: 'none', borderRadius: 10 }}
                  >
                    {t('card.explore')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
