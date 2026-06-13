import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ErrorPage() {
  const { t } = useTranslation(['error', 'common'])
  const navigate = useNavigate()

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center p-4">
        <div style={{ fontSize: 80 }}>🗺️</div>
        <h1 className="display-4 fw-bold text-danger mt-3">404</h1>
        <h2 className="h4 text-dark">{t('title')}</h2>
        <p className="text-muted mt-3 mb-4">
          {t('description')}
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            ← {t('buttons.back', { ns: 'common' })}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/login')}>
            {t('goHome')}
          </button>
        </div>
      </div>
    </div>
  )
}
