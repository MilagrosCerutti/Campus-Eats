import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { CheckCircle2, CircleOff, Pencil, Power, RefreshCw, UtensilsCrossed } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import CommandHeader from '@/shared/components/CommandHeader'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import EmptyState from '@/shared/components/EmptyState'
import ErrorMessage from '@/shared/components/ErrorMessage'
import { CardSkeleton } from '@/shared/components/Skeleton'
import { formatCurrency, formatDate, getMenuImageUrl } from '@/shared/utils'
import { parseApiError } from '@/lib/parseApiError'
import menuService from '@/features/menus/services/menuService'
import { TIPO_CONFIG } from '@/features/menus/constants'
import AdminMenuEditDialog from '../components/AdminMenuEditDialog'
import AdminMenuForm from '../components/AdminMenuForm'

export default function AdminMenusPage() {
  const [menus, setMenus] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [toggling, setToggling] = useState(null)

  const loadMenus = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await menuService.getMenus()
      setMenus(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(parseApiError(loadError, 'No se pudieron cargar los menús'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadMenus() }, [loadMenus])

  function handleCreated() {
    toast.success('Menú publicado', { description: 'Ya forma parte del catálogo disponible.' })
    loadMenus()
  }

  function handleEdited() {
    toast.success('Menú actualizado')
    loadMenus()
  }

  async function toggleMenu() {
    const nextActive = !isActive(toggling)
    try {
      await (nextActive ? menuService.activar(toggling.id) : menuService.desactivar(toggling.id))
      toast.success(nextActive ? 'Menú activado' : 'Menú desactivado')
      setToggling(null)
      loadMenus()
    } catch (toggleError) {
      toast.error(parseApiError(toggleError, 'No se pudo cambiar el estado del menú'))
    }
  }

  const activeCount = menus.filter(isActive).length

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <CommandHeader
        eyebrow="Administración de catálogo"
        title="Gestión de menús"
        code="ADM"
        description={`${activeCount} menú${activeCount !== 1 ? 's' : ''} activo${activeCount !== 1 ? 's' : ''} de ${menus.length} registrado${menus.length !== 1 ? 's' : ''}.`}
      />

      <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <AdminMenuForm onCreated={handleCreated} />

        <section className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_48px_-38px_rgba(57,48,35,0.7)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="technical-label">Catálogo registrado</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Menús actuales</h2>
            </div>
            <Button variant="outline" size="sm" onClick={loadMenus} disabled={isLoading}><RefreshCw className={isLoading ? 'animate-spin' : ''} />Actualizar</Button>
          </div>

          {error && <ErrorMessage message={error} onRetry={loadMenus} />}
          {!error && isLoading && <div className="grid gap-3">{Array.from({ length: 3 }).map((_, index) => <CardSkeleton key={index} />)}</div>}
          {!error && !isLoading && menus.length === 0 && <EmptyState icon={UtensilsCrossed} title="Sin menús registrados" description="Publicá el primero desde el formulario." />}
          {!error && !isLoading && menus.length > 0 && (
            <div className="max-h-[50rem] space-y-3 overflow-y-auto pr-1">
              {menus.map((menu) => (
                <AdminMenuRow key={menu.id} menu={menu} onEdit={() => setEditingId(menu.id)} onToggle={() => setToggling(menu)} />
              ))}
            </div>
          )}
        </section>
      </div>

      <AdminMenuEditDialog menuId={editingId} onClose={() => setEditingId(null)} onSaved={handleEdited} />
      <ConfirmDialog
        open={!!toggling}
        onOpenChange={(open) => { if (!open) setToggling(null) }}
        title={`${isActive(toggling) ? 'Desactivar' : 'Activar'} menú`}
        description={isActive(toggling) ? 'El menú dejará de estar disponible para nuevas solicitudes, pero conservará su historial.' : 'El menú volverá a estar disponible para nuevas solicitudes.'}
        confirmLabel={isActive(toggling) ? 'Desactivar' : 'Activar'}
        variant={isActive(toggling) ? 'destructive' : 'default'}
        onConfirm={toggleMenu}
      />
    </motion.div>
  )
}

function AdminMenuRow({ menu, onEdit, onToggle }) {
  const tipo = TIPO_CONFIG[menu.tipo] ?? TIPO_CONFIG.clasico
  const imageUrl = getMenuImageUrl(menu.imagenUrl)
  const active = isActive(menu)
  const StatusIcon = active ? CheckCircle2 : CircleOff

  return (
    <article className={`rounded-xl border border-border bg-secondary/25 p-3 ${active ? '' : 'opacity-65'}`}>
      <div className="flex gap-3">
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-card text-muted-foreground">
          {imageUrl ? <img src={imageUrl} alt="" className="h-full w-full object-cover" /> : <UtensilsCrossed className="size-5 opacity-40" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">{menu.nombre}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(menu.fecha)} · {tipo.label}</p>
            </div>
            <span className={active ? 'text-emerald-700' : 'text-muted-foreground'} title={active ? 'Activo' : 'Inactivo'}><StatusIcon className="size-4" /></span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="font-semibold text-foreground">{formatCurrency(menu.precio)}</span>
            <span className="text-muted-foreground">Cupo {menu.cupoDisponible ?? menu.cupoDiario}/{menu.cupoDiario}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2 border-t border-border pt-3">
        <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}><Pencil />Editar</Button>
        <Button variant={active ? 'destructive' : 'secondary'} size="sm" className="flex-1" onClick={onToggle}><Power />{active ? 'Desactivar' : 'Activar'}</Button>
      </div>
    </article>
  )
}

function isActive(item) {
  return item?.activo === undefined || item?.activo === true || item?.activo === 1 || item?.activo === '1'
}
