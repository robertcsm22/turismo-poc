import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // sessionStorage se borra al cerrar el navegador → no hay auto-login en sesión nueva
    const savedToken = sessionStorage.getItem('jwt_token')
    const savedUser  = sessionStorage.getItem('user_data')

    if (savedToken && savedUser && !isTokenExpired(savedToken)) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    } else {
      sessionStorage.removeItem('jwt_token')
      sessionStorage.removeItem('user_data')
    }

    // Limpia restos de la versión anterior que usaba localStorage
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_data')

    setLoading(false)
  }, [])

  const login = (authResponse) => {
    setToken(authResponse.token)
    setUser(authResponse.user)
    sessionStorage.setItem('jwt_token', authResponse.token)
    sessionStorage.setItem('user_data', JSON.stringify(authResponse.user))
  }

  const logout = () => {
    const email = user?.email || ''
    setToken(null)
    setUser(null)
    sessionStorage.removeItem('jwt_token')
    sessionStorage.removeItem('user_data')
    if (window.google) {
      try {
        window.google.accounts.id.disableAutoSelect()
        window.google.accounts.id.revoke(email, () => {})
      } catch (e) {}
    }
  }

  const isAuthenticated = () => !!token && !!user && !isTokenExpired(token)

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
