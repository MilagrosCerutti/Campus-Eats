import { useState, useEffect, useCallback } from 'react'
import adminService from '../services/adminService'
import { PAGE_SIZES } from '@/shared/constants'
import { buildPedidoParams, DEFAULT_PEDIDO_FILTERS } from '@/features/pedidos/utils/queryParams'

export function useAdminPedidos(initialFilters = {}) {
  const [data, setData] = useState({
    pedidos: [],
    total: 0,
    page: 1,
    limit: PAGE_SIZES.adminPedidos,
  })
  const [filters, setFilters] = useState({
    ...DEFAULT_PEDIDO_FILTERS,
    limit: PAGE_SIZES.adminPedidos,
    ...initialFilters,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    adminService
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

  const updateRow = useCallback((updated) => {
    setData((prev) => ({
      ...prev,
      pedidos: prev.pedidos.map((p) => (p.id === updated.id ? updated : p)),
    }))
  }, [])

  return { ...data, isLoading, error, filters, setFilters, refetch, updateRow }
}
