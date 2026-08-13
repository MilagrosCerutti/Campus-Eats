import { describe, expect, it } from 'vitest'
import { buildPedidoParams, hasPedidoFilters } from './queryParams'

describe('buildPedidoParams', () => {
  it('envia paginacion y ordenamiento aunque no haya filtros', () => {
    expect(
      buildPedidoParams({
        page: 2,
        limit: 15,
        sortBy: 'total',
        order: 'asc',
      })
    ).toEqual({
      page: 2,
      limit: 15,
      sortBy: 'total',
      order: 'asc',
    })
  })

  it('normaliza y combina todos los filtros admitidos por la API', () => {
    expect(
      buildPedidoParams({
        estado: 'confirmado',
        fecha: '2030-02-15',
        menuId: '5',
        tipo: 'vegano',
        page: 1,
        limit: 10,
        sortBy: 'fecha',
        order: 'desc',
      })
    ).toMatchObject({
      estado: 'confirmado',
      fecha: '2030-02-15',
      menuId: 5,
      tipo: 'vegano',
    })
  })
})

describe('hasPedidoFilters', () => {
  it('ignora paginacion y ordenamiento al detectar filtros activos', () => {
    expect(hasPedidoFilters({ page: 1, limit: 10, sortBy: 'fecha', order: 'desc' })).toBe(false)
    expect(hasPedidoFilters({ tipo: 'sin_tacc' })).toBe(true)
  })
})
