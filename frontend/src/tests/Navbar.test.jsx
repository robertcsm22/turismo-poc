import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Navbar from '../components/Navbar'

const mockNavigate = vi.fn()
const mockLogout = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ logout: mockLogout }),
}))

const renderNavbar = (props) =>
  render(
    <MemoryRouter>
      <Navbar {...props} />
    </MemoryRouter>
  )

describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockLogout.mockClear()
  })

  it('renders the default title when town is undefined', () => {
    renderNavbar({})
    expect(screen.getByText('Turismo Local')).toBeInTheDocument()
  })

  it('renders the town name when provided', () => {
    renderNavbar({ town: { name: 'Santa Teresa', slug: 'santa-teresa' } })
    expect(screen.getByText('Santa Teresa')).toBeInTheDocument()
  })

  it('shows only LanguageSwitcher when user is undefined', () => {
    renderNavbar({})
    expect(screen.getByRole('group', { name: /language switcher/i })).toBeInTheDocument()
    expect(screen.queryByText('Salir')).not.toBeInTheDocument()
    expect(screen.queryByText(/Destinos/)).not.toBeInTheDocument()
  })

  describe('when user is defined', () => {
    const baseUser = { name: 'Juan Perez', email: 'juan@gmail.com', role: 'USER' }

    it('shows the user name', () => {
      renderNavbar({ user: baseUser })
      expect(screen.getByText('Juan Perez')).toBeInTheDocument()
    })

    it('shows the user picture when pictureUrl is present', () => {
      const user = { ...baseUser, pictureUrl: 'http://example.com/pic.jpg' }
      renderNavbar({ user })
      const img = screen.getByAltText('Juan Perez')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'http://example.com/pic.jpg')
    })

    it('does not show a picture when pictureUrl is absent', () => {
      renderNavbar({ user: baseUser })
      expect(screen.queryByAltText('Juan Perez')).not.toBeInTheDocument()
    })

    it('does not show Admin link when role is not ADMIN', () => {
      renderNavbar({ user: baseUser })
      expect(screen.queryByText(/Administrar/)).not.toBeInTheDocument()
    })

    it('shows Admin link when role is ADMIN', () => {
      renderNavbar({ user: { ...baseUser, role: 'ADMIN' } })
      expect(screen.getByText(/Administrar/)).toBeInTheDocument()
    })

    it('shows Destinations button, LanguageSwitcher and Logout button', () => {
      renderNavbar({ user: baseUser })
      expect(screen.getByText(/Destinos/)).toBeInTheDocument()
      expect(screen.getByRole('group', { name: /language switcher/i })).toBeInTheDocument()
      expect(screen.getByText('Salir')).toBeInTheDocument()
    })

    it('clicking Logout calls logout and navigates to /login when town has no slug', () => {
      renderNavbar({ user: baseUser })
      fireEvent.click(screen.getByText('Salir'))
      expect(mockLogout).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('clicking Logout navigates to /p/:slug when town has a slug', () => {
      renderNavbar({ user: baseUser, town: { name: 'Santa Teresa', slug: 'santa-teresa' } })
      fireEvent.click(screen.getByText('Salir'))
      expect(mockLogout).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/p/santa-teresa')
    })

    it('clicking Destinations navigates to /destinos', () => {
      renderNavbar({ user: baseUser })
      fireEvent.click(screen.getByText(/Destinos/))
      expect(mockNavigate).toHaveBeenCalledWith('/destinos')
    })
  })

  describe('brand click navigation', () => {
    it('navigates to /lugares/:slug when town has a slug', () => {
      renderNavbar({ town: { name: 'Santa Teresa', slug: 'santa-teresa' } })
      fireEvent.click(screen.getByText('Santa Teresa'))
      expect(mockNavigate).toHaveBeenCalledWith('/lugares/santa-teresa')
    })

    it('navigates to /login when town has no slug', () => {
      renderNavbar({})
      fireEvent.click(screen.getByText('Turismo Local'))
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })
})
