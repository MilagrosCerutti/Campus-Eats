export const DEFAULT_PEDIDO_FILTERS = {
  estado: '',
  fecha: '',
  menuId: '',
  tipo: '',
  page: 1,
  limit: 10,
  sortBy: 'fecha',
  order: 'desc',
}

export function buildPedidoParams(filters) {
  const params = {
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy,
    order: filters.order,
  }

  if (filters.estado) params.estado = filters.estado
  if (filters.fecha) params.fecha = filters.fecha
  if (filters.menuId) params.menuId = Number(filters.menuId)
  if (filters.tipo) params.tipo = filters.tipo

  return params
}

export function hasPedidoFilters(filters) {
  return Boolean(filters.estado || filters.fecha || filters.menuId || filters.tipo)
}
