import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('llama a onSubmit con email y password válidos', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} isLoading={false} error={null} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'mipassword')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { email: 'test@test.com', password: 'mipassword' },
        expect.anything()
      )
    })
  })

  it('muestra error de email inválido sin llamar a onSubmit', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} isLoading={false} error={null} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'no-es-email')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'pass')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('muestra error de password requerido', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} isLoading={false} error={null} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@test.com')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('muestra el error del servidor cuando error prop tiene valor', () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading={false} error="Credenciales incorrectas" />)
    expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument()
  })

  it('deshabilita el botón cuando isLoading es true', () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading={true} error={null} />)
    expect(screen.getByRole('button', { name: /verificando/i })).toBeDisabled()
  })
})
