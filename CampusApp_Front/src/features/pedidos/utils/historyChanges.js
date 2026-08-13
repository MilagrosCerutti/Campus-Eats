import { formatCurrency } from '@/shared/utils'

const LABELS = {
  menuId: 'Menú',
  cantidad: 'Cantidad',
  turnoEntrega: 'Turno',
  puntoRetiroId: 'Sede',
  total: 'Total',
  observaciones: 'Observaciones',
}

function formatValue(key, value) {
  if (value === null || value === undefined || value === '') return 'Sin valor'
  if (key === 'total') return formatCurrency(value)
  return String(value)
}

export function getHistoryChanges(entry) {
  if (entry.accion !== 'edicion' || !entry.valorNuevo) return []

  return Object.entries(entry.valorNuevo)
    .filter(([key, value]) => entry.valorAnterior?.[key] !== value)
    .map(([key, value]) => ({
      key,
      label: LABELS[key] ?? key,
      previous: formatValue(key, entry.valorAnterior?.[key]),
      next: formatValue(key, value),
    }))
}
