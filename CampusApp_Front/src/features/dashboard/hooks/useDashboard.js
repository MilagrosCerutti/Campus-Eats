import { useState, useEffect } from 'react'
import pedidoService from '@/features/pedidos/services/pedidoService'
import menuService from '@/features/menus/services/menuService'
import { todayISO } from '@/shared/utils'

export function useDashboard() {
  const [pedidos, setPedidos]  = useState([])
  const [menus, setMenus]      = useState([])
  const [total, setTotal]      = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]      = useState(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    Promise.all([
      pedidoService.getPedidos({ limit: 100, page: 1 }),
      menuService.getMenus({ fecha: todayISO() }),
    ])
      .then(([pedidosData, menusData]) => {
        if (cancelled) return
        setPedidos(pedidosData.pedidos ?? [])
        setTotal(pedidosData.total ?? 0)
        setMenus((menusData ?? []).filter((m) => m.activo))
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar los datos del panel.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  const nextPedido   = pedidos.find((p) => p.estado === 'pendiente' || p.estado === 'confirmado')
  const pendingCount = pedidos.filter((p) => p.estado === 'pendiente').length
  const confirmedCount = pedidos.filter((p) => p.estado === 'confirmado').length

  return { pedidos, menus, total, nextPedido, pendingCount, confirmedCount, isLoading, error }
}
