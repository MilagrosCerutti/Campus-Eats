import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { todayISO } from '@/shared/utils'
import menuService from '@/features/menus/services/menuService'
import sedeService from '@/features/sedes/services/sedeService'

const createSchema = z.object({
  menuId: z.coerce.number().min(1, 'Seleccione un menú'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  cantidad: z.coerce.number().min(1, 'Mínimo 1').max(10, 'Máximo 10'),
  turnoEntrega: z.enum(['almuerzo', 'cena'], { required_error: 'Seleccione un turno' }),
  puntoRetiroId: z.coerce.number().min(1, 'Seleccione una sede'),
  observaciones: z.string().max(500).optional(),
})

const editSchema = z.object({
  menuId: z.coerce.number().min(1, 'Seleccione un menú'),
  cantidad: z.coerce.number().min(1, 'Mínimo 1').max(10, 'Máximo 10'),
  turnoEntrega: z.enum(['almuerzo', 'cena'], { required_error: 'Seleccione un turno' }),
  puntoRetiroId: z.coerce.number().min(1, 'Seleccione una sede'),
  observaciones: z.string().max(500).optional(),
})

export function usePedidoForm({ defaultValues, isEdit = false }) {
  const [menus, setMenus] = useState([])
  const [loadingMenus, setLoadingMenus] = useState(!isEdit)
  const [menusError, setMenusError] = useState('')
  const [sedes, setSedes] = useState([])
  const [loadingSedes, setLoadingSedes] = useState(true)
  const [sedesError, setSedesError] = useState('')

  const form = useForm({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: isEdit
      ? {
          menuId: defaultValues?.menuId ?? '',
          fecha: defaultValues?.fecha ?? '',
          cantidad: defaultValues?.cantidad ?? 1,
          turnoEntrega: defaultValues?.turnoEntrega ?? '',
          puntoRetiroId: defaultValues?.puntoRetiroId ?? '',
          observaciones: defaultValues?.observaciones ?? '',
        }
      : {
          menuId: defaultValues?.menuId ?? '',
          fecha: defaultValues?.fecha ?? todayISO(),
          cantidad: defaultValues?.cantidad ?? 1,
          turnoEntrega: defaultValues?.turnoEntrega ?? '',
          puntoRetiroId: defaultValues?.puntoRetiroId ?? '',
          observaciones: defaultValues?.observaciones ?? '',
        },
  })

  const watchFecha = form.watch('fecha')
  const watchMenuId = form.watch('menuId')
  const watchCantidad = form.watch('cantidad')

  useEffect(() => {
    let cancelled = false
    setSedesError('')
    sedeService
      .getSedes({ activo: 1 })
      .then((data) => {
        if (!cancelled) setSedes(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) {
          setSedes([])
          setSedesError('No se pudieron cargar las sedes. Reintentá antes de confirmar el pedido.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSedes(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!watchFecha) return
    let cancelled = false
    setLoadingMenus(true)
    setMenusError('')
    menuService
      .getMenus({ fecha: watchFecha, activo: 1 })
      .then((data) => {
        if (!cancelled) setMenus(data)
      })
      .catch(() => {
        if (!cancelled) {
          setMenus([])
          setMenusError('No se pudieron cargar los menús para la fecha seleccionada.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingMenus(false)
      })
    return () => {
      cancelled = true
    }
  }, [watchFecha])

  const selectedMenu = useMemo(
    () => menus.find((m) => String(m.id) === String(watchMenuId)) ?? null,
    [menus, watchMenuId]
  )

  const total = selectedMenu ? selectedMenu.precio * (watchCantidad || 0) : 0
  const canSubmit = !sedesError && !menusError && menus.length > 0

  return {
    form,
    menus,
    loadingMenus,
    menusError,
    sedes,
    loadingSedes,
    sedesError,
    selectedMenu,
    total,
    canSubmit,
  }
}
