import { motion } from 'motion/react'
import { getLevelInfo } from '../levels'

export default function LevelProgressCard({ totalPedidos = 0 }) {
  const { current, next, pedidos, progressPct, pedidosParaSiguiente } = getLevelInfo(totalPedidos)

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="technical-label text-primary">Nivel {current.level}</p>
          <h2 className="mt-1 flex items-center gap-2 text-lg font-semibold text-foreground">
            <span aria-hidden="true">{current.emoji}</span> {current.nombre}
          </h2>
        </div>
        <span className="shrink-0 text-3xl" aria-hidden="true">{current.emoji}</span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {pedidos} pedido{pedidos !== 1 ? 's' : ''} realizado{pedidos !== 1 ? 's' : ''}
      </p>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full bg-primary"
        />
      </div>

      <p className="mt-2.5 text-xs text-muted-foreground">
        {next
          ? `¡Ya casi alcanzás el próximo nivel! Te faltan ${pedidosParaSiguiente} pedido${pedidosParaSiguiente !== 1 ? 's' : ''} para llegar a ${next.emoji} ${next.nombre}.`
          : '¡Llegaste al nivel máximo! Sos una leyenda del campus.'}
      </p>
    </div>
  )
}
