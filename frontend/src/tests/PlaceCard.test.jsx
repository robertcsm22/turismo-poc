import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PlaceCard from '../components/PlaceCard'

describe('PlaceCard - additional edge cases', () => {
  const basePlace = {
    id: 1,
    name: 'Playa Santa Teresa',
    category: 'PLAYA',
  }

  const categoryInfo = { label: 'Playa', emoji: '🏖️', bg: '#2F7C91' }

  it('does not render the description paragraph when description is missing', () => {
    const place = { ...basePlace }
    const { container } = render(<PlaceCard place={place} categoryInfo={categoryInfo} />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(0)
  })

  it('does not render the address line when address is missing', () => {
    const place = { ...basePlace, description: 'Una descripción' }
    render(<PlaceCard place={place} categoryInfo={categoryInfo} />)
    expect(screen.queryByText('📍')).not.toBeInTheDocument()
  })

  it('uses the real image when imageUrl is provided', () => {
    const place = { ...basePlace, imageUrl: 'https://example.com/real-image.jpg' }
    render(<PlaceCard place={place} categoryInfo={categoryInfo} />)
    const img = screen.getByAltText('Playa Santa Teresa')
    expect(img).toHaveAttribute('src', 'https://example.com/real-image.jpg')
  })

  it('uses the fallback placeholder image when imageUrl is missing', () => {
    const place = { ...basePlace, imageUrl: null }
    render(<PlaceCard place={place} categoryInfo={categoryInfo} />)
    const img = screen.getByAltText('Playa Santa Teresa')
    expect(img.src).toContain('placehold.co')
    expect(img.src).toContain('2F7C91')
  })

  it('swaps to the fallback image when onError fires on the img', () => {
    const place = { ...basePlace, imageUrl: 'https://example.com/broken-image.jpg' }
    render(<PlaceCard place={place} categoryInfo={categoryInfo} />)
    const img = screen.getByAltText('Playa Santa Teresa')

    expect(img).toHaveAttribute('src', 'https://example.com/broken-image.jpg')

    fireEvent.error(img)

    expect(img.src).toContain('placehold.co')
    expect(img.src).toContain('2F7C91')
  })

  it('does not render the category badge when categoryInfo is not provided', () => {
    const place = { ...basePlace, imageUrl: null }
    const { container } = render(<PlaceCard place={place} />)
    expect(screen.queryByText('🏖️')).not.toBeInTheDocument()
    // bottom accent should use default gradient
    const accent = container.querySelector('.place-card > div:last-child')
    expect(accent.style.background).toContain('#20606e')
    expect(accent.style.background).toContain('#2F7C91')
  })

  it('uses the fallback image with default color when categoryInfo is not provided', () => {
    const place = { ...basePlace, imageUrl: null }
    render(<PlaceCard place={place} />)
    const img = screen.getByAltText('Playa Santa Teresa')
    expect(img.src).toContain('placehold.co')
    expect(img.src).toContain('2F7C91')
  })

  it('overrides categoryInfo.label with categoryLabel in the badge text', () => {
    const place = { ...basePlace, imageUrl: null }
    render(<PlaceCard place={place} categoryInfo={categoryInfo} categoryLabel="Playas y Costa" />)
    expect(screen.getByText(/Playas y Costa/)).toBeInTheDocument()
    expect(screen.queryByText(/^🏖️ Playa$/)).not.toBeInTheDocument()
  })

  it('uses categoryInfo.label when categoryLabel is not provided', () => {
    const place = { ...basePlace, imageUrl: null }
    render(<PlaceCard place={place} categoryInfo={categoryInfo} />)
    expect(screen.getByText(/🏖️\s*Playa$/)).toBeInTheDocument()
  })
})
