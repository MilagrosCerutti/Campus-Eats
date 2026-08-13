import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  Ban, Calendar, Check, Clock, Edit2, Hash, Hourglass, MapPin,
  PackageCheck, ReceiptText, ShieldCheck, StickyNote, UtensilsCrossed, Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateFull, formatCurrency, getMenuImageUrl } from '@/shared/utils'
import { buttonVariants } from '@/components/ui/button'
import StatusBadge from './StatusBadge'
import CancelButton from './CancelButton'
import HistorialTimeline from './HistorialTimeline'
import { CANCELABLE_ESTADOS, EDITABLE_ESTADOS } from '../constants'

/* ─── STATUS HERO ─────────────────────────────────────────────────── */

const STATUS_HERO_CONFIG = {
  entregado: {
    Icon:     PackageCheck,
    title:    '¡Tu pedido fue entregado!',
    sub:      'Ya retiraste tu vianda. ¡Buen provecho!',
    gradient: 'from-sky-500/[0.07]',
    border:   'border-sky-400/20',
    iconBg:   'bg-sky-500/10 text-sky-600 border-sky-400/25',
    text:     'text-sky-700',
  },
  confirmado: {
    Icon:     ShieldCheck,
    title:    'Pedido confirmado',
    sub:      'Tu pedido está confirmado. Preparate para el retiro.',
    gradient: 'from-emerald-500/[0.07]',
    border:   'border-emerald-400/20',
    iconBg:   'bg-emerald-500/10 text-emerald-600 border-emerald-400/25',
    text:     'text-emerald-700',
  },
  pendiente: {
    Icon:     Hourglass,
    title:    'Esperando confirmación',
    sub:      'Tu pedido está en revisión. Te avisamos apenas se confirme.',
    gradient: 'from-amber-400/[0.07]',
    border:   'border-amber-400/20',
    iconBg:   'bg-amber-500/10 text-amber-600 border-amber-400/25',
    text:     'text-amber-700',
    pulse:    true,
  },
  cancelado: {
    Icon:     Ban,
    title:    'Pedido cancelado',
    sub:      'Este pedido fue cancelado y ya no está activo.',
    gradient: 'from-[#D98268]/[0.06]',
    border:   'border-[#D98268]/20',
    iconBg:   'bg-[#D98268]/10 text-[#B35A3D] border-[#D98268]/25',
    text:     'text-[#9A4A30]',
  },
}

