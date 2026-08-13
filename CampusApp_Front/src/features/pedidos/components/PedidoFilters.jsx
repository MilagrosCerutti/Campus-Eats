import { useEffect, useState } from 'react'
import { ArrowDownUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ESTADOS_FILTER } from '../constants'
import { DateInput } from '@/components/ui/date-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TIPOS_FILTER } from '@/features/menus/constants'
import menuService from '@/features/menus/services/menuService'
import { DEFAULT_PEDIDO_FILTERS, hasPedidoFilters } from '../utils/queryParams'

const ESTADO_ACTIVE = {
  '': 'bg-[#E11D48]/10 border-[#E11D48]/40 text-[#E11D48]',
  pendiente: 'bg-[#FACC15]/10 border-[#FACC15]/35 text-[#FACC15]',
  confirmado: 'bg-[#38BDF8]/10 border-[#38BDF8]/35 text-[#38BDF8]',
  entregado: 'bg-[#22C55E]/10 border-[#22C55E]/35 text-[#22C55E]',
  cancelado: 'bg-[#EF4444]/10 border-[#EF4444]/35 text-[#EF4444]',
}

export default function PedidoFilters({ filters, onChange }) {
  const [menus, setMenus] = useState([])
  const [menuError, setMenuError] = useState('')
  const hasActive = hasPedidoFilters(filters)
  const tipoItems = TIPOS_FILTER.map(({ value, label }) => ({ value: value || 'todos', label }))
  const menuItems = [
    { value: 'todos', label: 'Todos los menús' },
    ...menus.map((menu) => ({ value: String(menu.id), label: menu.nombre })),
  ]
  const sortItems = [
    { value: 'fecha:desc', label: 'Fecha: más reciente' },
    { value: 'fecha:asc', label: 'Fecha: más antigua' },
    { value: 'estado:asc', label: 'Estado: A-Z' },
    { value: 'estado:desc', label: 'Estado: Z-A' },
    { value: 'total:desc', label: 'Total: mayor primero' },
    { value: 'total:asc', label: 'Total: menor primero' },
  ]

  useEffect(() => {
    let cancelled = false
    Promise.all([menuService.getMenus({ activo: 1 }), menuService.getMenus({ activo: 0 })])
      .then(([activeMenus, inactiveMenus]) => {
        if (!cancelled) {
          const byId = new Map([...activeMenus, ...inactiveMenus].map((menu) => [menu.id, menu]))
          setMenus([...byId.values()].sort((a, b) => a.nombre.localeCompare(b.nombre)))
        }
      })
      .catch(() => {
        if (!cancelled) setMenuError('No se pudieron cargar los menús para filtrar.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  function updateSort(value) {
    const [sortBy, order] = value.split(':')
    onChange({ ...filters, sortBy, order, page: 1 })
  }

  return (
    <div className="filter-console flex flex-col gap-3">
      {/* Estado pills */}
      <div className="flex flex-wrap gap-2">
        {ESTADOS_FILTER.map(({ value, label }) => {
          const active = filters.estado === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...filters, estado: value, page: 1 })}
              className={cn(
                'px-3.5 py-1.5 rounded-md border text-sm font-medium transition-all duration-150',
                active
                  ? ESTADO_ACTIVE[value]
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {/* Date */}
        <div className="min-w-0">
          <DateInput
            value={filters.fecha ?? ''}
            onChange={(e) => onChange({ ...filters, fecha: e.target.value, page: 1 })}
            aria-label="Filtrar por fecha"
          />
        </div>

        <Select
          value={filters.tipo || 'todos'}
          onValueChange={(value) =>
            onChange({ ...filters, tipo: value === 'todos' ? '' : value, page: 1 })
          }
          items={tipoItems}
        >
          <SelectTrigger className="w-full" aria-label="Filtrar por tipo de menú">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {tipoItems.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(filters.menuId || 'todos')}
          onValueChange={(value) =>
            onChange({ ...filters, menuId: value === 'todos' ? '' : value, page: 1 })
          }
          items={menuItems}
          disabled={Boolean(menuError)}
        >
          <SelectTrigger className="w-full" aria-label="Filtrar por menú">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {menuItems.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${filters.sortBy}:${filters.order}`}
          onValueChange={updateSort}
          items={sortItems}
        >
          <SelectTrigger className="w-full" aria-label="Ordenar pedidos">
            <ArrowDownUp className="size-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {sortItems.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActive && (
          <button
            type="button"
            onClick={() => onChange({ ...DEFAULT_PEDIDO_FILTERS, limit: filters.limit })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </div>
      {menuError && (
        <p role="alert" className="text-xs text-destructive">
          {menuError}
        </p>
      )}
    </div>
  )
}
