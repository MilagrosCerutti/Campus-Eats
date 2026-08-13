import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { getHistoryChanges } from '../utils/historyChanges'

const ACTION_LABELS = {
  creacion: { label: 'Pedido realizado', color: 'bg-primary' },
  edicion: { label: 'Edición', color: 'bg-sky-500' },
  'estado:pendiente->confirmado': { label: 'Confirmado — en preparación', color: 'bg-emerald-500' },
  'estado:pendiente->cancelado': { label: 'Cancelado (desde pendiente)', color: 'bg-destructive' },
  'estado:confirmado->cancelado': {
    label: 'Cancelado (desde confirmado)',
    color: 'bg-destructive',
  },
  'estado:confirmado->entregado': { label: 'Entregado', color: 'bg-sky-500' },
}

export default function HistorialTimeline({ historial }) {
  if (!historial?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-border bg-card p-4 shadow-[0_18px_48px_-42px_rgba(57,48,35,0.75)]"
    >
      <p className="mb-5 font-orbitron text-[9px] tracking-[0.4em] uppercase text-primary">
        Historial
      </p>

      <div className="relative pl-4">
        <div className="absolute bottom-2 left-1.5 top-2 w-px bg-border" />

        <div className="space-y-4">
          {historial.map((entry, i) => {
            const cfg = ACTION_LABELS[entry.accion] ?? {
              label: entry.accion,
              color: 'bg-muted-foreground',
            }
            const date = new Date(entry.fechaHora)
            const isFirst = i === 0
            const changes = getHistoryChanges(entry)

            return (
              <motion.div
                key={entry.id ?? i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div
                  className={cn(
                    'absolute -left-[11px] top-[14px] size-2.5 rounded-full border-2 border-card',
                    cfg.color
                  )}
                />

                <div
                  className={cn(
                    'space-y-1.5 rounded-lg border border-border/70 bg-secondary/35 p-3',
                    isFirst && 'border-primary/20 bg-primary/[0.04]'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        'font-orbitron text-[10px] tracking-wider',
                        isFirst ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {cfg.label}
                    </span>
                    <time className="shrink-0 text-[10px] leading-tight text-muted-foreground">
                      {date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}{' '}
                      {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>

                  {entry.usuarioNombre && (
                    <p className="text-[10px] text-muted-foreground">por {entry.usuarioNombre}</p>
                  )}

                  {changes.length > 0 && (
                    <div className="mt-2 space-y-1 border-l-2 border-primary/25 pl-2 text-[10px] text-muted-foreground">
                      {changes.map((change) => (
                        <div key={change.key}>
                          <span className="text-foreground/60">{change.label}:</span>{' '}
                          <span className="line-through opacity-50">{change.previous}</span>
                          {' → '}
                          <span className="text-foreground">{change.next}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
