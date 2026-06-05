export default function PlaceCard({ place, categoryInfo }) {
  const fallbackImg = `https://placehold.co/400x250/e2e8f0/4a5568?text=${encodeURIComponent(place.name)}`

  return (
    <div className="card place-card h-100 shadow-sm border-0" style={{ borderRadius: 12, overflow: 'hidden', borderTop: '4px solid var(--color-naranja)', background: 'var(--color-crema)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}>
      <img
        src={place.imageUrl || fallbackImg}
        alt={place.name}
        className="card-img-top place-card-image"
        style={{ height: 200, objectFit: 'cover', transition: 'transform 0.25s ease' }}
        onError={(e) => { e.target.src = fallbackImg }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge" style={{ background: 'var(--color-azul-oceano)', color: 'var(--color-crema)' }}>
            {categoryInfo?.emoji} {categoryInfo?.label || place.category}
          </span>
        </div>
        <h5 className="card-title fw-bold mb-1" style={{ color: 'var(--color-verde-oscuro)' }}>{place.name}</h5>
        <p className="card-text text-muted small flex-grow-1">{place.description}</p>
        {place.address && (
          <p className="card-text mt-2">
            <small className="text-muted">
              <span className="me-1">📍</span>{place.address}
            </small>
          </p>
        )}
      </div>
    </div>
  )
}
