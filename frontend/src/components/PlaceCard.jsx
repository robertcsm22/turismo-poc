import { useTranslation } from 'react-i18next'

export default function PlaceCard({ place, categoryInfo, categoryLabel, onSelect, isSelected }) {
  const { t } = useTranslation('places')

  const fallbackImg = `https://placehold.co/600x400/${
    (categoryInfo?.bg || '#2F7C91').replace('#', '')
  }/ffffff?text=${encodeURIComponent(place.name)}`

  return (
    <div
      className="place-card"
      style={{
        background: 'white', borderRadius: 18,
        overflow: 'hidden', height: '100%',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        cursor: 'default',
        border: isSelected ? '2px solid #F7A640' : '2px solid transparent',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={place.imageUrl || fallbackImg}
          alt={place.name}
          className="place-card-image"
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }}
          onError={(e) => { e.target.src = fallbackImg }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)',
          pointerEvents: 'none',
        }} />

        {/* Category badge */}
        {categoryInfo && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: categoryInfo.bg, color: 'white',
            padding: '4px 12px', borderRadius: 20,
            fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            {categoryInfo.emoji} {categoryLabel || categoryInfo.label}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h5 style={{
          margin: 0, fontWeight: 800, fontSize: 18,
          color: '#111827', lineHeight: 1.3,
        }}>
          {place.name}
        </h5>

        {place.description && (
          <p style={{
            margin: 0, fontSize: 14, color: '#6b7280', lineHeight: 1.6,
            flex: 1,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {place.description}
          </p>
        )}

        {place.address && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginTop: 4,
          }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <span style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.4 }}>
              {place.address}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onSelect}
          style={{
            marginTop: 10,
            alignSelf: 'flex-start',
            background: isSelected ? '#F7A640' : '#123C3A',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            padding: '8px 13px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s, transform 0.2s',
          }}
        >
          {isSelected ? t('closeReviews') : t('viewReviews')}
        </button>
      </div>

      {/* Bottom accent */}
      <div style={{
        height: 4, flexShrink: 0,
        background: categoryInfo
          ? `linear-gradient(90deg, ${categoryInfo.bg}, ${categoryInfo.bg}88)`
          : 'linear-gradient(90deg, #20606e, #2F7C91)',
      }} />
    </div>
  )
}
