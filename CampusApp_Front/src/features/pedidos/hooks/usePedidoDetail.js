import { useState, useEffect, useCallback } from 'react'
import pedidoService from '../services/pedidoService'
import menuService from '@/features/menus/services/menuService'

async function fetchMenuForPedido(pedido) {
  // Intento 1: endpoint individual /menus/:id (solo accesible para admin;
  // para el resto es un intento silencioso, el fallback de abajo cubre el resto)
  if (pedido.menuId) {
    try {
      return await menuService.getMenu(pedido.menuId, { silent403: true })
    } catch {
      // sigue con fallback
    }
  }

  // Intento 2: buscar en la lista por fecha y matchear por id o nombre
  if (pedido.fecha) {
    try {
      const list = await menuService.getMenus({ fecha: pedido.fecha })
      if (!Array.isArray(list)) return null
      return (
        list.find((m) => pedido.menuId && String(m.id) === String(pedido.menuId)) ??
        list.find((m) => m.nombre === pedido.menuNombre) ??
        null
      )
    } catch {
      return null
    }
  }

  return null
}

export function usePedidoDetail(id) {
  const [pedido, setPedido]       = useState(null)
  const [historial, setHistorial] = useState([])
  const [menu, setMenu]           = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)
  const [tick, setTick]           = useState(0)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setIsLoading(true)
    setError(null)
    Promise.all([
      pedidoService.getPedido(id),
      pedidoService.getHistorial(id),
    ])
      .then(([p, h]) => {
        if (!cancelled) {
          setPedido(p)
          setHistorial(h)
          fetchMenuForPedido(p).then((m) => { if (!cancelled) setMenu(m) })
        }
      })
      .catch((err) => { if (!cancelled) setError(err.response?.data?.error ?? 'Error al cargar el pedido') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [id, tick])

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  const refetchHistorial = useCallback(() => {
    if (!id) return
    return pedidoService.getHistorial(id).then(setHistorial)
  }, [id])

  return { pedido, historial, menu, isLoading, error, refetch, refetchHistorial, setPedido }
}
