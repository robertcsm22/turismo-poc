import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const PLANE_URL  = 'https://i.imgur.com/3BGEqFQ.png'
const CLOUD_URL  = 'https://i.imgur.com/6tncGeG.png'

/* Nubes: altura, posición vertical, duración, delay negativo para escalonarlas */
const CLOUDS = [
  { h: 100, top: 18,  dur: '7s',   delay: '0s'    },
  { h: 70,  top: 38,  dur: '10s',  delay: '-3.5s' },
  { h: 88,  top: 10,  dur: '8.5s', delay: '-6s'   },
  { h: 55,  top: 55,  dur: '6.5s', delay: '-1.8s' },
  { h: 36,  top: 80,  dur: '12s',  delay: '-8s'   },
]

export default function TravelTransition({ destinationName, onComplete }) {
  const { t } = useTranslation('transition')

  useEffect(() => {
    const t = setTimeout(onComplete, 4000)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden',
      animation: 'tt-sky 4s linear forwards',
    }}>
      <style>{`
        /* ── Cielo: día → noche → día ── */
        @keyframes tt-sky {
          0%   { background-color: #69D2E7; }
          5%   { background-color: #69D2E7; }
          28%  { background-color: #1D2F41; }
          72%  { background-color: #1D2F41; }
          95%  { background-color: #69D2E7; }
          100% { background-color: #69D2E7; }
        }

        /* ── Sol ── */
        @keyframes tt-sun {
          0%   { transform: translateY(0); }
          12%  { transform: translateY(0); }
          32%  { transform: translateY(115vh); }
          72%  { transform: translateY(115vh); }
          92%  { transform: translateY(0); }
          100% { transform: translateY(0); }
        }

        /* ── Luna ── */
        @keyframes tt-moon {
          0%   { transform: translateY(115vh); }
          28%  { transform: translateY(0); }
          72%  { transform: translateY(0); }
          92%  { transform: translateY(115vh); }
          100% { transform: translateY(115vh); }
        }

        /* ── Nubes de derecha a izquierda ── */
        @keyframes tt-cloud {
          from { transform: translateX(115vw); }
          to   { transform: translateX(-400px); }
        }

        /* ── Avión: cabeceo suave ── */
        @keyframes tt-bob {
          0%,100% { transform: translateY(0px);   }
          30%     { transform: translateY(-14px);  }
          70%     { transform: translateY(10px);   }
        }

        /* ── Texto aparece ── */
        @keyframes tt-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        /* ── Puntitos de carga ── */
        @keyframes tt-dot {
          0%,80%,100% { transform: scale(0.5); opacity: 0.35; }
          40%         { transform: scale(1.2); opacity: 1;    }
        }
      `}</style>

      {/* ── Sol ── */}
      <div style={{
        position: 'absolute',
        width: 80, height: 80, borderRadius: '50%',
        background: '#f1c40f',
        top: 20, left: 300,
        boxShadow: '0 0 180px 2px #FFFF75',
        animation: 'tt-sun 4s linear forwards',
        zIndex: 1,
      }}/>

      {/* ── Luna ── */}
      <div style={{
        position: 'absolute',
        width: 70, height: 70, borderRadius: '50%',
        background: '#F1EFA5',
        top: 20, right: 220,
        boxShadow: '0 0 110px 2px #FFFFE7',
        animation: 'tt-moon 4s linear forwards',
        zIndex: 1,
      }}/>

      {/* ── Nubes ── */}
      {CLOUDS.map((c, i) => (
        <img
          key={i}
          src={CLOUD_URL}
          alt=""
          style={{
            position: 'absolute',
            height: c.h,
            top: c.top,
            left: 0,
            zIndex: 2,
            pointerEvents: 'none',
            animation: `tt-cloud ${c.dur} ${c.delay} linear infinite`,
          }}
        />
      ))}

      {/* ── Avión centrado con cabeceo ── */}
      <div style={{
        position: 'absolute',
        top: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3,
        pointerEvents: 'none',
      }}>
        <div style={{ animation: 'tt-bob 2.8s ease-in-out infinite' }}>
          <img
            src={PLANE_URL}
            alt="avión"
            style={{
              height: 90,
              display: 'block',
              transform: 'scaleX(-1)',
              filter: 'drop-shadow(0 8px 22px rgba(0,0,0,0.35))',
            }}
          />
        </div>
      </div>

      {/* ── Degradado oscuro inferior para legibilidad del texto ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
        zIndex: 4,
        pointerEvents: 'none',
      }}/>

      {/* ── Texto ── */}
      <div style={{
        position: 'absolute', bottom: '9%', left: 0, right: 0,
        textAlign: 'center',
        animation: 'tt-in 0.9s ease 0.5s both',
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.92)', fontSize: 11, margin: '0 0 8px',
          letterSpacing: 7, fontWeight: 700, textTransform: 'uppercase',
          textShadow: '0 1px 10px rgba(0,0,0,0.5)',
        }}>
          ✈ &nbsp;{t('travelingTo', 'Viajando a')}
        </p>
        <h2 style={{
          color: 'white', fontSize: 40, fontWeight: 800,
          margin: '0 0 5px',
          textShadow: '0 3px 30px rgba(0,0,0,0.6)',
          letterSpacing: '-0.5px',
        }}>
          {destinationName}
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.65)', fontSize: 13,
          margin: '0 0 22px', letterSpacing: 3,
        }}>
          {t('country', 'Costa Rica')}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7 }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'rgba(255,255,255,0.8)',
              animation: `tt-dot 1.3s ${delay}s ease-in-out infinite`,
            }}/>
          ))}
        </div>
      </div>
    </div>
  )
}
