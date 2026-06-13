import { describe, it, expect, beforeEach, vi } from 'vitest'
import api, { authService, townService, userService, placeService } from '../services/api'

describe('api request interceptor', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('attaches the bearer token when present in sessionStorage', () => {
    sessionStorage.setItem('jwt_token', 'abc123')
    const handler = api.interceptors.request.handlers[0].fulfilled
    const config = handler({ headers: {} })
    expect(config.headers.Authorization).toBe('Bearer abc123')
  })

  it('does not attach a header when there is no token', () => {
    const handler = api.interceptors.request.handlers[0].fulfilled
    const config = handler({ headers: {} })
    expect(config.headers.Authorization).toBeUndefined()
  })
})

describe('api response interceptor', () => {
  beforeEach(() => {
    sessionStorage.clear()
    delete window.location
    window.location = { href: '' }
  })

  it('clears the session and redirects to /login on 401', async () => {
    sessionStorage.setItem('jwt_token', 'abc')
    sessionStorage.setItem('user_data', '{}')

    const rejected = api.interceptors.response.handlers[0].rejected
    await expect(rejected({ response: { status: 401 } })).rejects.toBeTruthy()

    expect(sessionStorage.getItem('jwt_token')).toBeNull()
    expect(sessionStorage.getItem('user_data')).toBeNull()
    expect(window.location.href).toBe('/login')
  })

  it('passes through non-401 errors without clearing the session', async () => {
    sessionStorage.setItem('jwt_token', 'abc')

    const rejected = api.interceptors.response.handlers[0].rejected
    await expect(rejected({ response: { status: 500 } })).rejects.toBeTruthy()

    expect(sessionStorage.getItem('jwt_token')).toBe('abc')
    expect(window.location.href).toBe('')
  })
})

describe('service wrappers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('authService.loginWithGoogle posts the id token', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({ data: { token: 'jwt' } })
    const result = await authService.loginWithGoogle('id-token')
    expect(api.post).toHaveBeenCalledWith('/auth/google', { idToken: 'id-token' })
    expect(result).toEqual({ token: 'jwt' })
  })

  it('townService.getTown fetches a town by slug', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: { name: 'Santa Teresa' } })
    const result = await townService.getTown('santa-teresa')
    expect(api.get).toHaveBeenCalledWith('/towns/santa-teresa')
    expect(result).toEqual({ name: 'Santa Teresa' })
  })

  it('townService.getPlaces fetches places by town slug', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: [{ id: 1 }] })
    const result = await townService.getPlaces('santa-teresa')
    expect(api.get).toHaveBeenCalledWith('/towns/santa-teresa/places')
    expect(result).toEqual([{ id: 1 }])
  })

  it('userService.getMe fetches the current user', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: { email: 'a@gmail.com' } })
    const result = await userService.getMe()
    expect(api.get).toHaveBeenCalledWith('/users/me')
    expect(result).toEqual({ email: 'a@gmail.com' })
  })

  it('placeService.createPlace posts the new place to a town', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 1, name: 'Nuevo' } })
    const result = await placeService.createPlace(1, { name: 'Nuevo' })
    expect(api.post).toHaveBeenCalledWith('/places/town/1', { name: 'Nuevo' })
    expect(result).toEqual({ id: 1, name: 'Nuevo' })
  })

  it('placeService.updatePlace puts the updated place', async () => {
    vi.spyOn(api, 'put').mockResolvedValue({ data: { id: 1, name: 'Actualizado' } })
    const result = await placeService.updatePlace(1, { name: 'Actualizado' })
    expect(api.put).toHaveBeenCalledWith('/places/1', { name: 'Actualizado' })
    expect(result).toEqual({ id: 1, name: 'Actualizado' })
  })

  it('placeService.deletePlace deletes the place', async () => {
    vi.spyOn(api, 'delete').mockResolvedValue({ status: 204 })
    await placeService.deletePlace(1)
    expect(api.delete).toHaveBeenCalledWith('/places/1')
  })
})
