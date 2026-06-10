import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DestinationsPage from './pages/DestinationsPage'
import PlacesPage from './pages/PlacesPage'
import ErrorPage from './pages/ErrorPage'
import AdminPlacesPage from './pages/AdminPlacesPage'
import QRPage from './pages/QRPage'


function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" />
      </div>
    )
  }

  return isAuthenticated()
    ? children
    : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" />
      </div>
    )
  }

  return user?.role === 'ADMIN'
    ? children
    : <Navigate to="/error" replace />
}

function AppRoutes() {
  return (
    <Routes>

      {/* Al escanear el QR */}
      <Route path="/p/:townSlug" element={<LoginPage />} />

      {/* Login con y sin slug */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/:townSlug" element={<LoginPage />} />

      {/* Lugares */}
      <Route
        path="/lugares/:townSlug"
        element={
          <PrivateRoute>
            <PlacesPage />
          </PrivateRoute>
        }
      />

      {/* Administración */}
      <Route
        path="/admin/lugares/:townSlug"
        element={
          <AdminRoute>
            <AdminPlacesPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/lugares"
        element={
          <AdminRoute>
            <AdminPlacesPage />
          </AdminRoute>
        }
      />

      {/* QR */}
      <Route path="/qr/:townSlug" element={<QRPage />} />

      {/* Error */}
      <Route path="/error" element={<ErrorPage />} />

      {/* Selector de destinos (protegido) */}
      <Route
        path="/destinos"
        element={
          <PrivateRoute>
            <DestinationsPage />
          </PrivateRoute>
        }
      />

      {/* Inicio */}
      <Route path="/" element={<LoginPage />} />

      {/* 404 */}
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