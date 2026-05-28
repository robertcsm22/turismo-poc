export default function PlaceCard({ place, categoryInfo }) {
  const fallbackImg = `https://placehold.co/400x250/e2e8f0/4a5568?text=${encodeURIComponent(place.name)}`

  return (
    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: 12, overflow: 'hidden' }}>
      <img
        src={place.imageUrl || fallbackImg}
        alt={place.name}
        className="card-img-top"
        style={{ height: 200, objectFit: 'cover' }}
        onError={(e) => { e.target.src = fallbackImg }}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className={`badge bg-${categoryInfo?.color || 'secondary'}`}>
            {categoryInfo?.emoji} {categoryInfo?.label || place.category}
          </span>
        </div>
        <h5 className="card-title fw-bold mb-1">{place.name}</h5>
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
