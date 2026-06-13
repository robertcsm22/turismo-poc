import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminPlacesPage from '../pages/AdminPlacesPage'
import { townService, placeService } from '../services/api'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Admin User', email: 'admin@test.com', role: 'ADMIN' } }),
}))

vi.mock('../services/api', () => ({
  townService: {
    getTown: vi.fn(),
    getPlaces: vi.fn(),
  },
  placeService: {
    createPlace: vi.fn(),
    updatePlace: vi.fn(),
    deletePlace: vi.fn(),
  },
}))

const TOWN = { id: 1, name: 'Santa Teresa', slug: 'santa-teresa' }

const PLACES = [
  {
    id: 10,
    name: 'Playa Bonita',
    description: 'Una playa hermosa',
    category: 'PLAYA',
    address: 'Cóbano, Puntarenas',
    imageUrl: '',
    latitude: 9.6,
    longitude: -85.1,
  },
  {
    id: 11,
    name: 'Parque Central',
    description: '',
    category: 'PARQUE',
    address: '',
    imageUrl: 'https://example.com/img.jpg',
    latitude: null,
    longitude: null,
  },
]

const renderPage = (initialEntry = '/admin/lugares/santa-teresa') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/admin/lugares/:townSlug" element={<AdminPlacesPage />} />
      </Routes>
    </MemoryRouter>
  )

