import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import PlaceCard from '../components/PlaceCard'
import ErrorPage from '../pages/ErrorPage'

// ─── Test 1: PlaceCard renderiza nombre y categoría ───────────────────────────
describe('PlaceCard', () => {
  const mockPlace = {
    id: 1,
    name: 'Playa Santa Teresa',
    description: 'Hermosa playa para surf.',
    category: 'PLAYA',
    address: 'Cóbano, Puntarenas',
    imageUrl: null,
  }

  const categoryInfo = { label: 'Playa', emoji: '🏖️', color: 'info' }

  it('renderiza el nombre del lugar', () => {
    render(<PlaceCard place={mockPlace} categoryInfo={categoryInfo} />)
    expect(screen.getByText('Playa Santa Teresa')).toBeInTheDocument()
  })

  it('renderiza la categoría correcta', () => {
    render(<PlaceCard place={mockPlace} categoryInfo={categoryInfo} />)
    expect(screen.getAllByText(/Playa/)[0]).toBeInTheDocument()
  })

  it('renderiza la dirección cuando está disponible', () => {
    render(<PlaceCard place={mockPlace} categoryInfo={categoryInfo} />)
    expect(screen.getByText(/Cóbano/)).toBeInTheDocument()
  })
})

// ─── Test 2: ErrorPage muestra 404 y opciones ────────────────────────────────
describe('ErrorPage', () => {
  const renderWithRouter = (ui) =>
    render(<MemoryRouter>{ui}</MemoryRouter>)

  it('muestra el código 404', () => {
    renderWithRouter(<ErrorPage />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('muestra botón para volver al inicio', () => {
    renderWithRouter(<ErrorPage />)
    expect(screen.getByText('Ir al inicio')).toBeInTheDocument()
  })

  it('muestra mensaje de destino no encontrado', () => {
    renderWithRouter(<ErrorPage />)
    expect(screen.getByText(/Destino no encontrado/i)).toBeInTheDocument()
  })
})
