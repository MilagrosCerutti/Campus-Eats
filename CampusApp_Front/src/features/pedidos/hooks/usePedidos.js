import { useState, useEffect, useCallback } from 'react'
import pedidoService from '../services/pedidoService'
import { PAGE_SIZES } from '@/shared/constants'
import { buildPedidoParams, DEFAULT_PEDIDO_FILTERS } from '../utils/queryParams'

export function usePedidos(initialFilters = {}) {
  const [data, setData] = useState({ pedidos: [], total: 0, page: 1, limit: PAGE_SIZES.pedidos })
  const [filters, setFilters] = useState({
    ...DEFAULT_PEDIDO_FILTERS,
    limit: PAGE_SIZES.pedidos,
    ...initialFilters,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    pedidoService
      .getPedidos(buildPedidoParams(filters))
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error ?? 'Error al cargar pedidos')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filters, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  return { ...data, isLoading, error, filters, setFilters, refetch }
}
