import { useNavigate } from 'react-router-dom'

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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' }}>
      {/* Header */}
      <div className="text-center py-5 px-3">
        <div style={{ fontSize: 56 }}>🌴</div>
        <h1 className="fw-bold text-white mt-3" style={{ fontSize: '2.2rem', letterSpacing: '-0.5px' }}>
          Turismo Costa Rica
        </h1>
        <p className="text-white-50 mt-2" style={{ fontSize: '1.05rem', maxWidth: 480, margin: '0 auto' }}>
          Selecciona tu destino y descubre los mejores lugares de cada playa
        </p>
      </div>

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
                onClick={() => navigate(`/viajando/${dest.slug}`, { state: { name: dest.name } })}
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
