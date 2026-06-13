import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DestinationsPage from '../pages/DestinationsPage'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

const useAuthMock = vi.fn()
vi.mock('../context/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}))

vi.mock('../components/TravelTransition', () => ({
  default: ({ destinationName, onComplete }) => (
    <div data-testid="travel-transition">
      <span>Transition to {destinationName}</span>
      <button onClick={onComplete}>complete-transition</button>
    </div>
  ),
}))

const renderPage = () =>
  render(
    <MemoryRouter>
      <DestinationsPage />
    </MemoryRouter>
  )

describe('DestinationsPage', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    useAuthMock.mockReturnValue({
      user: { name: 'Test User', role: 'USER' },
      logout: vi.fn(),
    })
  })

  it('renders the navbar brand and destination grid with expected names', () => {
    renderPage()
    expect(screen.getByText('Turismo Local')).toBeInTheDocument()
    expect(screen.getByText('Playa Santa Teresa')).toBeInTheDocument()
    expect(screen.getByText('Playa Tamarindo')).toBeInTheDocument()
    expect(screen.getByText('Playa Manuel Antonio')).toBeInTheDocument()
    expect(screen.getByText('Playa Jacó')).toBeInTheDocument()
    expect(screen.getByText('Playa Conchal')).toBeInTheDocument()
  })

  it('renders the hero carousel with title and description', () => {
    renderPage()
    expect(screen.getByText('Sistema Local de Turismo de Costa Rica')).toBeInTheDocument()
    expect(screen.getByText(/Seleccioná uno de los destinos/)).toBeInTheDocument()
  })

  it('renders explore buttons for each destination card', () => {
    renderPage()
    const exploreButtons = screen.getAllByText('Explorar destino →')
    expect(exploreButtons.length).toBe(5)
  })

  it('clicking a destination triggers the travel transition with the correct name', () => {
    renderPage()
    const card = screen.getByText('Playa Tamarindo').closest('.card')
    act(() => {
      card.click()
    })

    expect(screen.getByTestId('travel-transition')).toBeInTheDocument()
    expect(screen.getByText('Transition to Playa Tamarindo')).toBeInTheDocument()
  })

  it('completing the transition navigates to the destination slug', () => {
    renderPage()
    const card = screen.getByText('Playa Conchal').closest('.card')
    act(() => {
      card.click()
    })

    act(() => {
      screen.getByText('complete-transition').click()
    })

    expect(navigateMock).toHaveBeenCalledWith('/lugares/conchal')
  })

  it('shows the admin dashboard button only for ADMIN users', () => {
    useAuthMock.mockReturnValue({
      user: { name: 'Admin User', role: 'ADMIN' },
      logout: vi.fn(),
    })
    renderPage()
    expect(screen.getByText('📊 Dashboard')).toBeInTheDocument()
  })

  it('does not show the admin dashboard button for regular users', () => {
    useAuthMock.mockReturnValue({
      user: { name: 'Regular User', role: 'USER' },
      logout: vi.fn(),
    })
    renderPage()
    expect(screen.queryByText('📊 Dashboard')).not.toBeInTheDocument()
  })

  it('clicking the admin dashboard button navigates to admin page', () => {
    useAuthMock.mockReturnValue({
      user: { name: 'Admin User', role: 'ADMIN' },
      logout: vi.fn(),
    })
    renderPage()

    act(() => {
      screen.getByText('📊 Dashboard').click()
    })

    expect(navigateMock).toHaveBeenCalledWith('/admin/lugares/santa-teresa')
  })

  it('clicking logout calls logout and navigates to /login', () => {
    const logoutMock = vi.fn()
    useAuthMock.mockReturnValue({
      user: { name: 'Test User', role: 'USER' },
      logout: logoutMock,
    })
    renderPage()

    act(() => {
      screen.getByText('Salir').click()
    })

    expect(logoutMock).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/login', { replace: true })
  })

  it('shows the user profile picture when available', () => {
    useAuthMock.mockReturnValue({
      user: { name: 'Pic User', role: 'USER', pictureUrl: 'https://example.com/pic.jpg' },
      logout: vi.fn(),
    })
    renderPage()
    expect(screen.getByAltText('Pic User')).toBeInTheDocument()
  })
})
