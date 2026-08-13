import {
  DollarSign,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  CalendarClock,
  CalendarDays,
  UtensilsCrossed,
  TrendingUp,
  Star,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/shared/utils'
import { StatSkeleton } from '@/shared/components/Skeleton'
import ResumenCard from './ResumenCard'

export default function ResumenPanel({ resumen, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!resumen) return null

  const byEstado = Object.fromEntries((resumen.porEstado ?? []).map((item) => [item.estado, item]))
  const pendiente = byEstado.pendiente
  const confirmado = byEstado.confirmado
  const entregado = byEstado.entregado
  const cancelado = byEstado.cancelado

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ResumenCard
          label="Recaudado"
          value={formatCurrency(resumen.recaudado ?? 0)}
          sub="confirmado + entregado"
          icon={DollarSign}
          variant="primary"
        />
        <ResumenCard
          label="Estimado confirmado"
          value={formatCurrency(resumen.importeEstimadoConfirmados ?? 0)}
          sub={`${confirmado?.cantidad ?? 0} pedidos confirmados`}
          icon={TrendingUp}
          variant="info"
        />
        <ResumenCard
          label="Confirmados"
          value={confirmado?.cantidad ?? 0}
          sub={confirmado ? formatCurrency(confirmado.totalMonto) : 'Sin pedidos'}
          icon={CheckCircle}
          variant="info"
        />
        <ResumenCard
          label="Pendientes"
          value={pendiente?.cantidad ?? 0}
          sub={pendiente ? formatCurrency(pendiente.totalMonto) : 'Sin pedidos'}
          icon={Clock}
          variant="warning"
        />
        <ResumenCard
          label="Entregados"
          value={entregado?.cantidad ?? 0}
          sub={entregado ? formatCurrency(entregado.totalMonto) : 'Sin pedidos'}
          icon={Package}
          variant="success"
        />
        <ResumenCard
          label="Cancelados"
          value={cancelado?.cantidad ?? 0}
          sub={cancelado ? formatCurrency(cancelado.totalMonto) : 'Sin pedidos'}
          icon={XCircle}
          variant="danger"
        />
        <ResumenCard
          label="Menú del día"
          value={resumen.menuDelDia?.totalPedido ?? 0}
          sub={resumen.menuDelDia?.nombre ?? 'Sin pedidos para hoy'}
          icon={Star}
          variant="warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BreakdownPanel icon={UtensilsCrossed} title="Cupos restantes por menú">
          <Rows
            items={resumen.cuposRestantesPorMenu}
            empty="Sin menús registrados."
            render={(menu) => (
              <BreakdownRow
                key={menu.menuId}
                title={menu.menuNombre}
                subtitle={`${formatDate(menu.fecha)} · ${menu.cupoReservado} reservadas`}
                value={
                  <>
                    {menu.cupoDisponible}
                    <span className="text-muted-foreground">/{menu.cupoDiario}</span>
                  </>
                }
              />
            )}
          />
        </BreakdownPanel>

        <BreakdownPanel icon={CalendarClock} title="Pedidos pendientes por fecha">
          <DateRows items={resumen.pedidosPendientesPorFecha} empty="Sin pedidos pendientes." />
        </BreakdownPanel>

        <BreakdownPanel icon={CalendarDays} title="Pedidos y viandas por fecha">
          <DateRows items={resumen.pedidosPorFecha} empty="Sin pedidos registrados." />
        </BreakdownPanel>
      </div>
    </div>
  )
}

function DateRows({ items, empty }) {
  return (
    <Rows
      items={items}
      empty={empty}
      render={(item) => (
        <BreakdownRow
          key={item.fecha}
          title={formatDate(item.fecha)}
          subtitle={`${item.cantidadViandas} viandas`}
          value={item.cantidadPedidos}
        />
      )}
    />
  )
}

function Rows({ items = [], empty, render }) {
  if (items.length === 0)
    return <p className="py-5 text-center text-sm text-muted-foreground">{empty}</p>
  return items.map(render)
}

function BreakdownRow({ title, subtitle, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2.5 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <p className="shrink-0 font-orbitron text-sm font-bold text-foreground">{value}</p>
    </div>
  )
}

function BreakdownPanel({ icon: Icon, title, children }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <h3 className="font-orbitron text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h3>
      </div>
      <div className="max-h-64 overflow-y-auto pr-1">{children}</div>
    </section>
  )
}
