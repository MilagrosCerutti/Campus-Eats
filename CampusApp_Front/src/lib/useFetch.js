import { useState, useEffect, useCallback } from 'react'

/**
 * Generic data-fetching hook with race-condition guard and refetch support.
 *
 * @param {() => Promise<T>} fetchFn - Stable function (wrap in useCallback at call site).
 * @returns {{ data: T|null, isLoading: boolean, error: string|null, refetch: () => void }}
 */
export function useFetch(fetchFn) {
  const [data, setData]         = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]       = useState(null)
  const [tick, setTick]         = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    fetchFn()
      .then((result) => { if (!cancelled) setData(result) })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.error ?? err?.response?.data?.message ?? err?.message ?? 'Error inesperado')
      })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [fetchFn, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { data, isLoading, error, refetch }
}
