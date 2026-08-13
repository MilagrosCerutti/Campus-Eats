import { Link } from 'react-router-dom'
import { History } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate, formatCurrency } from '@/shared/utils'
import StatusBadge from '@/features/pedidos/components/StatusBadge'
import StatusActions from './StatusActions'

const COLS = ['#', 'Usuario', 'Menú', 'Fecha', 'Turno', 'Cant.', 'Total', 'Estado', 'Acciones']

export default function AdminTable({ pedidos, onRowUpdated }) {
  return (
    <>
      <div className="grid gap-3 md:hidden">
        {pedidos.map((pedido) => (
          <article key={pedido.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="font-orbitron text-[9px] uppercase tracking-widest text-muted-foreground">Pedido #{pedido.id}</span>
                <h3 className="mt-1 truncate font-semibold text-foreground">{pedido.menuNombre}</h3>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{pedido.usuarioNombre}</p>
              </div>
              <StatusBadge estado={pedido.estado} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-secondary/35 p-3 text-xs">
              <div><span className="block text-muted-foreground">Fecha</span><strong className="text-foreground">{formatDate(pedido.fecha)}</strong></div>
              <div><span className="block text-muted-foreground">Turno</span><strong className="capitalize text-foreground">{pedido.turnoEntrega}</strong></div>
              <div><span className="block text-muted-foreground">Cantidad</span><strong className="text-foreground">×{pedido.cantidad}</strong></div>
              <div><span className="block text-muted-foreground">Total</span><strong className="text-foreground">{formatCurrency(pedido.total)}</strong></div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
              <StatusActions pedido={pedido} onSuccess={onRowUpdated} />
              <Link
                to={`/admin/pedidos/${pedido.id}/historial`}
                className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
              >
                <History className="size-3.5" /> Historial
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="admin-orders-table hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/70">
              {COLS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left font-orbitron text-[9px] tracking-[0.2em] uppercase text-muted-foreground whitespace-nowrap first:pl-5 last:pr-5"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, idx) => (
              <tr
                key={pedido.id}
                className={cn(
                  'border-b border-border/70 transition-colors duration-150 last:border-b-0',
                  'hover:bg-primary/[0.045]',
                  idx % 2 === 0 ? 'bg-card' : 'bg-secondary/25'
                )}
              >
                <td className="px-4 py-3 pl-5">
                  <span className="font-orbitron text-[10px] text-muted-foreground">#{pedido.id}</span>
                </td>
                <td className="px-4 py-3 max-w-[130px]">
                  <span className="text-foreground truncate block font-medium">{pedido.usuarioNombre}</span>
                </td>
                <td className="px-4 py-3 max-w-[160px]">
                  <span className="text-foreground/85 truncate block">{pedido.menuNombre}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-muted-foreground">{formatDate(pedido.fecha)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-muted-foreground capitalize">{pedido.turnoEntrega}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-medium text-foreground/80">×{pedido.cantidad}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-orbitron text-sm font-semibold text-foreground">
                    {formatCurrency(pedido.total)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge estado={pedido.estado} />
                </td>
                <td className="px-4 py-3 pr-5">
                  <div className="flex items-center gap-2">
                    <StatusActions pedido={pedido} onSuccess={onRowUpdated} />
                    <Link
                      to={`/admin/pedidos/${pedido.id}/historial`}
                      className={cn(
                        'flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5',
                        'font-orbitron text-[9px] tracking-wider uppercase text-muted-foreground',
                        'hover:border-primary/35 hover:bg-primary/[0.06] hover:text-primary transition-colors duration-150'
                      )}
                    >
                      <History className="w-3 h-3" />
                      Log
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  )
}
