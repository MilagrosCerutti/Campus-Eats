export const LEVELS = [
  { level: 1, min: 0,  emoji: '🌱', nombre: 'Primera Vianda' },
  { level: 2, min: 3,  emoji: '🥗', nombre: 'Habitual' },
  { level: 3, min: 8,  emoji: '🍱', nombre: 'Explorador Gastronómico' },
  { level: 4, min: 15, emoji: '⭐', nombre: 'Foodie del Campus' },
  { level: 5, min: 25, emoji: '🏆', nombre: 'Referente del Campus' },
  { level: 6, min: 40, emoji: '👑', nombre: 'Leyenda del Campus' },
]

export function getLevelInfo(totalPedidos = 0) {
  const pedidos = Math.max(0, totalPedidos)
  const foundLevel = [...LEVELS].reverse().find((l) => pedidos >= l.min)
  const currentIndex = foundLevel ? foundLevel.level - 1 : 0
  const current = LEVELS[currentIndex]
  const next = LEVELS[currentIndex + 1] ?? null

  const rangeStart = current.min
  const rangeEnd = next ? next.min : rangeStart
  const progressPct = next
    ? Math.min(100, Math.round(((pedidos - rangeStart) / (rangeEnd - rangeStart)) * 100))
    : 100
  const pedidosParaSiguiente = next ? Math.max(0, next.min - pedidos) : 0

  return { current, next, pedidos, progressPct, pedidosParaSiguiente }
}
