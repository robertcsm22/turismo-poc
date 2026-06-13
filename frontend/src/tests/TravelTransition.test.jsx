import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import TravelTransition from '../components/TravelTransition'

describe('TravelTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the destination name', () => {
    render(<TravelTransition destinationName="Tamarindo" onComplete={() => {}} />)
    expect(screen.getByText('Tamarindo')).toBeInTheDocument()
  })

  it('renders the translated "traveling to" and country text', () => {
    render(<TravelTransition destinationName="Tamarindo" onComplete={() => {}} />)
    expect(screen.getByText(/Viajando a/)).toBeInTheDocument()
    expect(screen.getByText('Costa Rica')).toBeInTheDocument()
  })

  it('calls onComplete after 4000ms', () => {
    const onComplete = vi.fn()
    render(<TravelTransition destinationName="Tamarindo" onComplete={onComplete} />)

    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('does not call onComplete before 4000ms', () => {
    const onComplete = vi.fn()
    render(<TravelTransition destinationName="Tamarindo" onComplete={onComplete} />)

    act(() => {
      vi.advanceTimersByTime(3999)
    })

    expect(onComplete).not.toHaveBeenCalled()
  })

  it('clears the timeout on unmount and does not call onComplete', () => {
    const onComplete = vi.fn()
    const { unmount } = render(<TravelTransition destinationName="Tamarindo" onComplete={onComplete} />)

    unmount()

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(onComplete).not.toHaveBeenCalled()
  })

  it('renders cloud and plane images', () => {
    render(<TravelTransition destinationName="Tamarindo" onComplete={() => {}} />)
    const planeImg = screen.getByAltText('avión')
    expect(planeImg).toBeInTheDocument()

    const cloudImgs = screen.getAllByAltText('')
    expect(cloudImgs.length).toBeGreaterThan(0)
  })

  it('renders without crashing when destinationName is empty', () => {
    render(<TravelTransition destinationName="" onComplete={() => {}} />)
    expect(screen.getByText(/Viajando a/)).toBeInTheDocument()
  })
})
