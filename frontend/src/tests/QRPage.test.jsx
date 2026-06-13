import { render, screen, act, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import QRPage from '../pages/QRPage'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../services/api', () => ({
  townService: {
    getTown: vi.fn(),
  },
}))

import { townService } from '../services/api'

function renderQR(initialPath = '/qr/santa-teresa') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/qr/:townSlug" element={<QRPage />} />
        <Route path="/qr" element={<QRPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('QRPage', () => {
  let appendedScripts

  beforeEach(() => {
    mockNavigate.mockReset()
    townService.getTown.mockReset()
    townService.getTown.mockResolvedValue({ name: 'Santa Teresa' })

    appendedScripts = []
    const realCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = realCreateElement(tag)
      if (tag === 'script') {
        appendedScripts.push(el)
      }
      return el
    })

    window.QRCode = vi.fn().mockImplementation(() => ({}))
    window.QRCode.CorrectLevel = { H: 'H' }
  })

  afterEach(() => {
    delete window.QRCode
    vi.restoreAllMocks()
  })

  it('renders without crashing showing default town name', async () => {
    renderQR('/qr')

    expect(await screen.findByText('Turismo Local')).toBeInTheDocument()
    expect(screen.getByText('⬇️ Descargar PNG')).toBeInTheDocument()
    expect(screen.getByText(/Escanea para acceder a los lugares turísticos de/)).toBeInTheDocument()
    expect(screen.getByText('este pueblo')).toBeInTheDocument()
  })

  it('loads town info and renders its name and province', async () => {
    townService.getTown.mockResolvedValue({ name: 'Santa Teresa', province: 'Puntarenas' })

    renderQR('/qr/santa-teresa')

    expect((await screen.findAllByText('Santa Teresa')).length).toBeGreaterThan(0)
    expect(await screen.findByText('Puntarenas, Costa Rica')).toBeInTheDocument()
  })

  it('appends the QRCode script and generates a QR code on load with the expected URL', async () => {
    townService.getTown.mockResolvedValue({ name: 'Santa Teresa', province: 'Puntarenas' })

    renderQR('/qr/santa-teresa')

    await waitFor(() => expect(appendedScripts.length).toBe(1))
    expect(appendedScripts[0].src).toContain('qrcode.min.js')

    await waitFor(() => expect(window.QRCode).toHaveBeenCalledTimes(1))
    const [container, options] = window.QRCode.mock.calls[0]
    expect(container).toBeTruthy()
    expect(options.text).toBe(`${window.location.origin}/login/santa-teresa`)
    expect(options.correctLevel).toBe('H')
  })

  it('generates a QR code pointing at default slug when no townSlug', async () => {
    renderQR('/qr')

    await waitFor(() => expect(appendedScripts.length).toBe(1))
    await waitFor(() => expect(window.QRCode).toHaveBeenCalledTimes(1))

    const options = window.QRCode.mock.calls[0][1]
    expect(options.text).toBe(`${window.location.origin}/login/santa-teresa`)
  })

  it('shows the scan line once the QR is ready', async () => {
    const { container } = renderQR('/qr/santa-teresa')

    await waitFor(() => expect(appendedScripts.length).toBe(1))
    await waitFor(() => expect(window.QRCode).toHaveBeenCalledTimes(1))

    expect(container.querySelector('.qr-scan-line')).toBeInTheDocument()
  })

  it('does nothing on download click when no canvas is present', async () => {
    renderQR('/qr/santa-teresa')

    await waitFor(() => expect(appendedScripts.length).toBe(1))
    await waitFor(() => expect(window.QRCode).toHaveBeenCalledTimes(1))

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await act(async () => {
      screen.getByText('⬇️ Descargar PNG').click()
    })

    expect(clickSpy).not.toHaveBeenCalled()
  })

  it('triggers a download with the QR canvas content when clicking the download button', async () => {
    const { container } = renderQR('/qr/santa-teresa')

    await waitFor(() => expect(appendedScripts.length).toBe(1))
    await waitFor(() => expect(window.QRCode).toHaveBeenCalledTimes(1))

    const qrWrapperDiv = container.querySelector('.qr-wrapper > div:last-child')
    const canvas = document.createElement('canvas')
    vi.spyOn(canvas, 'toDataURL').mockReturnValue('data:image/png;base64,FAKE')
    qrWrapperDiv.appendChild(canvas)

    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    await act(async () => {
      screen.getByText('⬇️ Descargar PNG').click()
    })

    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(canvas.toDataURL).toHaveBeenCalled()
  })

  it('navigates back when clicking the back button', async () => {
    renderQR('/qr/santa-teresa')

    await waitFor(() => expect(appendedScripts.length).toBe(1))

    await act(async () => {
      screen.getByText(/Volver/).click()
    })

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
