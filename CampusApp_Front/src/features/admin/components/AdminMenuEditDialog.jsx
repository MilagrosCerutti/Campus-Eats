import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/date-input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AlertBanner from '@/shared/components/AlertBanner'
import { getMenuImageUrl } from '@/shared/utils'
import { parseApiError } from '@/lib/parseApiError'
import menuService from '@/features/menus/services/menuService'
import { TIPO_CONFIG } from '@/features/menus/constants'

const OPTIONS = Object.entries(TIPO_CONFIG).map(([value, config]) => ({ value, label: config.label }))
const schema = z.object({
  nombre: z.string().trim().min(3),
  descripcion: z.string().trim().min(5).max(500),
  fecha: z.string().min(1),
  tipo: z.enum(['clasico', 'vegetariano', 'vegano', 'sin_tacc']),
  precio: z.coerce.number().positive(),
  cupoDiario: z.coerce.number().int().min(1),
  imagenUrl: z.string().trim(),
})

export default function AdminMenuEditDialog({ menuId, onClose, onSaved }) {
  const [original, setOriginal] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const form = useForm({ resolver: zodResolver(schema) })
  const { control, register, reset, handleSubmit, formState: { errors, isSubmitting } } = form
  const imageUrl = useWatch({ control, name: 'imagenUrl' })

  useEffect(() => {
    if (!menuId) return
    setLoading(true)
    setError(null)
    menuService.getMenu(menuId)
      .then((menu) => {
        const values = pickEditable(menu)
        setOriginal(values)
        reset(values)
      })
      .catch((loadError) => setError(parseApiError(loadError, 'No se pudo cargar el menú')))
      .finally(() => setLoading(false))
  }, [menuId, reset])

  async function submit(values) {
    const normalized = { ...values, precio: Number(values.precio), cupoDiario: Number(values.cupoDiario) }
    const changes = Object.fromEntries(Object.entries(normalized).filter(([key, value]) => value !== original?.[key]))
    if (Object.keys(changes).length === 0) return onClose()

    setError(null)
    try {
      await menuService.updateMenu(menuId, changes)
      onSaved()
      onClose()
    } catch (saveError) {
      setError(parseApiError(saveError, 'No se pudo actualizar el menú'))
    }
  }

  return (
    <Dialog open={!!menuId} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit(submit)}>
          <DialogHeader>
            <DialogTitle>Editar menú</DialogTitle>
            <p className="text-sm text-muted-foreground">Solo se enviarán los campos modificados.</p>
          </DialogHeader>

          {error && <AlertBanner variant="error" className="mt-4">{error}</AlertBanner>}
          {loading ? (
            <div className="grid min-h-56 place-items-center"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            <div className="my-5 grid gap-5 md:grid-cols-[1fr_12rem]">
              <div className="space-y-4">
                <Field label="Nombre" error={errors.nombre}><Input {...register('nombre')} /></Field>
                <Field label="Descripción" error={errors.descripcion}><Textarea rows={3} {...register('descripcion')} /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Fecha" error={errors.fecha}><DateInput {...register('fecha')} /></Field>
                  <Field label="Tipo" error={errors.tipo}>
                    <Controller name="tipo" control={control} render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} items={OPTIONS}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>{OPTIONS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent>
                      </Select>
                    )} />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Precio" error={errors.precio}><Input type="number" min="0" step="0.01" {...register('precio')} /></Field>
                  <Field label="Cupo diario" error={errors.cupoDiario}><Input type="number" min="1" step="1" {...register('cupoDiario')} /></Field>
                </div>
                <Field label="URL de imagen" error={errors.imagenUrl}><Input {...register('imagenUrl')} /></Field>
              </div>
              <div>
                <Label className="technical-label">Vista previa</Label>
                <div className="mt-2 grid aspect-square place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/45">
                  {getMenuImageUrl(imageUrl) ? <img src={getMenuImageUrl(imageUrl)} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="size-8 text-muted-foreground/50" />}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="m-0 -mx-4 -mb-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading || isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar cambios'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, error, children }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}{error && <p className="text-xs text-destructive">Revisá este campo</p>}</div>
}

function pickEditable(menu) {
  return {
    nombre: menu.nombre ?? '',
    descripcion: menu.descripcion ?? '',
    fecha: menu.fecha?.slice(0, 10) ?? '',
    tipo: menu.tipo ?? 'clasico',
    precio: Number(menu.precio ?? 0),
    cupoDiario: Number(menu.cupoDiario ?? 0),
    imagenUrl: menu.imagenUrl ?? '',
  }
}
