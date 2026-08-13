import { describe, it, expect } from 'vitest'
import { parseApiError } from './parseApiError'

describe('parseApiError', () => {
  it('extrae error del campo error', () => {
    const err = { response: { data: { error: 'Email inválido' } } }
    expect(parseApiError(err)).toBe('Email inválido')
  })

  it('cae en message si no hay error', () => {
    const err = { response: { data: { message: 'Not found' } } }
    expect(parseApiError(err)).toBe('Not found')
  })

  it('usa fallback cuando no hay response', () => {
    expect(parseApiError(new Error('network'))).toBe('Error inesperado')
  })

  it('acepta fallback personalizado', () => {
    expect(parseApiError(null, 'Falló la operación')).toBe('Falló la operación')
  })

  it('prioriza error sobre message', () => {
    const err = { response: { data: { error: 'A', message: 'B' } } }
    expect(parseApiError(err)).toBe('A')
  })

  it('devuelve fallback si err es undefined', () => {
    expect(parseApiError(undefined)).toBe('Error inesperado')
  })
})
