import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

// Mock all page components with simple placeholders
vi.mock('../pages/LoginPage', () => ({ default: () => <div>LoginPage</div> }))
vi.mock('../pages/DestinationsPage', () => ({ default: () => <div>DestinationsPage</div> }))
vi.mock('../pages/PlacesPage', () => ({ default: () => <div>PlacesPage</div> }))
vi.mock('../pages/ErrorPage', () => ({ default: () => <div>ErrorPage</div> }))
vi.mock('../pages/AdminPlacesPage', () => ({ default: () => <div>AdminPlacesPage</div> }))
vi.mock('../pages/QRPage', () => ({ default: () => <div>QRPage</div> }))

// Mock AuthContext: AuthProvider is a passthrough, useAuth is controllable per test
const mockUseAuth = vi.fn()

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockUseAuth(),
}))

const renderApp = (initialEntries) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  )

describe('App routing', () => {
  it('shows a spinner while loading (PrivateRoute)', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => false, loading: true, user: null })
    const { container } = renderApp(['/lugares/santa-teresa'])
    expect(container.querySelector('.spinner-border')).toBeInTheDocument()
  })

  it('PrivateRoute redirects to /login when not authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => false, loading: false, user: null })
    renderApp(['/lugares/santa-teresa'])
    expect(screen.getByText('LoginPage')).toBeInTheDocument()
  })

  it('PrivateRoute renders children when authenticated', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => true, loading: false, user: { role: 'USER' } })
    renderApp(['/lugares/santa-teresa'])
    expect(screen.getByText('PlacesPage')).toBeInTheDocument()
  })

  it('AdminRoute redirects to /error when user is not ADMIN', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => true, loading: false, user: { role: 'USER' } })
    renderApp(['/admin/lugares/santa-teresa'])
    expect(screen.getByText('ErrorPage')).toBeInTheDocument()
  })

  it('AdminRoute renders children when user is ADMIN', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => true, loading: false, user: { role: 'ADMIN' } })
    renderApp(['/admin/lugares/santa-teresa'])
    expect(screen.getByText('AdminPlacesPage')).toBeInTheDocument()
  })

  it('AdminRoute shows spinner while loading', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => false, loading: true, user: null })
    const { container } = renderApp(['/admin/lugares'])
    expect(container.querySelector('.spinner-border')).toBeInTheDocument()
  })

  it('renders LoginPage at /login', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => false, loading: false, user: null })
    renderApp(['/login'])
    expect(screen.getByText('LoginPage')).toBeInTheDocument()
  })

  it('renders LoginPage at /', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => false, loading: false, user: null })
    renderApp(['/'])
    expect(screen.getByText('LoginPage')).toBeInTheDocument()
  })

  it('renders QRPage at /qr/:townSlug', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => false, loading: false, user: null })
    renderApp(['/qr/santa-teresa'])
    expect(screen.getByText('QRPage')).toBeInTheDocument()
  })

  it('renders ErrorPage at unknown path', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => false, loading: false, user: null })
    renderApp(['/some/unknown/path'])
    expect(screen.getByText('ErrorPage')).toBeInTheDocument()
  })

  it('DestinationsPage renders for authenticated user at /destinos', () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: () => true, loading: false, user: { role: 'USER' } })
    renderApp(['/destinos'])
    expect(screen.getByText('DestinationsPage')).toBeInTheDocument()
  })
})
