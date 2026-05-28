import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ town, user }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark"
         style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <span className="navbar-brand fw-bold">
          🌴 {town?.name || 'Turismo Local'}
        </span>

        {user && (
          <div className="d-flex align-items-center gap-3">
            {user.pictureUrl && (
              <img
                src={user.pictureUrl}
                alt={user.name}
                className="rounded-circle"
                width={36}
                height={36}
                referrerPolicy="no-referrer"
              />
            )}
            <span className="text-white d-none d-md-block small">{user.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
