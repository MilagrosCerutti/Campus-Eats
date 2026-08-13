import { describe, it, expect } from 'vitest'
import { formatDate, formatDateFull, todayISO } from './formatDate'

describe('formatDate', () => {
  it('devuelve — para string vacío', () => {
    expect(formatDate('')).toBe('—')
  })

  it('devuelve — para null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('devuelve un string no vacío para fecha válida', () => {
    const result = formatDate('2026-06-13')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
    expect(result).not.toBe('—')
  })

  it('incluye el día numérico correcto', () => {
    const result = formatDate('2026-06-13')
    expect(result).toContain('13')
  })
})

describe('formatDateFull', () => {
  it('devuelve — para string vacío', () => {
    expect(formatDateFull('')).toBe('—')
  })

  it('incluye el año para fecha válida', () => {
    const result = formatDateFull('2026-06-13')
    expect(result).toContain('2026')
  })
})

describe('todayISO', () => {
  it('devuelve formato YYYY-MM-DD', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
