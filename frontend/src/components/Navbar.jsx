import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/Logo de Santa Tereza.png'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar({ town, user }) {
  const { t } = useTranslation('navbar')
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
          {town?.name || t('defaultTitle')}
        </span>

        {!user && (
          <div className="d-flex align-items-center gap-3">
            <LanguageSwitcher />
          </div>
        )}

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
                to={`/admin/lugares/${town?.slug || 'santa-teresa'}`}
                className="btn btn-warning btn-sm"
             >
                {t('admin')}
               </Link>
              )}
            <button
              className="btn btn-sm"
              onClick={() => navigate('/destinos')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1.5px solid rgba(255,255,255,0.35)',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.28)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
            >
              {t('destinations')}
            </button>
            <LanguageSwitcher />
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              {t('logout')}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
