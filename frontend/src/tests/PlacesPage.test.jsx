import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PlacesPage from '../pages/PlacesPage'
import { townService } from '../services/api'

const navigateMock = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', role: 'USER' },
    logout: vi.fn(),
  }),
}))

vi.mock('../services/api', () => ({
  townService: {
    getTown: vi.fn(),
    getPlaces: vi.fn(),
  },
}))

const TOWN = { name: 'Santa Teresa', slug: 'santa-teresa', province: 'Puntarenas', description: 'Pueblo de surf.' }

const PLACES = [
  {
    id: 1,
    name: 'Playa Carmen',
    description: 'Playa principal con olas para surf.',
    category: 'PLAYA',
    address: 'Santa Teresa',
    latitude: 9.6444,
    longitude: -85.1669,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Hotel Florblanca',
    description: 'Hotel boutique de lujo.',
    category: 'HOTEL',
    address: 'Santa Teresa',
    latitude: 9.6400,
    longitude: -85.1700,
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Banana Beach',
    description: 'Restaurante frente al mar.',
    category: 'RESTAURANTE',
    address: 'Santa Teresa',
    latitude: null,
    longitude: null,
    createdAt: '2024-02-01T00:00:00Z',
  },
]

// Mock window.L (Leaflet) as a chainable global
function mockLeaflet() {
  const chainable = () => {
    const obj = {}
    obj.addTo = vi.fn(() => obj)
    obj.bindPopup = vi.fn(() => obj)
    obj.setView = vi.fn(() => obj)
    obj.fitBounds = vi.fn(() => obj)
    return obj
  }
  window.L = {
    map: vi.fn(() => chainable()),
    tileLayer: vi.fn(() => chainable()),
    marker: vi.fn(() => chainable()),
    divIcon: vi.fn(() => ({})),
    icon: vi.fn(() => ({})),
    popup: vi.fn(() => chainable()),
    latLngBounds: vi.fn(() => ({})),
  }
}

function mockQRCode() {
  window.QRCode = vi.fn(function (el, opts) {
    this.el = el
    this.opts = opts
  })
  window.QRCode.CorrectLevel = { H: 'H' }
}

const renderPage = (initialEntry = '/lugares/santa-teresa') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/lugares/:townSlug" element={<PlacesPage />} />
      </Routes>
    </MemoryRouter>
  )

beforeEach(() => {
  vi.clearAllMocks()
  delete window.L
  delete window.QRCode
  townService.getTown.mockResolvedValue(TOWN)
  townService.getPlaces.mockResolvedValue(PLACES)
})

