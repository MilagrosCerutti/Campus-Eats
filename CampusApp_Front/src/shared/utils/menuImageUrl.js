const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export function getMenuImageUrl(imagenUrl) {
  if (!imagenUrl) return null

  try {
    const apiUrl = new URL(API_URL, window.location.origin)
    return new URL(imagenUrl, apiUrl.origin).href
  } catch {
    return null
  }
}
