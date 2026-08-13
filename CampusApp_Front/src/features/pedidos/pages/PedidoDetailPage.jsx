import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { usePedidoDetail } from '../hooks/usePedidoDetail'
import PedidoDetail from '../components/PedidoDetail'
import Spinner from '@/shared/components/Spinner'
import ErrorMessage from '@/shared/components/ErrorMessage'
import CommandHeader from '@/shared/components/CommandHeader'

export default function PedidoDetailPage() {
  const { id } = useParams()
  const { pedido, historial, menu, isLoading, error, refetch, refetchHistorial, setPedido } = usePedidoDetail(id)

  function handleCanceled(updated) {
    setPedido(updated)
    refetchHistorial()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="order-detail-consumer">

      <CommandHeader
        eyebrow="Seguimiento"
        title="Detalle del Pedido"
        code={`ORD / ${id}`}
        description="Estado, datos de entrega e historial operativo de la solicitud."
        back={(
          <Link
          to="/pedidos"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5 -ml-2 mb-3 font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground')}
          >
            <ArrowLeft className="w-3.5 h-3.5" />Mis pedidos
          </Link>
        )}
      />

      {isLoading && <Spinner />}
      {!isLoading && error && <ErrorMessage message={error} onRetry={refetch} />}
      {!isLoading && !error && pedido && (
        <PedidoDetail
          pedido={pedido}
          historial={historial}
          menu={menu}
          onCanceled={handleCanceled}
        />
      )}
    </motion.div>
  )
}
