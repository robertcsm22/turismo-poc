import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import TourismChatbot from '../components/TourismChatbot'

const town = { name: 'Santa Teresa', province: 'Puntarenas' }
const places = [
  { id: 1, name: 'Playa Carmen', category: 'PLAYA' },
  { id: 2, name: 'Playa Hermosa', category: 'PLAYA' },
  { id: 3, name: 'Soda Tica', category: 'RESTAURANTE' },
  { id: 4, name: 'Hotel Bahia', category: 'HOTEL' },
  { id: 5, name: 'Mirador del Sol', category: 'MIRADOR' },
]

const WELCOME = '¡Hola! 👋 Soy tu guía virtual de turismo. Pregúntame sobre los lugares, actividades, restaurantes o lo que quieras saber del pueblo. 🌴'

const openChat = () => {
  const fab = screen.getByTitle('Asistente de turismo')
  act(() => {
    fab.click()
  })
}

describe('TourismChatbot', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders closed by default with FAB visible', () => {
    render(<TourismChatbot town={town} places={places} />)
    expect(screen.getByTitle('Asistente de turismo')).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Escribe tu pregunta...')).not.toBeInTheDocument()
  })

  it('opens the chat window when the FAB is clicked', () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()
    expect(screen.getByPlaceholderText('Escribe tu pregunta...')).toBeInTheDocument()
    expect(screen.getByText(WELCOME)).toBeInTheDocument()
  })

  it('closes the chat window when the FAB is clicked again', () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()
    expect(screen.getByPlaceholderText('Escribe tu pregunta...')).toBeInTheDocument()

    act(() => {
      screen.getByTitle('Asistente de turismo').click()
    })

    expect(screen.queryByPlaceholderText('Escribe tu pregunta...')).not.toBeInTheDocument()
  })

  it('shows the town name in the header', () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()
    expect(screen.getByText(/Guía de Santa Teresa/)).toBeInTheDocument()
  })

  it('shows quick suggestion buttons when only the welcome message is present', () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()
    expect(screen.getByText('¿Qué puedo hacer hoy?')).toBeInTheDocument()
    expect(screen.getByText('¿Dónde comer?')).toBeInTheDocument()
    expect(screen.getByText('¿Cuáles son las mejores playas?')).toBeInTheDocument()
  })

  it('clicking a quick suggestion fills the input field', () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    act(() => {
      screen.getByText('¿Dónde comer?').click()
    })

    const textarea = screen.getByPlaceholderText('Escribe tu pregunta...')
    expect(textarea.value).toBe('¿Dónde comer?')
  })

  it('send button is disabled when input is empty', () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    const sendButton = screen.getByText('➤')
    expect(sendButton).toBeDisabled()
  })

  it('typing a message enables the send button and submitting adds it to messages', async () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    const textarea = screen.getByPlaceholderText('Escribe tu pregunta...')
    const sendButton = screen.getByText('➤')

    fireEvent.change(textarea, { target: { value: 'Hola' } })

    expect(sendButton).not.toBeDisabled()

    await act(async () => {
      sendButton.click()
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByText('Hola')).toBeInTheDocument()
    expect(screen.getByText(/Bienvenido a Santa Teresa, Puntarenas/)).toBeInTheDocument()
  })

  it('shows a typing indicator while waiting for the bot response', async () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    const textarea = screen.getByPlaceholderText('Escribe tu pregunta...')
    const sendButton = screen.getByText('➤')

    fireEvent.change(textarea, { target: { value: '¿Dónde comer?' } })

    act(() => {
      sendButton.click()
    })

    // Send button should be disabled while loading
    expect(sendButton).toBeDisabled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByText(/Para comer te recomiendo/)).toBeInTheDocument()
  })

  it('responds with beach info when asking about playas', async () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    const textarea = screen.getByPlaceholderText('Escribe tu pregunta...')
    const sendButton = screen.getByText('➤')

    fireEvent.change(textarea, { target: { value: '¿Cuáles son las mejores playas?' } })

    await act(async () => {
      sendButton.click()
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByText(/En Santa Teresa tenés 2 playas increíbles/)).toBeInTheDocument()
    expect(screen.getByText(/Playa Carmen, Playa Hermosa/)).toBeInTheDocument()
  })

  it('responds with hotel info when asking about hospedaje', async () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    const textarea = screen.getByPlaceholderText('Escribe tu pregunta...')
    const sendButton = screen.getByText('➤')

    fireEvent.change(textarea, { target: { value: '¿Dónde puedo dormir?' } })

    await act(async () => {
      sendButton.click()
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByText(/Para hospedarte tenés: Hotel Bahia/)).toBeInTheDocument()
  })

  it('responds with a generic fallback for unrecognized questions', async () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    const textarea = screen.getByPlaceholderText('Escribe tu pregunta...')
    const sendButton = screen.getByText('➤')

    fireEvent.change(textarea, { target: { value: 'asdfqwerty' } })

    await act(async () => {
      sendButton.click()
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByText(/¡Buena pregunta! 🌴 Santa Teresa es un pueblo increíble/)).toBeInTheDocument()
  })

  it('clears the chat back to the welcome message when the clear button is clicked', async () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    const textarea = screen.getByPlaceholderText('Escribe tu pregunta...')
    const sendButton = screen.getByText('➤')

    fireEvent.change(textarea, { target: { value: 'Hola' } })

    await act(async () => {
      sendButton.click()
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByText('Hola')).toBeInTheDocument()

    act(() => {
      screen.getByTitle('Limpiar chat').click()
    })

    expect(screen.queryByText('Hola')).not.toBeInTheDocument()
    expect(screen.getByText(WELCOME)).toBeInTheDocument()
  })

  it('does not send empty or whitespace-only messages', async () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    const textarea = screen.getByPlaceholderText('Escribe tu pregunta...')

    fireEvent.change(textarea, { target: { value: '   ' } })

    const sendButton = screen.getByText('➤')
    expect(sendButton).toBeDisabled()
  })

  it('pressing Enter without shift sends the message', async () => {
    render(<TourismChatbot town={town} places={places} />)
    openChat()

    const textarea = screen.getByPlaceholderText('Escribe tu pregunta...')

    fireEvent.change(textarea, { target: { value: 'Gracias' } })

    await act(async () => {
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })
      await vi.advanceTimersByTimeAsync(700)
    })

    expect(screen.getByText('Gracias')).toBeInTheDocument()
    expect(screen.getByText(/Esperamos que disfrutes mucho tu visita a Santa Teresa/)).toBeInTheDocument()
  })

  it('renders default town label when no town prop is provided', () => {
    render(<TourismChatbot places={places} />)
    openChat()
    expect(screen.getByText(/Guía de Turismo/)).toBeInTheDocument()
  })
})
