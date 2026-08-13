export function formatDate(dateString) {
  if (!dateString) return '—'
  const [y, m, d] = dateString.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
}

export function formatDateFull(dateString) {
  if (!dateString) return '—'
  const [y, m, d] = dateString.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}
