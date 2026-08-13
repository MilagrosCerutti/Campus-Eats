import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AdminRoute from './AdminRoute'

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '@/context/AuthContext'

function renderWithRouter(authValue, initialPath = '/admin') {
  useAuth.mockReturnValue(authValue)
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<div>Panel admin</div>} />
        </Route>
        <Route path="/login"   element={<div>Login</div>} />
        <Route path="/pedidos" element={<div>Pedidos</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('AdminRoute', () => {
  it('muestra el panel cuando el usuario es admin', () => {
    renderWithRouter({ user: { id: 1, rol: 'admin' }, isAdmin: true, isLoading: false })
    expect(screen.getByText('Panel admin')).toBeInTheDocument()
  })

  it('redirige a /login cuando no hay usuario', () => {
    renderWithRouter({ user: null, isAdmin: false, isLoading: false })
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.queryByText('Panel admin')).not.toBeInTheDocument()
  })

  it('redirige a /pedidos cuando el usuario no es admin', () => {
    renderWithRouter({ user: { id: 2, rol: 'usuario' }, isAdmin: false, isLoading: false })
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
    expect(screen.queryByText('Panel admin')).not.toBeInTheDocument()
  })

  it('muestra spinner mientras carga', () => {
    renderWithRouter({ user: null, isAdmin: false, isLoading: true })
    expect(screen.queryByText('Panel admin')).not.toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })
})
