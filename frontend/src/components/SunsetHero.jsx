import { useEffect, useRef } from 'react'
import '../styles/SunsetHero.css'

const BIRDS = [
  [-200,-60,7500,-8000], [80,-90,9000,-3000], [-60,40,6000,-12000],
  [120,-30,11000,-5000], [-150,10,8000,-9000], [30,-70,7000,-2000],
  [-80,60,10000,-6000], [160,-50,6500,-14000], [-20,30,9500,-4000],
  [50,-100,8500,-7000], [-130,-20,7200,-11000], [90,50,10500,-3500],
  [-40,-80,6800,-8500], [140,20,9200,-5500], [-90,70,7800,-10000],
  [-170,-40,8200,-13000], [70,-60,11500,-2500], [110,40,6200,-9500],
  [-50,90,10000,-7500], [30,-15,8800,-4500]
]

export default function SunsetHero({ town }) {
  const birdsRef = useRef(null)

  useEffect(() => {
    const layer = birdsRef.current
    if (!layer) return
    layer.innerHTML = ''
    BIRDS.forEach(([tx, ty, dur, delay]) => {
      const bp = document.createElement('div')
      bp.className = 'sh-birdpos'
      bp.style.transform = `translate(${tx}px, ${ty}px)`
      const b = document.createElement('div')
      b.className = 'sh-bird'
      b.style.cssText = `animation-duration:${dur}ms; animation-delay:${delay}ms`
      ;['sh-wing sh-wing-l', 'sh-wing sh-wing-r'].forEach(cls => {
        const w = document.createElement('div')
        w.className = cls
        w.style.animationDelay = `${delay}ms`
        b.appendChild(w)
      })
      bp.appendChild(b)
      layer.appendChild(bp)
    })
  }, [])

  return (
    <div className="sh-hero">
      <div className="sh-sky" />
      <div className="sh-horizon-glow" />
      <div className="sh-sun" />
      <div className="sh-sea"><div className="sh-sea-shine" /></div>
      <div className="sh-waves">
        {[...Array(6)].map((_, i) => <div key={i} className="sh-wave" />)}
      </div>
      <div className="sh-birds" ref={birdsRef} />
      <div className="sh-overlay">
        <p className="sh-tag">Turismo Local · {town?.province ?? 'Costa Rica'}</p>
        <h1 className="sh-title">{town?.name ?? 'Turismo Local'}</h1>
        {town?.description && <p className="sh-sub">{town.description}</p>}
      </div>
    </div>
  )
}