import { describe, expect, it } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import AccessDeniedDialog from './AccessDeniedDialog'

describe('AccessDeniedDialog', () => {
  it('muestra un diálogo cuando la API informa un error 403', () => {
    render(<AccessDeniedDialog />)

    act(() => {
      window.dispatchEvent(new CustomEvent('auth:forbidden', { detail: 'Solo administradores' }))
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Solo administradores')).toBeInTheDocument()
  })
})
