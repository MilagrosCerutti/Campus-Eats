import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { formatDateFull, formatCurrency } from '@/shared/utils'
import StatusBadge from '@/features/pedidos/components/StatusBadge'
import HistorialTimeline from '@/features/pedidos/components/HistorialTimeline'
import adminService from '../services/adminService'
import Spinner from '@/shared/components/Spinner'
import ErrorMessage from '@/shared/components/ErrorMessage'
import CommandHeader from '@/shared/components/CommandHeader'

export default function HistorialPage() {
  const { id } = useParams()
  const [pedido, setPedido]       = useState(null)
  const [historial, setHistorial] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([adminService.getPedido(id), adminService.getHistorial(id)])
      .then(([p, h]) => { setPedido(p); setHistorial(h) })
      .catch((err) => setError(err.response?.data?.error ?? 'Error al cargar el historial'))
      .finally(() => setIsLoading(false))
  }, [id])

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

      <CommandHeader
        eyebrow="Seguimiento Administrativo"
        title={`Historial del Pedido #${id}`}
        code={`LOG / ${id}`}
        description="Registro cronológico de cambios y estado operativo."
        back={(
          <Link
          to="/admin"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5 -ml-2 mb-3 font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground')}
          >
            <ArrowLeft className="w-3.5 h-3.5" />Panel administrativo
          </Link>
        )}
      />

      {isLoading && <Spinner />}
      {!isLoading && error && <ErrorMessage message={error} />}

      {!isLoading && !error && pedido && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order info */}
          <div className="lg:col-span-2">
            <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[0_18px_48px_-42px_rgba(57,48,35,0.75)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
                    Pedido #{pedido.id}
                  </p>
                  <h2 className="font-orbitron text-base font-bold text-foreground mt-0.5">
                    {pedido.menuNombre}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Solicitado por: {pedido.usuarioNombre}
                  </p>
                </div>
                <StatusBadge estado={pedido.estado} />
              </div>

              <div className="h-px bg-border" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <InfoItem icon={Calendar} label="Fecha"    value={formatDateFull(pedido.fecha)} />
                <InfoItem icon={Clock}    label="Turno"    value={<span className="capitalize">{pedido.turnoEntrega}</span>} />
                <InfoItem icon={Users}    label="Cantidad" value={`x${pedido.cantidad}`} />
                <InfoItem icon={Hash}     label="Total"    value={<span className="font-orbitron font-bold text-sm">{formatCurrency(pedido.total)}</span>} />
              </div>

              <InfoItem icon={MapPin} label="Sede" value={pedido.puntoRetiroNombre ?? pedido.puntoRetiro} />
              {pedido.observaciones && (
                <div>
                  <p className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground mb-1">
                    Observaciones
                  </p>
                  <p className="text-xs text-foreground">{pedido.observaciones}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <HistorialTimeline historial={historial} />
          </div>
        </div>
      )}
    </motion.div>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <span className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm text-foreground pl-4">{value}</div>
    </div>
  )
}
