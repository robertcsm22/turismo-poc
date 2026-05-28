import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center p-4">
        <div style={{ fontSize: 80 }}>🗺️</div>
        <h1 className="display-4 fw-bold text-danger mt-3">404</h1>
        <h2 className="h4 text-dark">Destino no encontrado</h2>
        <p className="text-muted mt-3 mb-4">
          El código QR puede ser inválido, el pueblo no existe en nuestra base de datos,
          o el enlace ha expirado.
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/login')}>
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}
