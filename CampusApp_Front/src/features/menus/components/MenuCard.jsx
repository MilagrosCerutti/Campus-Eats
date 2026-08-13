import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { AlertTriangle, Ban, Leaf, ShoppingCart, Sprout, Utensils, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, formatCurrency, getMenuImageUrl } from '@/shared/utils'
import { TIPO_CONFIG } from '../constants'

const TIPO_VISUAL = {
  clasico: { Icon: Utensils, visual: 'bg-stone-100 text-stone-500' },
  vegetariano: { Icon: Leaf, visual: 'bg-emerald-50 text-emerald-700' },
  vegano: { Icon: Sprout, visual: 'bg-teal-50 text-teal-700' },
  sin_tacc: { Icon: Zap, visual: 'bg-amber-50 text-amber-700' },
}

export default function MenuCard({ menu }) {
  const [imageFailed, setImageFailed] = useState(false)
  const tipo = TIPO_CONFIG[menu.tipo] ?? TIPO_CONFIG.clasico
  const visual = TIPO_VISUAL[menu.tipo] ?? TIPO_VISUAL.clasico
  const { Icon } = visual
  const cupoTotal = menu.cupoDiario
  const cupoDisp = menu.cupoDisponible ?? menu.cupoDiario
  const cupoPct = cupoTotal > 0 ? Math.round((cupoDisp / cupoTotal) * 100) : 0
  const isLow = cupoPct < 25 && cupoDisp > 0
  const isFull = cupoDisp === 0
  const imageUrl = getMenuImageUrl(menu.imagenUrl)
  const hasImage = imageUrl && !imageFailed

  return (
    <motion.article
      whileHover={isFull ? {} : { y: -2, boxShadow: '0 8px 32px -8px rgba(225,29,72,0.18)' }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      className={cn('menu-catalog-card relative flex flex-col overflow-hidden', isFull && 'opacity-60')}
    >
      <div className={cn('menu-card-visual relative flex h-32 items-center justify-center border-b border-border/70', visual.visual, hasImage && 'menu-card-visual--image')}>
        {hasImage && (
          <img
            src={imageUrl}
            alt={menu.nombre}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        {!hasImage && <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:18px_18px]" />}
        <div className={cn('relative h-12 w-12 items-center justify-center rounded-full border border-current/15 bg-white/55', hasImage ? 'hidden' : 'flex')}>
          <Icon className="h-6 w-6" />
        </div>
        <span className={cn('menu-type-badge absolute left-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center rounded-full border px-2.5 py-1 font-orbitron text-[8px] font-semibold uppercase tracking-[0.14em] shadow-sm backdrop-blur-sm', tipo.badge)}>
          {tipo.label}
        </span>
        {isLow && !isFull && (
          <span className="menu-availability-badge absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50/95 px-2.5 py-1 text-[10px] font-semibold text-amber-800 shadow-sm backdrop-blur-sm">
            <AlertTriangle className="h-2.5 w-2.5" />Últimas unidades
          </span>
        )}
        {isFull && (
          <span className="menu-availability-badge absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full border border-red-300 bg-red-50/95 px-2.5 py-1 text-[10px] font-semibold text-red-700 shadow-sm backdrop-blur-sm">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">
        <div className="flex-1">
          <h3 className="mb-1 text-base font-semibold leading-snug text-foreground">{menu.nombre}</h3>
          {menu.descripcion && <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{menu.descripcion}</p>}
          <p className="mt-1.5 text-[11px] text-muted-foreground/75">{formatDate(menu.fecha)}</p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-0.5 text-[10px] text-muted-foreground">Precio unitario</p>
            <p className="font-orbitron text-xl font-bold tracking-wide text-foreground">{formatCurrency(menu.precio)}</p>
          </div>
          <div className="text-right">
            <p className="mb-0.5 text-[10px] text-muted-foreground">Disponibles</p>
            <div className="flex items-center gap-1">
              {isLow && !isFull && <AlertTriangle className="h-3 w-3 text-amber-600" />}
              <span className={cn('font-orbitron text-sm font-semibold', isFull ? 'text-red-600' : isLow ? 'text-amber-700' : 'text-emerald-700')}>
                {cupoDisp}/{cupoTotal}
              </span>
            </div>
          </div>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${cupoPct}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn('h-full rounded-full', isFull ? 'bg-border' : isLow ? 'bg-amber-500' : cupoPct < 50 ? 'bg-primary/70' : 'bg-emerald-500')}
          />
        </div>

        {isFull ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 py-2.5 text-muted-foreground">
            <Ban className="h-3.5 w-3.5" />
            <span className="font-orbitron text-[9px] uppercase tracking-widest">Sin cupo disponible</span>
          </div>
        ) : (
          <Link
            to={`/pedidos/nuevo?menuId=${menu.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" />
            Pedir ahora
          </Link>
        )}
      </div>
    </motion.article>
  )
}
