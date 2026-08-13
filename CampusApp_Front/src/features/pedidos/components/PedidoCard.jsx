import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Calendar, Users, Clock, MapPin, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, formatCurrency } from '@/shared/utils'
import StatusBadge, { ESTADO_VISUAL } from './StatusBadge'
import { CANCELABLE_ESTADOS } from '../constants'
import CancelButton from './CancelButton'

function MetaItem({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="size-3.5 shrink-0 text-muted-foreground/70" />
      <span>{children}</span>
    </div>
  )
}

export default function PedidoCard({ pedido, onCanceled }) {
  const leftBorder = (ESTADO_VISUAL[pedido.estado] ?? ESTADO_VISUAL.pendiente).leftBorder

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={cn(
        'order-consumer-card overflow-hidden flex flex-col border-l-2 transition-colors duration-150',
        leftBorder
      )}
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-0.5 font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
              Pedido #{pedido.id}
            </p>
            <h3 className="truncate font-semibold leading-snug text-foreground">
              {pedido.menuNombre}
            </h3>
          </div>
          <StatusBadge estado={pedido.estado} className="shrink-0" />
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          <MetaItem icon={Calendar}>{formatDate(pedido.fecha)}</MetaItem>
          <MetaItem icon={Users}>×{pedido.cantidad}</MetaItem>
          <MetaItem icon={Clock}><span className="capitalize">{pedido.turnoEntrega}</span></MetaItem>
          <MetaItem icon={MapPin}>
            <span className="block truncate">
              {pedido.puntoRetiroNombre ?? pedido.sedeNombre ?? pedido.sede?.nombre ?? pedido.puntoRetiro ?? '—'}
            </span>
          </MetaItem>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3">
          <p className="font-orbitron text-base font-bold text-foreground">
            {formatCurrency(pedido.total)}
          </p>
          <div className="flex items-center gap-1.5">
            {CANCELABLE_ESTADOS.includes(pedido.estado) && (
              <CancelButton pedidoId={pedido.id} onSuccess={onCanceled} size="sm" />
            )}
            <Link
              to={`/pedidos/${pedido.id}`}
              className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary active:scale-[0.97]"
            >
              Detalle <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
