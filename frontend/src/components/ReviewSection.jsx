import { useEffect, useState } from 'react'
import { reviewService } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ReviewSection({ place }) {
  const { user } = useAuth()

  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const placeId = place?.id

  useEffect(() => {
    if (placeId) loadReviews()
  }, [placeId])

  const loadReviews = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await reviewService.getReviews(placeId)
      setReviews(data)
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar las reseñas.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!comment.trim() || !user?.id || saving) return

    setSaving(true)
    setError('')

    try {
      await reviewService.createReview(placeId, user.id, {
        rating,
        comment: comment.trim(),
      })

      setComment('')
      setRating(5)
      await loadReviews()
    } catch (err) {
      console.error(err)
      setError('No se pudo guardar la reseña. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  const renderStars = (value) => '★★★★★'.slice(0, value)

  const formattedDate = (value) => {
    if (!value) return ''
    return new Intl.DateTimeFormat('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))
  }

  return (
    <section
      style={{
        background: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
        border: '1px solid rgba(15,23,42,0.06)',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: '#123C3A', fontSize: 18, fontWeight: 800 }}>
            {place?.name}
          </h3>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>
            Opiniones y calificaciones de visitantes
          </p>
        </div>
        <span
          style={{
            background: '#fef3c7',
            color: '#b45309',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ padding: 20 }}>
        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: '10px 12px',
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            Cargando reseñas...
          </p>
        ) : reviews.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            Este lugar todavía no tiene reseñas. Sé el primero en compartir tu experiencia.
          </p>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {reviews.map(review => (
              <article
                key={review.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ color: '#F7A640', fontSize: 15, letterSpacing: 1 }}>
                    {renderStars(review.rating)}
                  </div>
                  {review.createdAt && (
                    <small style={{ color: '#94a3b8', fontSize: 12 }}>
                      {formattedDate(review.createdAt)}
                    </small>
                  )}
                </div>

                <p style={{ margin: '8px 0 6px', color: '#334155', fontSize: 14, lineHeight: 1.55 }}>
                  {review.comment}
                </p>

                <small style={{ color: '#64748b', fontSize: 12, fontWeight: 600 }}>
                  {review.userName || 'Visitante'}
                </small>
              </article>
            ))}
          </div>
        )}

        {user && (
          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: 18,
              paddingTop: 18,
              borderTop: '1px solid #e5e7eb',
              display: 'grid',
              gap: 12,
            }}
          >
            <div>
              <label
                htmlFor={`rating-${placeId}`}
                style={{ display: 'block', color: '#475569', fontSize: 13, fontWeight: 700, marginBottom: 6 }}
              >
                Calificación
              </label>
              <select
                id={`rating-${placeId}`}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{
                  width: '100%',
                  maxWidth: 220,
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 10,
                  padding: '9px 12px',
                  color: '#123C3A',
                  fontSize: 14,
                  background: 'white',
                }}
              >
                <option value="5">5 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="2">2 estrellas</option>
                <option value="1">1 estrella</option>
              </select>
            </div>

            <div>
              <textarea
                rows="3"
                placeholder="Escribe tu reseña..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                style={{
                  width: '100%',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '11px 12px',
                  resize: 'vertical',
                  fontSize: 14,
                  lineHeight: 1.5,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!comment.trim() || saving}
              style={{
                justifySelf: 'start',
                background: '#123C3A',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                cursor: !comment.trim() || saving ? 'not-allowed' : 'pointer',
                opacity: !comment.trim() || saving ? 0.65 : 1,
              }}
            >
              {saving ? 'Enviando...' : 'Enviar reseña'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
