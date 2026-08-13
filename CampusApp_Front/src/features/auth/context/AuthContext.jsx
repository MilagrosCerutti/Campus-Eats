import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import authService from '@/features/auth/services/authService'

const UserSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  email: z.string().email(),
  rol: z.enum(['usuario', 'admin']),
})

const AuthContext = createContext(null)

function readUser() {
  try {
    const stored = localStorage.getItem('user')
    if (!stored) return null
    const result = UserSchema.safeParse(JSON.parse(stored))
    if (!result.success) {
      localStorage.removeItem('user')
      return null
    }
    return result.data
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(readUser)
  const [token, setToken]     = useState(() => localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)
  const navigate              = useNavigate()

  // Auth init: mark as ready after synchronous read
  useEffect(() => { setIsLoading(false) }, [])

  const login = useCallback(async (credentials) => {
    const { token, usuario } = await authService.login(credentials)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(usuario))
    setToken(token)
    setUser(usuario)
    return usuario
  }, [])

  const register = useCallback(async (data) => {
    await authService.register(data)
    try {
      const { token, usuario } = await authService.login({ email: data.email, password: data.password })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(usuario))
      setToken(token)
      setUser(usuario)
      return usuario
    } catch {
      throw new Error('Registro exitoso. Por favor iniciá sesión.')
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  useEffect(() => {
    const handler = () => logout()
    window.addEventListener('auth:unauthorized', handler)
    return () => window.removeEventListener('auth:unauthorized', handler)
  }, [logout])

  const isAdmin = user?.rol === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
