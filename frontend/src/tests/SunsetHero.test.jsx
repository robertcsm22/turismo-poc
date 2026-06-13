import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SunsetHero from '../components/SunsetHero'

describe('SunsetHero', () => {
  it('renders default title and tag when no town is provided', () => {
    render(<SunsetHero />)
    expect(screen.getByText('Turismo Local')).toBeInTheDocument()
    expect(screen.getByText(/Turismo Local · Costa Rica/)).toBeInTheDocument()
  })

  it('renders the town name and province when provided', () => {
    const town = { name: 'Tamarindo', province: 'Guanacaste' }
    render(<SunsetHero town={town} />)
    expect(screen.getByText('Tamarindo')).toBeInTheDocument()
    expect(screen.getByText(/Turismo Local · Guanacaste/)).toBeInTheDocument()
  })

  it('renders the town description when provided', () => {
    const town = { name: 'Tamarindo', province: 'Guanacaste', description: 'Playa hermosa con olas para surf.' }
    render(<SunsetHero town={town} />)
    expect(screen.getByText('Playa hermosa con olas para surf.')).toBeInTheDocument()
  })

  it('does not render a description paragraph when town has no description', () => {
    const town = { name: 'Tamarindo', province: 'Guanacaste' }
    const { container } = render(<SunsetHero town={town} />)
    expect(container.querySelector('.sh-sub')).not.toBeInTheDocument()
  })

  it('renders the bird positions in the sh-birds layer', () => {
    const { container } = render(<SunsetHero town={{ name: 'Tamarindo' }} />)
    const birdsLayer = container.querySelector('.sh-birds')
    expect(birdsLayer).toBeInTheDocument()
    expect(birdsLayer.querySelectorAll('.sh-birdpos').length).toBe(20)
  })

  it('renders the expected structural sections', () => {
    const { container } = render(<SunsetHero town={{ name: 'Tamarindo' }} />)
    expect(container.querySelector('.sh-hero')).toBeInTheDocument()
    expect(container.querySelector('.sh-sky')).toBeInTheDocument()
    expect(container.querySelector('.sh-sun')).toBeInTheDocument()
    expect(container.querySelector('.sh-sea')).toBeInTheDocument()
    expect(container.querySelectorAll('.sh-wave').length).toBe(6)
  })
})
