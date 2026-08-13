import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Plus, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { usePedidos } from '../hooks/usePedidos'
import PedidoCard from '../components/PedidoCard'
import PedidoFilters from '../components/PedidoFilters'
import { CardSkeleton } from '@/shared/components/Skeleton'
import EmptyState from '@/shared/components/EmptyState'
import ErrorMessage from '@/shared/components/ErrorMessage'
import Pagination from '@/shared/components/Pagination'
import CommandHeader from '@/shared/components/CommandHeader'
import { DEFAULT_PEDIDO_FILTERS, hasPedidoFilters } from '../utils/queryParams'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
}

export default function PedidosPage() {
  const { user } = useAuth()
  const { pedidos, total, page, limit, isLoading, error, filters, setFilters, refetch } =
    usePedidos()

  const totalPages = Math.ceil(total / limit)
  const hasFilters = hasPedidoFilters(filters)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="orders-consumer"
    >
      <CommandHeader
        eyebrow={user?.nombre}
        title="Mis Pedidos"
        code="ORD / USER"
        description={
          !isLoading && !error
            ? `${total} orden${total !== 1 ? 'es' : ''} registrada${total !== 1 ? 's' : ''} en tu historial.`
            : 'Seguimiento y control de tus solicitudes.'
        }
        action={
          <Link
            to="/pedidos/nuevo"
            className={cn(buttonVariants({ size: 'sm' }), 'shrink-0 gap-1.5 text-sm')}
          >
            <Plus className="w-4 h-4" /> Nueva orden
          </Link>
        }
      />

      <div className="mb-6">
        <PedidoFilters filters={filters} onChange={setFilters} />
      </div>

      {!isLoading && error && <ErrorMessage message={error} onRetry={refetch} />}

      {!isLoading && !error && pedidos.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="Sin pedidos"
          description={
            hasFilters
              ? 'Ningún pedido coincide con los filtros.'
              : 'Todavía no realizaste ningún pedido.'
          }
          action={hasFilters ? () => setFilters({ ...DEFAULT_PEDIDO_FILTERS, limit }) : undefined}
          actionLabel="Limpiar filtros"
        />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        !error &&
        pedidos.length > 0 && (
          <>
            <motion.div
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pedidos.map((p) => (
                <motion.div key={p.id} variants={cardVariants}>
                  <PedidoCard pedido={p} onCanceled={refetch} />
                </motion.div>
              ))}
            </motion.div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
            />
          </>
        )
      )}
    </motion.div>
  )
}