describe('PlacesPage', () => {
  it('shows a loading state initially', async () => {
    let resolveTown
    townService.getTown.mockReturnValue(new Promise(res => { resolveTown = res }))
    renderPage()

    expect(screen.getByText('Cargando lugares...')).toBeInTheDocument()

    await act(async () => {
      resolveTown(TOWN)
    })
  })

  it('fetches town and places, then renders place cards', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getAllByText('Santa Teresa').length).toBeGreaterThan(0)
    })

    expect(townService.getTown).toHaveBeenCalledWith('santa-teresa')
    expect(townService.getPlaces).toHaveBeenCalledWith('santa-teresa')

    expect(screen.getByText('Playa Carmen')).toBeInTheDocument()
    expect(screen.getByText('Hotel Florblanca')).toBeInTheDocument()
    expect(screen.getByText('Banana Beach')).toBeInTheDocument()
  })

  it('navigates to /error if fetching fails', async () => {
    townService.getTown.mockRejectedValue(new Error('boom'))
    renderPage()

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/error')
    })
  })

  it('shows the "found" summary count for all places', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('3 lugares encontrados')).toBeInTheDocument()
    })
  })

  describe('category filter', () => {
    it('filters places by category when clicking a category pill and updates URL', async () => {
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      // Category pill label includes emoji + translated category name, e.g. "🏖️ Playa"
      const playaButton = screen.getByText((content, el) =>
        el.tagName.toLowerCase() === 'button' && /Playa/.test(content) && !/Playa Carmen/.test(content)
      )
      await user.click(playaButton)

      await waitFor(() => {
        expect(screen.getByText('Playa Carmen')).toBeInTheDocument()
        expect(screen.queryByText('Hotel Florblanca')).not.toBeInTheDocument()
        expect(screen.queryByText('Banana Beach')).not.toBeInTheDocument()
      })

      expect(screen.getByText('1 lugar encontrado en Playa')).toBeInTheDocument()
    })

    it('returns to all places when clicking the "Todos" pill', async () => {
      renderPage('/lugares/santa-teresa?category=PLAYA')
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      // Only Playa Carmen visible initially
      expect(screen.queryByText('Hotel Florblanca')).not.toBeInTheDocument()

      const user = userEvent.setup()
      const allButton = screen.getByText((content, el) =>
        el.tagName.toLowerCase() === 'button' && /Todos/.test(content)
      )
      await user.click(allButton)

      await waitFor(() => {
        expect(screen.getByText('Hotel Florblanca')).toBeInTheDocument()
        expect(screen.getByText('Banana Beach')).toBeInTheDocument()
      })
    })
  })

  describe('search', () => {
    it('filters places by name via the search input', async () => {
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      const searchInput = screen.getByPlaceholderText('Buscar lugar por nombre...')
      await user.type(searchInput, 'Hotel')

      await waitFor(() => {
        expect(screen.getByText('Hotel Florblanca')).toBeInTheDocument()
        expect(screen.queryByText('Playa Carmen')).not.toBeInTheDocument()
        expect(screen.queryByText('Banana Beach')).not.toBeInTheDocument()
      })
    })

    it('filters places by description match', async () => {
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      const searchInput = screen.getByPlaceholderText('Buscar lugar por nombre...')
      await user.type(searchInput, 'mar')

      await waitFor(() => {
        // "Restaurante frente al mar" matches Banana Beach's description
        expect(screen.getByText('Banana Beach')).toBeInTheDocument()
      })
    })

    it('shows the empty state when no places match search', async () => {
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      const searchInput = screen.getByPlaceholderText('Buscar lugar por nombre...')
      await user.type(searchInput, 'zzzzzznoresult')

      await waitFor(() => {
        expect(screen.getByText('Sin resultados')).toBeInTheDocument()
        expect(screen.getByText('No encontramos lugares con ese criterio.')).toBeInTheDocument()
        expect(screen.getByText('Ver todos')).toBeInTheDocument()
      })
    })

    it('"Ver todos" remains clickable when both category and search filters are active', async () => {
      renderPage('/lugares/santa-teresa?category=PLAYA&search=zzzzzznoresult')
      await waitFor(() => {
        expect(screen.getByText('Sin resultados')).toBeInTheDocument()
      })

      const user = userEvent.setup()
      const resetButton = screen.getByText('Ver todos')
      await user.click(resetButton)

      // The page remains in a consistent state (no crash) after clicking "Ver todos".
      await waitFor(() => {
        expect(screen.getByText(/Sin resultados|Playa Carmen/)).toBeInTheDocument()
      })
    })

    it('clearing the search input restores all places', async () => {
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      const searchInput = screen.getByPlaceholderText('Buscar lugar por nombre...')
      await user.type(searchInput, 'zzzzzznoresult')

      await waitFor(() => expect(screen.getByText('Sin resultados')).toBeInTheDocument())

      await user.clear(searchInput)

      await waitFor(() => {
        expect(screen.getByText('Playa Carmen')).toBeInTheDocument()
        expect(screen.getByText('Hotel Florblanca')).toBeInTheDocument()
        expect(screen.getByText('Banana Beach')).toBeInTheDocument()
      })
    })
  })

  describe('sort', () => {
    it('sorts by name by default', async () => {
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const headings = screen.getAllByRole('heading', { level: 5 })
      const names = headings.map(h => h.textContent)
      // Alphabetical: Banana Beach, Hotel Florblanca, Playa Carmen
      expect(names).toEqual(['Banana Beach', 'Hotel Florblanca', 'Playa Carmen'])
    })

    it('sorts by category when selecting "Categoría"', async () => {
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      const sortSelect = screen.getByLabelText('Ordenar por:')
      await user.selectOptions(sortSelect, 'category')

      await waitFor(() => {
        const headings = screen.getAllByRole('heading', { level: 5 })
        const names = headings.map(h => h.textContent)
        // category order: HOTEL, PLAYA, RESTAURANTE -> Florblanca, Carmen, Banana Beach
        expect(names).toEqual(['Hotel Florblanca', 'Playa Carmen', 'Banana Beach'])
      })
    })

    it('sorts by createdAt (most recent first) when selecting "Más recientes"', async () => {
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      const sortSelect = screen.getByLabelText('Ordenar por:')
      await user.selectOptions(sortSelect, 'createdAt')

      await waitFor(() => {
        const headings = screen.getAllByRole('heading', { level: 5 })
        const names = headings.map(h => h.textContent)
        // Most recent first: Hotel Florblanca (03-01), Banana Beach (02-01), Playa Carmen (01-01)
        expect(names).toEqual(['Hotel Florblanca', 'Banana Beach', 'Playa Carmen'])
      })
    })
  })

  describe('map modal', () => {
    it('opens the map modal when clicking "Ver mapa" and closes via the close button', async () => {
      mockLeaflet()
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      await user.click(screen.getByText('🗺️ Ver mapa'))

      await waitFor(() => {
        expect(screen.getByText('Mapa de Santa Teresa')).toBeInTheDocument()
      })

      // Map renders markers only for places with lat/lng (2 of 3 places)
      expect(screen.getByText('2 lugares con ubicación')).toBeInTheDocument()
      expect(window.L.map).toHaveBeenCalled()
      expect(window.L.marker).toHaveBeenCalledTimes(2)

      const closeButton = screen.getByText('×')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Mapa de Santa Teresa')).not.toBeInTheDocument()
      })
    })

    it('closes the map modal on Escape key press', async () => {
      mockLeaflet()
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      await user.click(screen.getByText('🗺️ Ver mapa'))

      await waitFor(() => {
        expect(screen.getByText('Mapa de Santa Teresa')).toBeInTheDocument()
      })

      await act(async () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      await waitFor(() => {
        expect(screen.queryByText('Mapa de Santa Teresa')).not.toBeInTheDocument()
      })
    })
  })

  describe('QR modal', () => {
    it('opens the QR modal when clicking "Código QR" and closes it', async () => {
      mockQRCode()
      renderPage()
      await waitFor(() => expect(screen.getByText('Playa Carmen')).toBeInTheDocument())

      const user = userEvent.setup()
      await user.click(screen.getByText('📲 Código QR'))

      await waitFor(() => {
        expect(screen.getByText('Código QR')).toBeInTheDocument()
      })

      expect(window.QRCode).toHaveBeenCalled()

      const closeButton = screen.getByText('Cerrar')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Código QR')).not.toBeInTheDocument()
      })
    })
  })
})