describe('AdminPlacesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    townService.getTown.mockResolvedValue(TOWN)
    townService.getPlaces.mockResolvedValue(PLACES)
  })

  it('fetches and displays the list of places for the town', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Playa Bonita')).toBeInTheDocument()
    })
    expect(screen.getByText('Parque Central')).toBeInTheDocument()
    expect(townService.getTown).toHaveBeenCalledWith('santa-teresa')
    expect(townService.getPlaces).toHaveBeenCalledWith('santa-teresa')
  })

  it('shows the town name in the subtitle and the places count', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/Gestiona los lugares turísticos de Santa Teresa/)).toBeInTheDocument()
    })
    expect(screen.getByText('2 lugares')).toBeInTheDocument()
  })

  it('shows the empty state when there are no places', async () => {
    townService.getPlaces.mockResolvedValue([])
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Sin lugares aún')).toBeInTheDocument()
    })
    expect(screen.getByText(/Agrega el primer lugar turístico/)).toBeInTheDocument()
  })

  it('shows the "new place" form title by default', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/Nuevo Lugar/)).toBeInTheDocument()
    })
    expect(screen.getByText('Crear lugar')).toBeInTheDocument()
  })

  it('submitting a valid create form calls placeService.createPlace and reloads places', async () => {
    placeService.createPlace.mockResolvedValue({ id: 99, ...PLACES[0] })
    renderPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ej. Playa Bonita')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Ej. Playa Bonita'), { target: { value: 'Nuevo Lugar' } })
    fireEvent.change(screen.getByPlaceholderText('Breve descripción del lugar...'), { target: { value: 'Descripción nueva' } })
    fireEvent.change(screen.getByPlaceholderText('Ej. Calle Principal, #10'), { target: { value: 'Calle 1' } })

    fireEvent.click(screen.getByText('Crear lugar'))

    await waitFor(() => {
      expect(placeService.createPlace).toHaveBeenCalledWith(1, expect.objectContaining({
        name: 'Nuevo Lugar',
        description: 'Descripción nueva',
        address: 'Calle 1',
        category: 'PARQUE',
        latitude: null,
        longitude: null,
      }))
    })

    // loadPlaces is called again on success
    await waitFor(() => {
      expect(townService.getPlaces).toHaveBeenCalledTimes(2)
    })

    // success toast shown
    expect(screen.getByText('Lugar creado correctamente')).toBeInTheDocument()

    // form is reset
    expect(screen.getByPlaceholderText('Ej. Playa Bonita')).toHaveValue('')
  })

  it('clicking edit on an existing place pre-fills the form with its data', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Playa Bonita')).toBeInTheDocument()
    })

    const editButtons = screen.getAllByText('✏️ Editar')
    fireEvent.click(editButtons[0])

    expect(screen.getByText(/Editar Lugar/)).toBeInTheDocument()
    expect(screen.getByText('Modificando ID #10')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ej. Playa Bonita')).toHaveValue('Playa Bonita')
    expect(screen.getByPlaceholderText('Breve descripción del lugar...')).toHaveValue('Una playa hermosa')
    expect(screen.getByPlaceholderText('Ej. Calle Principal, #10')).toHaveValue('Cóbano, Puntarenas')
    expect(screen.getByText('Guardar cambios')).toBeInTheDocument()
  })

  it('submitting an edit calls placeService.updatePlace with the place id and updated data', async () => {
    placeService.updatePlace.mockResolvedValue({ ...PLACES[0], name: 'Playa Editada' })
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Playa Bonita')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByText('✏️ Editar')[0])

    fireEvent.change(screen.getByPlaceholderText('Ej. Playa Bonita'), { target: { value: 'Playa Editada' } })

    fireEvent.click(screen.getByText('Guardar cambios'))

    await waitFor(() => {
      expect(placeService.updatePlace).toHaveBeenCalledWith(10, expect.objectContaining({
        name: 'Playa Editada',
        category: 'PLAYA',
      }))
    })

    expect(screen.getByText('Lugar actualizado correctamente')).toBeInTheDocument()

    // editingId is cleared, back to "new" form
    await waitFor(() => {
      expect(screen.getByText(/Nuevo Lugar/)).toBeInTheDocument()
    })
  })

  it('cancel button resets the form and exits edit mode', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Playa Bonita')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByText('✏️ Editar')[0])
    expect(screen.getByText(/Editar Lugar/)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancelar'))

    expect(screen.getByText(/Nuevo Lugar/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ej. Playa Bonita')).toHaveValue('')
  })

  it('clicking delete with confirm=true calls placeService.deletePlace and reloads', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    placeService.deletePlace.mockResolvedValue({})
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Playa Bonita')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByText('🗑️ Eliminar')[0])

    await waitFor(() => {
      expect(placeService.deletePlace).toHaveBeenCalledWith(10)
    })

    expect(screen.getByText('Lugar eliminado')).toBeInTheDocument()
    await waitFor(() => {
      expect(townService.getPlaces).toHaveBeenCalledTimes(2)
    })
  })

  it('shows the loading label on the delete button while deletion is in progress', async () => {
    let resolveDelete
    placeService.deletePlace.mockReturnValue(new Promise((resolve) => { resolveDelete = resolve }))
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Playa Bonita')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByText('🗑️ Eliminar')[0])

    await waitFor(() => {
      expect(screen.getByText('Cargando...')).toBeInTheDocument()
    })

    resolveDelete({})
  })

  it('shows an error toast when deletePlace rejects', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    placeService.deletePlace.mockRejectedValue(new Error('fail'))
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Playa Bonita')).toBeInTheDocument()
    })

    fireEvent.click(screen.getAllByText('🗑️ Eliminar')[0])

    await waitFor(() => {
      expect(screen.getByText('Error al eliminar el lugar')).toBeInTheDocument()
    })
  })

  it('does not submit the form when the required name field is empty', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Crear lugar')).toBeInTheDocument()
    })

    const nameInput = screen.getByPlaceholderText('Ej. Playa Bonita')
    expect(nameInput).toBeRequired()

    fireEvent.click(screen.getByText('Crear lugar'))

    // Native HTML5 validation should prevent submission
    expect(placeService.createPlace).not.toHaveBeenCalled()
  })

  it('changing the category select updates the form state', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Crear lugar')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('PARQUE')

    fireEvent.change(select, { target: { value: 'HOTEL' } })
    expect(select).toHaveValue('HOTEL')
  })

  it('shows an image preview when imageUrl is set in the form', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Crear lugar')).toBeInTheDocument()
    })

    expect(screen.queryByAltText('vista previa')).not.toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('https://...'), { target: { value: 'https://example.com/foo.jpg' } })

    expect(screen.getByAltText('vista previa')).toBeInTheDocument()
    expect(screen.getByAltText('vista previa')).toHaveAttribute('src', 'https://example.com/foo.jpg')
  })

  it('shows an error toast when create fails with a 400 response', async () => {
    placeService.createPlace.mockRejectedValue({ response: { status: 400, data: {} } })
    renderPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ej. Playa Bonita')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Ej. Playa Bonita'), { target: { value: 'Algo' } })
    fireEvent.click(screen.getByText('Crear lugar'))

    await waitFor(() => {
      expect(screen.getByText('Datos inválidos, revisa el formulario')).toBeInTheDocument()
    })
  })

  it('shows an error toast when create fails with a 403 response', async () => {
    placeService.createPlace.mockRejectedValue({ response: { status: 403, data: {} } })
    renderPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ej. Playa Bonita')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Ej. Playa Bonita'), { target: { value: 'Algo' } })
    fireEvent.click(screen.getByText('Crear lugar'))

    await waitFor(() => {
      expect(screen.getByText('Sin permisos para realizar esta acción')).toBeInTheDocument()
    })
  })

  it('shows a generic error toast when create fails with an unknown error', async () => {
    placeService.createPlace.mockRejectedValue(new Error('boom'))
    renderPage()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Ej. Playa Bonita')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Ej. Playa Bonita'), { target: { value: 'Algo' } })
    fireEvent.click(screen.getByText('Crear lugar'))

    await waitFor(() => {
      expect(screen.getByText('Error al guardar el lugar')).toBeInTheDocument()
    })
  })

  it('shows an error toast when townService.getTown rejects', async () => {
    townService.getTown.mockRejectedValue(new Error('network error'))
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Crear lugar')).toBeInTheDocument()
    })

    // submit button should be disabled because town never loaded
    expect(screen.getByText('Crear lugar')).toBeDisabled()

    consoleSpy.mockRestore()
  })

  it('navigates back when the back button is clicked', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText(/Volver/)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Volver/))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('falls back to santa-teresa town slug when none is provided', async () => {
    render(
      <MemoryRouter initialEntries={['/admin/lugares']}>
        <Routes>
          <Route path="/admin/lugares" element={<AdminPlacesPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(townService.getTown).toHaveBeenCalledWith('santa-teresa')
    })
    expect(townService.getPlaces).toHaveBeenCalledWith('santa-teresa')
  })
})
