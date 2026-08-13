import axios from 'axios'
import { toast } from 'sonner'

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  throw new Error('[viandas] VITE_API_URL no definida. El build de producción requiere esta variable de entorno.')
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      return Promise.reject(error)
    }
    if (status === 403 && !error.config?.silent403) {
      window.dispatchEvent(new CustomEvent('auth:forbidden', {
        detail: error.response?.data?.message ?? error.response?.data?.error,
      }))
    }
    else if (status === 404) toast.error('Recurso no encontrado', { description: 'Lo que buscabas no existe o fue eliminado.' })
    else if (status === 500) toast.error('Error del servidor', { description: 'Algo salió mal de nuestro lado. Ya lo estamos viendo.' })
    return Promise.reject(error)
  }
)

export default api
