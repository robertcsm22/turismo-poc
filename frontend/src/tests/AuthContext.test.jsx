import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '../context/AuthContext'

function makeToken(expSecondsFromNow) {
  const payload = { exp: Math.floor(Date.now() / 1000) + expSecondsFromNow }
  return `header.${btoa(JSON.stringify(payload))}.sig`
}

function Consumer() {
  const { user, login, logout, isAuthenticated, loading } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated())}</span>
      <span data-testid="user">{user?.email || 'none'}</span>
      <button onClick={() => login({ token: makeToken(3600), user: { email: 'a@gmail.com', name: 'A' } })}>
        login
      </button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('finishes loading and starts unauthenticated when no session', async () => {
    render(<AuthProvider><Consumer /></AuthProvider>)

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(screen.getByTestId('user').textContent).toBe('none')
  })

  it('login stores token/user in sessionStorage and authenticates', async () => {
    render(<AuthProvider><Consumer /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))

    await act(async () => {
      screen.getByText('login').click()
    })

    expect(screen.getByTestId('authenticated').textContent).toBe('true')
    expect(screen.getByTestId('user').textContent).toBe('a@gmail.com')
    expect(sessionStorage.getItem('jwt_token')).not.toBeNull()
    expect(JSON.parse(sessionStorage.getItem('user_data')).email).toBe('a@gmail.com')
  })

  it('logout clears the session', async () => {
    render(<AuthProvider><Consumer /></AuthProvider>)
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))

    await act(async () => { screen.getByText('login').click() })
    await act(async () => { screen.getByText('logout').click() })

    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(sessionStorage.getItem('jwt_token')).toBeNull()
    expect(sessionStorage.getItem('user_data')).toBeNull()
  })

  it('restores a valid session from sessionStorage on mount', async () => {
    sessionStorage.setItem('jwt_token', makeToken(3600))
    sessionStorage.setItem('user_data', JSON.stringify({ email: 'b@gmail.com', name: 'B' }))

    render(<AuthProvider><Consumer /></AuthProvider>)

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('authenticated').textContent).toBe('true')
    expect(screen.getByTestId('user').textContent).toBe('b@gmail.com')
  })

  it('discards an expired session found in sessionStorage', async () => {
    sessionStorage.setItem('jwt_token', makeToken(-3600))
    sessionStorage.setItem('user_data', JSON.stringify({ email: 'c@gmail.com', name: 'C' }))

    render(<AuthProvider><Consumer /></AuthProvider>)

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(sessionStorage.getItem('jwt_token')).toBeNull()
  })

  it('useAuth throws when used outside of AuthProvider', () => {
    const Bad = () => {
      useAuth()
      return null
    }
    expect(() => render(<Bad />)).toThrow('useAuth debe usarse dentro de AuthProvider')
  })
})
