import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import PlacesPage from './pages/PlacesPage'
import ErrorPage from './pages/ErrorPage'
import AdminPlacesPage from './pages/AdminPlacesPage'


function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border" /></div>
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Al escanear el QR: /p/santa-teresa */}
      <Route path="/p/:townSlug" element={<LoginPage />} />

      {/* Lista de lugares (protegida) */}
      <Route
        path="/lugares/:townSlug"
        element={
          <PrivateRoute>
            <PlacesPage />
          </PrivateRoute>
        }
      />

      {/* Login genérico */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/lugares" element={<AdminPlacesPage />} />

      {/* Error 404 */}
      <Route path="/error" element={<ErrorPage />} />

      {/* Ruta raíz */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
