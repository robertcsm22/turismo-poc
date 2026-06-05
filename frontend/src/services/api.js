import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Adjuntar el JWT en cada request automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el server devuelve 401, limpiar sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ───────────────────────────────────────────────
export const authService = {
  // Envía el ID Token de Google al backend
  loginWithGoogle: (idToken) =>
    api.post('/auth/google', { idToken }).then((r) => r.data),
}

// ─── Towns ──────────────────────────────────────────────
export const townService = {
  getTown: (slug) => api.get(`/towns/${slug}`).then((r) => r.data),
  getPlaces: (slug) => api.get(`/towns/${slug}/places`).then((r) => r.data),
}

// ─── Users ──────────────────────────────────────────────
export const userService = {
  getMe: () => api.get('/users/me').then((r) => r.data),
}

export const placeService = {
  createPlace: (townId, placeData) =>
    api.post(`/places/town/${townId}`, placeData).then((r) => r.data),

  deletePlace: (id) =>
    api.delete(`/places/${id}`),
}

export default api