function StatusHero({ pedido }) {
  const cfg = STATUS_HERO_CONFIG[pedido.estado] ?? STATUS_HERO_CONFIG.pendiente
  const { Icon } = cfg

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border p-5 overflow-hidden bg-gradient-to-r to-transparent',
        cfg.gradient,
        cfg.border
      )}
    >
      <div className="flex items-start gap-4">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.32, type: 'spring', stiffness: 260, damping: 18 }}
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-2xl border',
            cfg.iconBg,
            cfg.pulse && 'animate-pulse'
          )}
        >
          <Icon className="size-7" />
        </motion.div>
        <div className="min-w-0 pt-0.5">
          <p className={cn('text-base font-bold leading-tight', cfg.text)}>{cfg.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{cfg.sub}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── PHASE ROADMAP ───────────────────────────────────────────────── */

const ROADMAP_STEPS = [
  { key: 'pendiente',  label: 'Pedido realizado', Icon: Hourglass,   desc: 'Pedido enviado'    },
  { key: 'confirmado', label: 'Confirmado',       Icon: ShieldCheck, desc: 'Listo para retirar' },
  { key: 'entregado',  label: 'Entregado',        Icon: PackageCheck, desc: 'Vianda retirada'  },
]

function PhaseRoadmap({ estado, historial = [] }) {
  const isCancelled  = estado === 'cancelado'
  const wasConfirmed = historial.some((e) => e.accion === 'estado:pendiente->confirmado')
  const currentIdx   = isCancelled ? -1 : ROADMAP_STEPS.findIndex((s) => s.key === estado)

  const steps = isCancelled
    ? [...ROADMAP_STEPS, { key: 'cancelado', label: 'Cancelado', Icon: Ban, desc: 'Pedido cancelado' }]
    : ROADMAP_STEPS

  function stepStatus(idx) {
    if (!isCancelled) {
      if (idx < currentIdx) return 'done'
      if (idx === currentIdx) return 'current'
      return 'future'
    }
    if (idx === 0) return 'done'
    if (idx === 1) return wasConfirmed ? 'done' : 'skipped'
    if (idx === 2) return 'skipped'
    return 'cancelled'
  }

  function iconClass(status) {
    if (status === 'done')      return 'border-emerald-500 bg-emerald-500/15 text-emerald-500'
    if (status === 'current')   return 'border-primary bg-primary/15 text-primary'
    if (status === 'cancelled') return 'border-destructive bg-destructive/10 text-destructive'
    return 'border-border bg-secondary/50 text-muted-foreground/30'
  }

  function labelClass(status) {
    if (status === 'done')      return 'text-emerald-500'
    if (status === 'current')   return 'text-foreground font-bold'
    if (status === 'cancelled') return 'text-destructive'
    return 'text-muted-foreground/40'
  }

  function connectorColor(toIdx) {
    const s = stepStatus(toIdx)
    if (s === 'done')    return 'bg-emerald-500/50'
    if (s === 'current') return 'bg-primary/30'
    return 'bg-border'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <p className="mb-5 font-orbitron text-[9px] tracking-[0.4em] uppercase text-primary">
        Progreso del pedido
      </p>

      <div className="flex items-start">
        {steps.map((step, idx) => {
          const status = stepStatus(idx)
          const Icon   = step.Icon
          const isLast = idx === steps.length - 1

          return (
            <Fragment key={step.key}>
              {/* Step */}
              <div className="flex flex-1 flex-col items-center text-center">
                {/* Icon row with half-lines — always rendered to keep icon centered */}
                <div className="flex w-full items-center">
                  <div className={cn('h-px flex-1 transition-colors', idx > 0 ? connectorColor(idx) : 'invisible')} />
                  <div className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300',
                    iconClass(status),
                    status === 'current' && estado === 'pendiente' && 'animate-pulse'
                  )}>
                    {status === 'done'
                      ? <Check className="size-3.5" />
                      : <Icon className="size-3.5" />
                    }
                  </div>
                  <div className={cn('h-px flex-1 transition-colors', !isLast ? connectorColor(idx + 1) : 'invisible')} />
                </div>

                {/* Labels */}
                <span className={cn(
                  'mt-2 font-orbitron text-[9px] tracking-wider uppercase leading-tight transition-colors',
                  labelClass(status)
                )}>
                  {step.label}
                </span>
                <span className="mt-0.5 hidden text-[9px] leading-tight text-muted-foreground/50 sm:block">
                  {step.desc}
                </span>
              </div>
            </Fragment>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ─── MENU INFO CARD ──────────────────────────────────────────────── */

function MenuInfoCard({ menu, pedido }) {
  const [imgFailed, setImgFailed] = useState(false)
  const imageUrl = menu?.imagenUrl ? getMenuImageUrl(menu.imagenUrl) : null
  const hasImage = imageUrl && !imgFailed
  const hasDesc  = Boolean(menu?.descripcion)

  if (!hasImage && !hasDesc) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3"
    >
      {hasImage && (
        <img
          src={imageUrl}
          alt={pedido.menuNombre}
          className="h-16 w-16 shrink-0 rounded-xl object-cover border border-border"
          onError={() => setImgFailed(true)}
        />
      )}
      <div className="min-w-0 py-0.5">
        <div className="mb-1 flex items-center gap-1.5">
          <UtensilsCrossed className="size-2.5 text-primary shrink-0" />
          <span className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
            Menú seleccionado
          </span>
        </div>
        <p className="font-semibold text-foreground leading-snug">{pedido.menuNombre}</p>
        {hasDesc && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {menu.descripcion}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/* ─── INFO ITEM ───────────────────────────────────────────────────── */

const infoContainerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
}
const infoItemVariants = {
  hidden:   { opacity: 0, y: 8 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
}

function InfoItem({ icon: Icon, label, value, emphasis = false, muted = false }) {
  return (
    <motion.div variants={infoItemVariants} className="rounded-lg border border-border/70 bg-secondary/35 p-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3 h-3 text-primary" />
        <span className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
          {label}
        </span>
      </div>
      <div className={cn(
        'break-words text-sm',
        emphasis ? 'font-orbitron text-base font-bold text-foreground'
          : muted ? 'text-muted-foreground italic'
          : 'text-foreground'
      )}>
        {value}
      </div>
    </motion.div>
  )
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────── */

export default function PedidoDetail({ pedido, historial, menu, onCanceled }) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <StatusHero key={pedido.estado} pedido={pedido} />
      </AnimatePresence>

      <PhaseRoadmap estado={pedido.estado} historial={historial} />

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main info */}
        <div className="min-w-0 space-y-4">
          <MenuInfoCard menu={menu} pedido={pedido} />

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_48px_-42px_rgba(57,48,35,0.75)]">
            <div className="flex flex-col gap-4 border-b border-border bg-secondary/35 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                  <ReceiptText className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
                    Pedido #{pedido.id}
                  </p>
                  <h2 className="mt-1 truncate text-lg font-bold text-foreground sm:text-xl">
                    {pedido.menuNombre}
                  </h2>
                  {pedido.usuarioNombre && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Solicitado por: {pedido.usuarioNombre}
                    </p>
                  )}
                </div>
              </div>
              <StatusBadge estado={pedido.estado} />
            </div>

            <motion.div
              variants={infoContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 p-5"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InfoItem icon={Calendar} label="Fecha"    value={formatDateFull(pedido.fecha)} />
                <InfoItem icon={Clock}    label="Turno"    value={<span className="capitalize">{pedido.turnoEntrega}</span>} />
                <InfoItem icon={Users}    label="Cantidad" value={`x${pedido.cantidad}`} />
                <InfoItem icon={Hash}     label="Total"    emphasis value={formatCurrency(pedido.total)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={MapPin}
                  label="Sede"
                  value={
                    <span className="block">
                      <span className="block">{pedido.puntoRetiroNombre ?? pedido.sedeNombre ?? pedido.sede?.nombre ?? pedido.puntoRetiro ?? '—'}</span>
                      {(pedido.puntoRetiroDireccion ?? pedido.sedeDireccion ?? pedido.sede?.direccion) && (
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {pedido.puntoRetiroDireccion ?? pedido.sedeDireccion ?? pedido.sede?.direccion}
                        </span>
                      )}
                    </span>
                  }
                />
                <InfoItem icon={StickyNote} label="Observaciones" value={pedido.observaciones || 'Sin observaciones'} muted={!pedido.observaciones} />
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          {(EDITABLE_ESTADOS.includes(pedido.estado) || CANCELABLE_ESTADOS.includes(pedido.estado)) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="order-detail-actions"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">Acciones disponibles</p>
                <p className="text-xs text-muted-foreground">Podés modificar el pedido mientras siga activo.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {EDITABLE_ESTADOS.includes(pedido.estado) && (
                  <Link
                    to={`/pedidos/${pedido.id}/editar`}
                    className={cn(buttonVariants({ variant: 'default' }), 'gap-1.5')}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar pedido
                  </Link>
                )}
                {CANCELABLE_ESTADOS.includes(pedido.estado) && (
                  <CancelButton pedidoId={pedido.id} onSuccess={onCanceled} />
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Timeline */}
        <div className="min-w-0">
          <HistorialTimeline historial={historial} />
        </div>
      </div>
    </div>
  )
}
