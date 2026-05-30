import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('jwt_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [token])

  const login = (authResponse) => {
    setToken(authResponse.token)
    setUser(authResponse.user)
    localStorage.setItem('jwt_token', authResponse.token)
    localStorage.setItem('user_data', JSON.stringify(authResponse.user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_data')
    if (window.google) {
      window.google.accounts.id.disableAutoSelect()
      window.google.accounts.id.revoke(localStorage.getItem('user_email') || '', () => {})
    }
  }

  const isAuthenticated = () => !!token && !!user

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