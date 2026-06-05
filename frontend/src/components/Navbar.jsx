import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/Logo de Santa Tereza.png'

export default function Navbar({ town, user }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
  logout()
  navigate(town?.slug ? `/p/${town.slug}` : '/login')
}

  return (
    <nav className="navbar navbar-expand-lg navbar-dark"
         style={{ 
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           position: 'sticky',
           top: 0,
           zIndex: 1000,
           backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
           opacity: isScrolled ? 0.7 : 1,
           transition: 'all 0.3s ease'
         }}>
      <div className="container">
        <span 
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(town?.slug ? `/lugares/${town.slug}` : '/login')}
        >
          <img 
            src={logo} 
            alt="Logo" 
            style={{ height: '40px', width: 'auto' }}
          />
          {town?.name || 'Turismo Local'}
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

            {user.role === 'ADMIN' && (
             <Link
                to="/admin/lugares"
                className="btn btn-warning btn-sm"
             >
                ⚙️ Administrar
               </Link>
              )}
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
