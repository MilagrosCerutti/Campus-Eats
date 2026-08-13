import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Pencil, Plus, Power, RefreshCw, ShieldCheck, UserRound, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CommandHeader from '@/shared/components/CommandHeader'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import EmptyState from '@/shared/components/EmptyState'
import ErrorMessage from '@/shared/components/ErrorMessage'
import { CardSkeleton } from '@/shared/components/Skeleton'
import { parseApiError } from '@/lib/parseApiError'
import usuarioService from '../services/usuarioService'

const ROLE_OPTIONS = [{ value: 'usuario', label: 'Usuario' }, { value: 'admin', label: 'Administrador' }]
const STATUS_OPTIONS = [{ value: 'all', label: 'Todos' }, { value: '1', label: 'Activos' }, { value: '0', label: 'Inactivos' }]

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [filters, setFilters] = useState({ rol: 'usuario', activo: '1' })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [toggling, setToggling] = useState(null)

  const loadUsuarios = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = { rol: filters.rol }
      if (filters.activo !== 'all') params.activo = filters.activo
      const data = await usuarioService.getUsuarios(params)
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (loadError) {
      setError(parseApiError(loadError, 'No se pudieron cargar los usuarios'))
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => { loadUsuarios() }, [loadUsuarios])

  async function toggleUsuario() {
    const nextActive = !isActive(toggling)
    try {
      await (nextActive ? usuarioService.activar(toggling.id) : usuarioService.desactivar(toggling.id))
      toast.success(nextActive ? 'Usuario activado' : 'Usuario desactivado')
      setToggling(null)
      loadUsuarios()
    } catch (toggleError) {
      toast.error(parseApiError(toggleError, 'No se pudo cambiar el estado del usuario'))
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <CommandHeader
        eyebrow="Administración de acceso"
        title="Gestión de usuarios"
        code="ADM"
        description="Creá cuentas, asigná roles y controlá el acceso al sistema."
        action={<Button size="sm" onClick={() => setEditing({})}><Plus />Nuevo usuario</Button>}
      />

      <div className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto]">
        <Filter label="Rol">
          <Select value={filters.rol} onValueChange={(rol) => setFilters((current) => ({ ...current, rol }))} items={ROLE_OPTIONS}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>{ROLE_OPTIONS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
          </Select>
        </Filter>
        <Filter label="Estado">
          <Select value={filters.activo} onValueChange={(activo) => setFilters((current) => ({ ...current, activo }))} items={STATUS_OPTIONS}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUS_OPTIONS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
          </Select>
        </Filter>
        <Button variant="outline" className="self-end" onClick={loadUsuarios} disabled={isLoading}><RefreshCw className={isLoading ? 'animate-spin' : ''} />Actualizar</Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={loadUsuarios} />}
      {!error && isLoading && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)}</div>}
      {!error && !isLoading && usuarios.length === 0 && <EmptyState icon={Users} title="Sin usuarios" description="No hay cuentas que coincidan con los filtros." />}
      {!error && !isLoading && usuarios.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {usuarios.map((usuario) => (
            <article key={usuario.id} className={`rounded-2xl border bg-card p-5 ${isActive(usuario) ? 'border-border' : 'border-border opacity-65'}`}>
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">{usuario.rol === 'admin' ? <ShieldCheck /> : <UserRound />}</span>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${isActive(usuario) ? 'bg-emerald-100 text-emerald-800' : 'bg-secondary text-muted-foreground'}`}>{isActive(usuario) ? 'Activo' : 'Inactivo'}</span>
              </div>
              <h2 className="mt-5 truncate text-base font-semibold text-foreground">{usuario.nombre}</h2>
              <p className="mt-1 truncate text-sm text-muted-foreground">{usuario.email}</p>
              <p className="mt-3 text-xs font-semibold capitalize text-primary">{usuario.rol}</p>
              <div className="mt-5 flex gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditing(usuario)}><Pencil />Editar</Button>
                <Button variant={isActive(usuario) ? 'destructive' : 'secondary'} size="sm" className="flex-1" onClick={() => setToggling(usuario)}><Power />{isActive(usuario) ? 'Desactivar' : 'Activar'}</Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <UsuarioDialog usuario={editing} onClose={() => setEditing(null)} onSaved={loadUsuarios} />
      <ConfirmDialog
        open={!!toggling}
        onOpenChange={(open) => { if (!open) setToggling(null) }}
        title={`${isActive(toggling) ? 'Desactivar' : 'Activar'} usuario`}
        description={isActive(toggling) ? 'La cuenta perderá acceso inmediatamente.' : 'La cuenta recuperará acceso inmediatamente.'}
        confirmLabel={isActive(toggling) ? 'Desactivar' : 'Activar'}
        variant={isActive(toggling) ? 'destructive' : 'default'}
        onConfirm={toggleUsuario}
      />
    </motion.div>
  )
}

function UsuarioDialog({ usuario, onClose, onSaved }) {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'usuario' })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm({ nombre: usuario?.nombre ?? '', email: usuario?.email ?? '', password: '', rol: usuario?.rol ?? 'usuario' })
    setError(null)
  }, [usuario])

  async function submit(event) {
    event.preventDefault()
    if (form.nombre.trim().length < 2 || !form.email.includes('@')) return setError('Revisá el nombre y el email')
    if (!usuario?.id && form.password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres')
    setSaving(true)
    setError(null)
    try {
      const payload = { nombre: form.nombre.trim(), email: form.email.trim(), rol: form.rol }
      if (form.password) payload.password = form.password
      if (usuario?.id) await usuarioService.updateUsuario(usuario.id, payload)
      else await usuarioService.createUsuario({ ...payload, activo: 1 })
      toast.success(usuario?.id ? 'Usuario actualizado' : 'Usuario creado')
      onClose()
      onSaved()
    } catch (saveError) {
      setError(parseApiError(saveError, 'No se pudo guardar el usuario'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={!!usuario} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={submit}>
          <DialogHeader><DialogTitle>{usuario?.id ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle></DialogHeader>
          <div className="my-5 space-y-4">
            <Filter label="Nombre"><Input value={form.nombre} onChange={(e) => setForm((current) => ({ ...current, nombre: e.target.value }))} /></Filter>
            <Filter label="Email"><Input type="email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} /></Filter>
            <Filter label={usuario?.id ? 'Nueva contraseña (opcional)' : 'Contraseña'}><Input type="password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} /></Filter>
            <Filter label="Rol">
              <Select value={form.rol} onValueChange={(rol) => setForm((current) => ({ ...current, rol }))} items={ROLE_OPTIONS}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{ROLE_OPTIONS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
              </Select>
            </Filter>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="m-0 -mx-4 -mb-4"><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar usuario'}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Filter({ label, children }) {
  return <div className="space-y-1.5"><Label className="text-xs font-semibold">{label}</Label>{children}</div>
}

function isActive(item) {
  return item?.activo === undefined || item?.activo === true || item?.activo === 1 || item?.activo === '1'
}
