import { render, screen, act, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import LoginPage from '../pages/LoginPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockLogin = vi.fn()
let mockIsAuthenticated = vi.fn(() => false)
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: mockIsAuthenticated,
    user: null,
    logout: vi.fn(),
    loading: false,
  }),
}))

vi.mock('../services/api', () => ({
  authService: {
    loginWithGoogle: vi.fn(),
  },
  townService: {
    getTown: vi.fn(),
  },
}))

import { authService, townService } from '../services/api'

function renderLogin(initialPath = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login/:townSlug" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    mockLogin.mockReset()
    mockIsAuthenticated = vi.fn(() => false)
    townService.getTown.mockReset()
    authService.loginWithGoogle.mockReset()

    window.google = {
      accounts: {
        id: {
          initialize: vi.fn(),
          renderButton: vi.fn(),
          cancel: vi.fn(),
        },
      },
    }
  })

  afterEach(() => {
    delete window.google
    vi.useRealTimers()
  })

  it('renders without crashing showing default title when no town', async () => {
    renderLogin('/login')

    expect(await screen.findByText('Turismo Local')).toBeInTheDocument()
    expect(screen.getByText('Inicia sesión con tu cuenta Gmail para explorar lugares turísticos.')).toBeInTheDocument()
    expect(screen.getByText('📷 Solo se aceptan cuentas @gmail.com')).toBeInTheDocument()
    expect(screen.getByText('Ver código QR del destino')).toBeInTheDocument()
  })

  it('loads and renders the town name and province when townSlug is provided', async () => {
    townService.getTown.mockResolvedValue({ name: 'Santa Teresa', province: 'Puntarenas' })

    renderLogin('/login/santa-teresa')

    expect(await screen.findByText('Santa Teresa')).toBeInTheDocument()
    expect(await screen.findByText('Puntarenas, Costa Rica')).toBeInTheDocument()
    expect(screen.getByText('Descubre los mejores lugares de Santa Teresa. Inicia sesión con tu cuenta Gmail para continuar.')).toBeInTheDocument()
  })

  it('navigates to /error when town lookup fails', async () => {
    townService.getTown.mockRejectedValue(new Error('not found'))

    renderLogin('/login/unknown-town')

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/error'))
  })

  it('redirects authenticated users to /destinos (no townSlug)', async () => {
    mockIsAuthenticated = vi.fn(() => true)

    renderLogin('/login')

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/destinos', { replace: true })
    )
  })

  it('redirects authenticated users to /lugares/:townSlug when townSlug present', async () => {
    mockIsAuthenticated = vi.fn(() => true)
    townService.getTown.mockResolvedValue({ name: 'Santa Teresa' })

    renderLogin('/login/santa-teresa')

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/lugares/santa-teresa', { replace: true })
    )
  })

  it('handles a successful Google login callback', async () => {
    authService.loginWithGoogle.mockResolvedValue({ token: 'jwt', user: { email: 'a@gmail.com' } })

    renderLogin('/login')

    await waitFor(() => expect(window.google.accounts.id.initialize).toHaveBeenCalled())

    const initializeCall = window.google.accounts.id.initialize.mock.calls[0][0]
    expect(initializeCall.client_id).toBeDefined
    const callback = initializeCall.callback

    await act(async () => {
      await callback({ credential: 'fake-id-token' })
    })

    expect(authService.loginWithGoogle).toHaveBeenCalledWith('fake-id-token')
    expect(mockLogin).toHaveBeenCalledWith({ token: 'jwt', user: { email: 'a@gmail.com' } })
    expect(mockNavigate).toHaveBeenCalledWith('/destinos')
  })

  it('handles a successful Google login callback with townSlug', async () => {
    townService.getTown.mockResolvedValue({ name: 'Santa Teresa' })
    authService.loginWithGoogle.mockResolvedValue({ token: 'jwt', user: { email: 'a@gmail.com' } })

    renderLogin('/login/santa-teresa')

    await waitFor(() => expect(window.google.accounts.id.initialize).toHaveBeenCalled())
    const callback = window.google.accounts.id.initialize.mock.calls[0][0].callback

    await act(async () => {
      await callback({ credential: 'fake-id-token' })
    })

    expect(mockNavigate).toHaveBeenCalledWith('/lugares/santa-teresa')
  })

  it('shows an error message when Google login fails with a server message', async () => {
    authService.loginWithGoogle.mockRejectedValue({
      response: { data: { message: 'Cuenta no permitida' } },
    })

    renderLogin('/login')

    await waitFor(() => expect(window.google.accounts.id.initialize).toHaveBeenCalled())
    const callback = window.google.accounts.id.initialize.mock.calls[0][0].callback

    await act(async () => {
      await callback({ credential: 'bad-token' })
    })

    expect(await screen.findByText('Cuenta no permitida')).toBeInTheDocument()
  })

  it('shows the default error message when Google login fails without a server message', async () => {
    authService.loginWithGoogle.mockRejectedValue(new Error('network error'))

    renderLogin('/login')

    await waitFor(() => expect(window.google.accounts.id.initialize).toHaveBeenCalled())
    const callback = window.google.accounts.id.initialize.mock.calls[0][0].callback

    await act(async () => {
      await callback({ credential: 'bad-token' })
    })

    expect(await screen.findByText('Error al iniciar sesión. Intenta de nuevo.')).toBeInTheDocument()
  })
})
