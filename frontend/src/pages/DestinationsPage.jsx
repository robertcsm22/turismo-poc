import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Logo de Santa Tereza.png'
import TravelTransition from '../components/TravelTransition'

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
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex(i => (i + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(t)
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
          Sistema Local de Turismo de Costa Rica
        </h1>
        <p className="text-white-50 mt-3" style={{ fontSize: '1.05rem', maxWidth: 720, margin: '8px auto 0', lineHeight: 1.7 }}>
          Una plataforma pensada para acercarte lo mejor del Pacífico costarricense: desde las olas
          legendarias de Santa Teresa, Tamarindo y Jacó, hasta la naturaleza exuberante de Manuel
          Antonio y las aguas turquesas de Playa Conchal. Descubrí playas, restaurantes, hoteles,
          miradores y actividades recomendadas por la comunidad local, todo organizado por destino
          para que planifiques tu próxima aventura sin complicaciones.
        </p>
        <p className="text-white-50 mt-2" style={{ fontSize: '0.9rem', maxWidth: 600, opacity: 0.8 }}>
          Seleccioná uno de los destinos a continuación para comenzar a explorar 👇
        </p>
      </div>
    </div>
  )
}

const DESTINATIONS = [
  {
    slug: 'santa-teresa',
    name: 'Playa Santa Teresa',
    province: 'Puntarenas',
    description: 'Olas perfectas para surf y atardeceres espectaculares en la Península de Nicoya.',
    emoji: '🏄',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    slug: 'tamarindo',
    name: 'Playa Tamarindo',
    province: 'Guanacaste',
    description: 'El destino más animado de Guanacaste, famoso por el surf y la vida nocturna.',
    emoji: '🌅',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    slug: 'manuel-antonio',
    name: 'Playa Manuel Antonio',
    province: 'Puntarenas',
    description: 'Naturaleza exuberante junto al mar: monos, perezosos y aguas cristalinas.',
    emoji: '🐒',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    slug: 'jaco',
    name: 'Playa Jacó',
    province: 'Puntarenas',
    description: 'La playa más accesible desde San José, perfecta para surf y aventura.',
    emoji: '🤙',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    slug: 'conchal',
    name: 'Playa Conchal',
    province: 'Guanacaste',
    description: 'Playa única formada por millones de conchas, con aguas turquesas y tranquilas.',
    emoji: '🐚',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  },
]

export default function DestinationsPage() {
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
        destinationName={traveling.name}
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
          <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Turismo Local</span>
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
              📊 Dashboard
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
            Salir
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
                {/* Banner con gradiente */}
                <div
                  style={{
                    height: 140,
                    background: dest.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 64 }}>{dest.emoji}</span>
                </div>

                {/* Contenido */}
                <div className="card-body p-4">
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold mb-1" style={{ color: '#1a202c' }}>
                        {dest.name}
                      </h5>
                      <span className="badge bg-light text-secondary mb-2" style={{ fontSize: '0.75rem' }}>
                        📍 {dest.province}
                      </span>
                    </div>
                  </div>
                  <p className="card-text text-muted small">{dest.description}</p>
                  <button
                    className="btn btn-sm w-100 mt-2 fw-semibold text-white"
                    style={{ background: dest.gradient, border: 'none', borderRadius: 10 }}
                  >
                    Explorar destino →
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
