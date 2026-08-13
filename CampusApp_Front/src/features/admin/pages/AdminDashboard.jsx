import { motion } from 'motion/react'
import { ClipboardList, BarChart3, ListOrdered } from 'lucide-react'
import { useAdminPedidos } from '../hooks/useAdminPedidos'
import { useResumen } from '../hooks/useResumen'
import ResumenPanel from '../components/ResumenPanel'
import AdminTable from '../components/AdminTable'
import PedidoFilters from '@/features/pedidos/components/PedidoFilters'
import { TableRowSkeleton } from '@/shared/components/Skeleton'
import EmptyState from '@/shared/components/EmptyState'
import ErrorMessage from '@/shared/components/ErrorMessage'
import Pagination from '@/shared/components/Pagination'
import CommandHeader from '@/shared/components/CommandHeader'
import AdminModuleCards from '../components/AdminModuleCards'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DEFAULT_PEDIDO_FILTERS, hasPedidoFilters } from '@/features/pedidos/utils/queryParams'

export default function AdminDashboard() {
  const {
    resumen,
    isLoading: loadingResumen,
    error: resumenError,
    refetch: refetchResumen,
  } = useResumen()
  const { pedidos, total, page, limit, isLoading, error, filters, setFilters, refetch, updateRow } =
    useAdminPedidos()

  const totalPages = Math.ceil(total / limit)
  const hasFilters = hasPedidoFilters(filters)

  function handleRowUpdated(updated) {
    updateRow(updated)
    refetchResumen()
  }

  const pendingDelivery = resumen?.pedidosPendientesEntrega ?? []

  return (
    <motion.div
      className="admin-workspace"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <CommandHeader
        eyebrow="CampusEats Admin"
        title="Todo el campus, en un solo lugar"
        code="ADM"
        description={
          !isLoading && !error
            ? `${total} pedido${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''} en el sistema.`
            : 'Supervisá pedidos, estados y acciones del día.'
        }
      />

      <AdminModuleCards />

      <Tabs defaultValue="resumen">
        <TabsList className="mb-6">
          <TabsTrigger value="resumen">
            <BarChart3 className="size-3.5" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="pedidos">
            <ListOrdered className="size-3.5" />
            Pedidos
            {!isLoading && !error && total > 0 && (
              <span className="ml-1 rounded-full bg-white/15 px-1.5 py-px font-orbitron text-[9px] tabular-nums">
                {total}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── Resumen tab ── */}
        <TabsContent value="resumen">
          {resumenError && <ErrorMessage message={resumenError} onRetry={refetchResumen} />}
          <ResumenPanel resumen={resumen} isLoading={loadingResumen} />
        </TabsContent>

        {/* ── Pedidos tab ── */}
        <TabsContent value="pedidos">
          {!loadingResumen && !resumenError && pendingDelivery.length > 0 && (
            <section className="mb-7">
              <div className="mb-4">
                <h2 className="font-semibold text-foreground">Pedidos pendientes de entrega</h2>
                <p className="text-sm text-muted-foreground">
                  Pedidos confirmados que todavía deben marcarse como entregados.
                </p>
              </div>
              <AdminTable pedidos={pendingDelivery} onRowUpdated={handleRowUpdated} />
            </section>
          )}

          <div className="mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Registro de pedidos</h2>
            </div>
            <PedidoFilters filters={filters} onChange={setFilters} />
          </div>

          {error && <ErrorMessage message={error} onRetry={refetch} />}

          {!error && !isLoading && pedidos.length === 0 && (
            <EmptyState
              icon={ClipboardList}
              title="Sin pedidos"
              description={
                hasFilters ? 'Ningún pedido coincide con los filtros.' : 'No hay pedidos registrados.'
              }
              action={hasFilters ? () => setFilters({ ...DEFAULT_PEDIDO_FILTERS, limit }) : undefined}
              actionLabel="Limpiar filtros"
            />
          )}

          {!error && isLoading && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full">
                <tbody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <TableRowSkeleton key={i} cols={9} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!error && !isLoading && pedidos.length > 0 && (
            <>
              <AdminTable pedidos={pedidos} onRowUpdated={handleRowUpdated} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
