import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/shared/utils'
import { Skeleton } from '@/shared/components/Skeleton'
import EmptyState from '@/shared/components/EmptyState'
import StatusBadge from '@/features/pedidos/components/StatusBadge'
import pedidoService from '@/features/pedidos/services/pedidoService'

function PedidoRow({ pedido }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground truncate">{pedido.menuNombre}</p>
        <p className="text-xs text-muted-foreground">{formatDate(pedido.fecha)}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge estado={pedido.estado} />
        <p className="font-orbitron text-sm font-bold text-foreground hidden sm:block">
          {formatCurrency(pedido.total)}
        </p>
        <Link
          to={`/pedidos/${pedido.id}`}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

function PedidoRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border">
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16 hidden sm:block" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
    </div>
  )
}

export default function TabMisPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    pedidoService.getPedidos({ limit: 5, page: 1 })
      .then((data) => {
        if (!cancelled) setPedidos(data.pedidos ?? data ?? [])
      })
      .catch(() => {
        if (!cancelled) setPedidos([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="max-w-lg space-y-4">
      <div className="bg-card border border-border rounded-xl px-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <PedidoRowSkeleton key={i} />)
        ) : pedidos.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Todavía no hiciste ningún pedido"
            description="Elegí un menú y hacé tu primer pedido."
          />
        ) : (
          pedidos.map((p) => <PedidoRow key={p.id} pedido={p} />)
        )}
      </div>

      {!isLoading && pedidos.length > 0 && (
        <Link
          to="/pedidos"
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
        >
          Ver todos mis pedidos <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  )
}
