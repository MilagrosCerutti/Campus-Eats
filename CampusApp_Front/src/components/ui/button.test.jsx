import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it.each(['outline', 'ghost'])('mantiene texto visible en la variante %s', (variant) => {
    render(<Button variant={variant}>Administrar</Button>)

    expect(screen.getByRole('button')).toHaveClass('text-foreground')
  })
})
