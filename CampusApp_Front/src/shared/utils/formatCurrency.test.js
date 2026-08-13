import { describe, it, expect } from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('formatea entero como ARS', () => {
    const result = formatCurrency(1500)
    expect(result).toContain('1.500')
  })

  it('devuelve — para null', () => {
    expect(formatCurrency(null)).toBe('—')
  })

  it('devuelve — para undefined', () => {
    expect(formatCurrency(undefined)).toBe('—')
  })

  it('devuelve — para NaN', () => {
    expect(formatCurrency(NaN)).toBe('—')
  })

  it('formatea cero', () => {
    const result = formatCurrency(0)
    expect(result).toBeTruthy()
    expect(result).not.toBe('—')
  })
})
