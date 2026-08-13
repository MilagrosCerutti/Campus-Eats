import { describe, expect, it } from 'vitest'
import { getHistoryChanges } from './historyChanges'
import { formatCurrency } from '@/shared/utils'

describe('getHistoryChanges', () => {
  it('traduce menu, cantidad y total de una edicion', () => {
    const changes = getHistoryChanges({
      accion: 'edicion',
      valorAnterior: { menuId: 5, cantidad: 1, total: 800 },
      valorNuevo: { menuId: 6, cantidad: 2, total: 1900 },
    })

    expect(changes).toEqual([
      { key: 'menuId', label: 'Menú', previous: '5', next: '6' },
      { key: 'cantidad', label: 'Cantidad', previous: '1', next: '2' },
      { key: 'total', label: 'Total', previous: formatCurrency(800), next: formatCurrency(1900) },
    ])
  })
})
