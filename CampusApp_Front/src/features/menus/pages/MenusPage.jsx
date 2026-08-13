import { motion } from 'motion/react'
import { UtensilsCrossed } from 'lucide-react'
import { useMenus } from '../hooks/useMenus'
import MenuFilters from '../components/MenuFilters'
import MenuGrid from '../components/MenuGrid'
import EmptyState from '@/shared/components/EmptyState'
import ErrorMessage from '@/shared/components/ErrorMessage'
import CommandHeader from '@/shared/components/CommandHeader'
import Pagination from '@/shared/components/Pagination'

export default function MenusPage() {
  const { menus, allMenus, total, totalPages, page, isLoading, error, filters, setFilters } = useMenus()

  const hasFilters  = filters.tipo !== '' || filters.fecha !== ''
  const totalActivos = allMenus.filter((m) => m.activo).length

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="food-catalog">

      <CommandHeader
        eyebrow="Menús"
        title="¿Qué vas a comer hoy?"
        code="CE"
        description={!isLoading && !error
          ? hasFilters
            ? `${total} de ${totalActivos} menús coinciden con los filtros activos.`
            : `${totalActivos} opción${totalActivos !== 1 ? 'es' : ''} disponible${totalActivos !== 1 ? 's' : ''} para pedir.`
          : 'Elegí tu vianda y consultá los cupos disponibles.'}
      />

      {/* Filters */}
      <div className="mb-6">
        <MenuFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Error */}
      {!isLoading && error && <ErrorMessage message={error} />}

      {/* Empty */}
      {!isLoading && !error && menus.length === 0 && (
        <EmptyState
          icon={UtensilsCrossed}
          title="Sin menús disponibles"
          description={hasFilters ? 'Ningún menú coincide con los filtros.' : 'No hay menús activos en este momento.'}
          action={hasFilters ? () => setFilters({ tipo: '', fecha: '' }) : undefined}
          actionLabel="Limpiar filtros"
        />
      )}

      {/* Grid — passes isLoading for skeleton */}
      {(isLoading || (!error && menus.length > 0)) && (
        <MenuGrid menus={menus} isLoading={isLoading} />
      )}
      {!isLoading && !error && menus.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(nextPage) => setFilters((current) => ({ ...current, page: nextPage }))}
        />
      )}
    </motion.div>
  )
}
