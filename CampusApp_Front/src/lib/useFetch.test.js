import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useFetch } from './useFetch'

describe('useFetch', () => {
  it('devuelve data tras fetch exitoso', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ id: 1, nombre: 'Test' })
    const { result } = renderHook(() => useFetch(fetchFn))

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toEqual({ id: 1, nombre: 'Test' })
    expect(result.current.error).toBeNull()
  })

  it('devuelve error cuando el fetch falla', async () => {
    const fetchFn = vi.fn().mockRejectedValue({
      response: { data: { error: 'No autorizado' } },
    })
    const { result } = renderHook(() => useFetch(fetchFn))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('No autorizado')
  })

  it('re-ejecuta el fetch al llamar refetch', async () => {
    const fetchFn = vi.fn().mockResolvedValue('data')
    const { result } = renderHook(() => useFetch(fetchFn))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(fetchFn).toHaveBeenCalledTimes(1)

    result.current.refetch()
    await waitFor(() => expect(fetchFn).toHaveBeenCalledTimes(2))
  })
})
