import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowRight, CalendarDays, Check, ChevronRight, Clock,
  MapPin, Plus, ReceiptText, UtensilsCrossed,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { useDashboard } from '../hooks/useDashboard'
import { TIPO_CONFIG } from '@/features/menus/constants'
import { formatDate, formatCurrency, getMenuImageUrl } from '@/shared/utils'
import { CardSkeleton } from '@/shared/components/Skeleton'
import StatusBadge from '@/features/pedidos/components/StatusBadge'
import EmptyState from '@/shared/components/EmptyState'
import ErrorMessage from '@/shared/components/ErrorMessage'

const ORDER_STEPS = [
  { id: 'pendiente',  label: 'Realizado'  },
  { id: 'confirmado', label: 'Confirmado' },
  { id: 'entregado',  label: 'Entregado'  },
]

const pageVariants = {
  hidden:   { opacity: 0 },
  visible:  { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
}
const sectionVariants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

function DashboardIntro({ user, today }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="system-dot" />
          <span className="technical-label">Menú del día disponible</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
          Hola 👋 {user?.nombre}, ¿qué vas a comer hoy?
        </h1>
        <p className="mt-1 text-sm capitalize text-muted-foreground">{today}</p>
      </div>
      <Link to="/pedidos/nuevo" className={cn(buttonVariants({ size: 'lg' }), 'gap-2 self-start sm:self-auto')}>
        <Plus className="size-4" /> Crear pedido
      </Link>
    </div>
  )
}

function MenuOfDayCard({ menu, featured = false, index = 0 }) {
  const [imageFailed, setImageFailed] = useState(false)
  const type      = TIPO_CONFIG[menu.tipo] ?? TIPO_CONFIG.clasico
  const available = menu.cupoDisponible ?? menu.cupoDiario
  const soldOut   = available < 1
  const percent   = menu.cupoDiario > 0
    ? Math.max(0, Math.min(100, (available / menu.cupoDiario) * 100))
    : 0
  const imageUrl = getMenuImageUrl(menu.imagenUrl)
  const hasImage = imageUrl && !imageFailed

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn('daily-menu-card', featured && 'daily-menu-card--featured', soldOut && 'opacity-55')}
    >
      <div className={cn('daily-menu-card__visual', hasImage && 'daily-menu-card__visual--image')}>
        {hasImage && (
          <img
            src={imageUrl}
            alt={menu.nombre}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className={cn('daily-menu-card__plate', hasImage && 'hidden')}>
          <UtensilsCrossed className="size-6" />
        </div>
        <span className={cn('daily-menu-card__type', type.badge)}>{type.label}</span>
        <span className="daily-menu-card__code">R-{String(menu.id).padStart(3, '0')}</span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold leading-snug text-foreground">{menu.nombre}</h3>
          {menu.descripcion && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {menu.descripcion}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <span className="technical-label">Por ración</span>
            <div className="mt-1 font-orbitron text-lg font-bold text-foreground">
              {formatCurrency(menu.precio)}
            </div>
          </div>
          <div className="text-right">
            <span className="technical-label">Disponibles</span>
            <div className={cn(
              'mt-1 text-sm font-semibold',
              soldOut ? 'text-red-400' : available <= 3 ? 'text-amber-500' : 'text-emerald-500'
            )}>
              {soldOut ? 'Agotado' : available}
            </div>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 + 0.25 }}
            className={cn(
              'h-full rounded-full',
              soldOut ? 'bg-border' : percent < 25 ? 'bg-red-400' : percent < 60 ? 'bg-amber-400' : 'bg-primary'
            )}
          />
        </div>

        <Link
          to={soldOut ? '/menus' : `/pedidos/nuevo?menuId=${menu.id}`}
          className={cn(
            'mt-4 flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-medium transition-colors',
            soldOut
              ? 'border-border text-muted-foreground'
              : 'border-border text-foreground hover:border-primary/40 hover:bg-primary/[0.06] active:scale-[0.98]'
          )}
        >
          <span>{soldOut ? 'Ver alternativas' : 'Elegir esta vianda'}</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </motion.article>
  )
}

