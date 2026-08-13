import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { formatCurrency, getMenuImageUrl } from '@/shared/utils'
import { TIPO_CONFIG } from '@/features/menus/constants'
import menuService from '@/features/menus/services/menuService'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

function MenuPreviewCard({ menu }) {
  const tipo = TIPO_CONFIG[menu.tipo] ?? TIPO_CONFIG.clasico
  const cupoTotal = menu.cupoDiario
  const cupoDisp = menu.cupoDisponible ?? menu.cupoDiario
  const cupoPct = cupoTotal > 0 ? Math.round((cupoDisp / cupoTotal) * 100) : 0
  const isFull = cupoDisp <= 0
  const isLow = !isFull && cupoPct < 25
  const imageUrl = getMenuImageUrl(menu.imagenUrl)

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.15 }}
      className="overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative h-40 w-full overflow-hidden bg-secondary">
        {imageUrl && (
          <img src={imageUrl} alt={menu.nombre} loading="lazy" className="h-full w-full object-cover" />
        )}
        <span className="absolute left-3 top-3 rounded-full border border-border bg-card/95 px-2.5 py-1 text-[11px] font-semibold text-charcoal backdrop-blur-sm">
          {tipo.label}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-charcoal">{menu.nombre}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-charcoal">{formatCurrency(menu.precio)}</span>
          <span className={cn(
            'flex items-center gap-1.5 text-xs font-medium',
            isFull ? 'text-destructive' : isLow ? 'text-[#B35A3D]' : 'text-primary'
          )}>
            <span className={cn('size-1.5 rounded-full', isFull ? 'bg-destructive' : isLow ? 'bg-[#D98268]' : 'bg-primary')} />
            {isFull ? 'Agotado' : isLow ? 'Últimas unidades' : 'Disponible'}
          </span>
        </div>
      </div>
    </motion.article>
  )
}

export default function MenuPreviewSection() {
  const [menus, setMenus] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    menuService.getMenus()
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return
        const vistos = new Set()
        const unicos = data.filter((m) => {
          if (vistos.has(m.nombre)) return false
          vistos.add(m.nombre)
          return true
        })
        setMenus(unicos.slice(0, 4))
      })
      .catch(() => { if (!cancelled) setMenus([]) })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <section id="menus" className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="mb-3 inline-block rounded-full bg-soft-sage px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              Menús
            </span>
            <h2 className="font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
              Algo rico te está esperando.
            </h2>
            <p className="mt-2 max-w-md text-warm-brown">
              Una preview de lo que vas a encontrar cada día en CampusEats.
            </p>
          </div>
          <Link to="/menus" className={cn(buttonVariants({ variant: 'outline' }), 'shrink-0 gap-1.5 rounded-full bg-card')}>
            Ver todos los menús <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-secondary/60" />
            ))}
          </div>
        ) : menus.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center text-warm-brown">
            <UtensilsCrossed className="size-6" />
            <p className="text-sm">Todavía no hay menús publicados.</p>
          </div>
        ) : (
          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {menus.map((menu) => <MenuPreviewCard key={menu.id} menu={menu} />)}
          </motion.div>
        )}
      </div>
    </section>
  )
}
