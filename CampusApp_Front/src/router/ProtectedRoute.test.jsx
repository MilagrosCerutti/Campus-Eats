import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Mock useAuth — the barrel at @/context/AuthContext re-exports from features/auth
vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '@/context/AuthContext'

function renderWithRouter(authValue, initialPath = '/protected') {
  useAuth.mockReturnValue(authValue)
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<div>Contenido protegido</div>} />
        </Route>
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('muestra contenido cuando el usuario está autenticado', () => {
    renderWithRouter({ user: { id: 1, nombre: 'Test', rol: 'usuario' }, isLoading: false })
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('redirige a /login cuando no hay usuario', () => {
    renderWithRouter({ user: null, isLoading: false })
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('muestra spinner mientras carga', () => {
    renderWithRouter({ user: null, isLoading: true })
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })
})