function ActiveOrder({ pedido }) {
  if (!pedido) {
    return (
      <div className="order-tracker flex min-h-[280px] flex-col justify-between">
        <div>
          <span className="technical-label">Próxima entrega</span>
          <h2 className="mt-3 font-orbitron text-lg font-bold text-foreground">Sin pedido activo</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Elegí una vianda disponible y configurá tu sede.
          </p>
        </div>
        <Link to="/pedidos/nuevo" className={cn(buttonVariants(), 'w-full gap-2')}>
          <Plus className="size-4" /> Crear pedido
        </Link>
      </div>
    )
  }

  const activeIndex = ORDER_STEPS.findIndex((step) => step.id === pedido.estado)

  return (
    <div className="order-tracker">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="technical-label">Próxima entrega</span>
          <h2 className="mt-2 truncate text-lg font-semibold text-foreground">{pedido.menuNombre}</h2>
          <p className="mt-0.5 font-orbitron text-[8px] tracking-[0.25em] text-muted-foreground">
            PEDIDO #{pedido.id}
          </p>
        </div>
        <StatusBadge estado={pedido.estado} />
      </div>

      {pedido.estado !== 'cancelado' && (
        <div className="order-progress">
          {ORDER_STEPS.map((step, index) => {
            const complete = index <= activeIndex
            return (
              <div key={step.id} className="order-progress__step">
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: index * 0.12 + 0.18,
                    duration: 0.32,
                    type: 'spring',
                    stiffness: 280,
                    damping: 20,
                  }}
                  className={cn('order-progress__node', complete && 'order-progress__node--complete')}
                >
                  {complete ? <Check className="size-3" /> : index + 1}
                </motion.div>
                <span>{step.label}</span>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-5 grid gap-2">
        <OrderMeta icon={CalendarDays} label="Fecha"  value={formatDate(pedido.fecha)} />
        <OrderMeta icon={Clock}       label="Turno"  value={pedido.turnoEntrega} capitalize />
        <OrderMeta icon={MapPin}      label="Retiro" value={pedido.puntoRetiro} />
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
        <div>
          <span className="technical-label">Total</span>
          <div className="mt-1 font-orbitron text-xl font-bold text-foreground">
            {formatCurrency(pedido.total)}
          </div>
        </div>
        <Link
          to={`/pedidos/${pedido.id}`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          Ver pedido <ChevronRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}

function OrderMeta({ icon: Icon, label, value, capitalize }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/35 px-3 py-2.5">
      <Icon className="size-3.5 shrink-0 text-primary" />
      <span className="technical-label w-14">{label}</span>
      <span className={cn(
        'min-w-0 flex-1 truncate text-right text-xs font-medium text-secondary-foreground',
        capitalize && 'capitalize'
      )}>
        {value}
      </span>
    </div>
  )
}

function RecentOrders({ pedidos }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <span className="technical-label">Actividad</span>
          <h2 className="mt-2 text-lg font-semibold text-foreground">Pedidos recientes</h2>
        </div>
        <Link to="/pedidos" className="flex items-center gap-1 text-sm font-medium text-primary">
          Ver historial <ChevronRight className="size-3.5" />
        </Link>
      </div>

      <div className="recent-orders">
        {pedidos.map((pedido, i) => (
          <motion.div
            key={pedido.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={`/pedidos/${pedido.id}`} className="recent-order-row">
              <div className="recent-order-row__id"><ReceiptText className="size-4" /></div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">
                  {pedido.menuNombre}
                </div>
                <div className="mt-0.5 text-xs capitalize text-muted-foreground">
                  {formatDate(pedido.fecha)} · {pedido.turnoEntrega}
                </div>
              </div>
              {/* Desktop: badge inline; Mobile: stacked with amount */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <div className="font-orbitron text-xs font-bold text-secondary-foreground">
                  {formatCurrency(pedido.total)}
                </div>
                <StatusBadge estado={pedido.estado} />
              </div>
              <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { pedidos, menus, nextPedido, isLoading, error } = useDashboard()
  const today = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  if (error && !isLoading) return <ErrorMessage message={error} />

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="dashboard-food space-y-9"
    >
      <motion.div variants={sectionVariants}>
        <DashboardIntro user={user} today={today} />
      </motion.div>

      <motion.div variants={sectionVariants} className="dashboard-order-layout">
        <section className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <span className="technical-label">Selección del día</span>
              <h2 className="mt-2 text-xl font-semibold text-foreground">¿Qué vas a pedir hoy?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Raciones disponibles para la fecha actual.</p>
            </div>
            <Link to="/menus" className="hidden items-center gap-1 text-sm font-medium text-primary sm:flex">
              Ver todos <ChevronRight className="size-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2"><CardSkeleton /><CardSkeleton /></div>
          ) : menus.length > 0 ? (
            <div className="daily-menu-grid">
              {menus.slice(0, 4).map((menu, index) => (
                <MenuOfDayCard key={menu.id} menu={menu} featured={index === 0} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UtensilsCrossed}
              title="Sin menús para hoy"
              description="Todavía no hay menús disponibles para la fecha actual."
            />
          )}
        </section>

        <aside>
          {isLoading ? <CardSkeleton /> : <ActiveOrder pedido={nextPedido} />}
        </aside>
      </motion.div>

      <AnimatePresence>
        {!isLoading && pedidos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <RecentOrders pedidos={pedidos.slice(0, 5)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
