import { useState, useEffect, useMemo } from 'react'
import menuService from '../services/menuService'
import { PAGE_SIZES } from '@/shared/constants'
import { MENUS_UPDATED_EVENT } from '../utils/menuAvailability'

export function useMenus() {
  const [allMenus, setAllMenus] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshTick, setRefreshTick] = useState(0)
  const [filters, setFilters] = useState({ tipo: '', fecha: '', page: 1, limit: PAGE_SIZES.menus })

  // Re-fetch when tipo/fecha change — server filters reduce the payload
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    const params = {}
    if (filters.tipo) params.tipo = filters.tipo
    if (filters.fecha) params.fecha = filters.fecha

    menuService
      .getMenus(params)
      .then((data) => {
        if (!cancelled) setAllMenus(data ?? [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message ?? 'Error al cargar los menús')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [filters.tipo, filters.fecha, refreshTick])

  useEffect(() => {
    const refresh = () => setRefreshTick((tick) => tick + 1)
    window.addEventListener(MENUS_UPDATED_EVENT, refresh)
    return () => window.removeEventListener(MENUS_UPDATED_EVENT, refresh)
  }, [])

  // Client-side active guard + pagination (API may return inactive menus)
  const filteredMenus = useMemo(() => allMenus.filter((m) => m.activo), [allMenus])

  const total = filteredMenus.length
  const totalPages = Math.max(1, Math.ceil(total / filters.limit))
  const page = Math.min(filters.page, totalPages)
  const start = (page - 1) * filters.limit
  const menus = filteredMenus.slice(start, start + filters.limit)

  return { menus, allMenus, total, totalPages, page, isLoading, error, filters, setFilters }
}
