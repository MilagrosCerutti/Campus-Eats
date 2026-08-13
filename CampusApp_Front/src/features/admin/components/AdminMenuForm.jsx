import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImageIcon, Loader2, Plus, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DateInput } from '@/components/ui/date-input'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AlertBanner from '@/shared/components/AlertBanner'
import { getMenuImageUrl, todayISO } from '@/shared/utils'
import { parseApiError } from '@/lib/parseApiError'
import menuService from '@/features/menus/services/menuService'
import { TIPO_CONFIG } from '@/features/menus/constants'

const TIPO_OPTIONS = Object.entries(TIPO_CONFIG).map(([value, config]) => ({ value, label: config.label }))

const schema = z.object({
  nombre: z.string().trim().min(3, 'Ingresá un nombre de al menos 3 caracteres'),
  descripcion: z.string().trim().min(5, 'Ingresá una descripción').max(500, 'Máximo 500 caracteres'),
  fecha: z.string().min(1, 'Seleccioná una fecha'),
  tipo: z.enum(['clasico', 'vegetariano', 'vegano', 'sin_tacc']),
  precio: z.coerce.number().positive('El precio debe ser mayor a cero'),
  cupoDiario: z.coerce.number().int().min(1, 'El cupo debe ser de al menos 1'),
  activo: z.boolean(),
  imagenUrl: z.string().trim(),
})

const DEFAULT_VALUES = {
  nombre: '',
  descripcion: '',
  fecha: todayISO(),
  tipo: 'clasico',
  precio: '',
  cupoDiario: '',
  activo: true,
  imagenUrl: '',
}

export default function AdminMenuForm({ onCreated }) {
  const [submitError, setSubmitError] = useState(null)
  const [imageFailed, setImageFailed] = useState(false)
  const form = useForm({ resolver: zodResolver(schema), defaultValues: DEFAULT_VALUES })
  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = form
  const imagenUrl = useWatch({ control, name: 'imagenUrl' })
  const previewUrl = getMenuImageUrl(imagenUrl)

  async function onSubmit(values) {
    setSubmitError(null)
    try {
      const created = await menuService.createMenu({
        ...values,
        precio: Number(values.precio),
        cupoDiario: Number(values.cupoDiario),
        activo: values.activo ? 1 : 0,
        imagenUrl: values.imagenUrl || '',
      })
      reset(DEFAULT_VALUES)
      setImageFailed(false)
      onCreated?.(created)
    } catch (error) {
      setSubmitError(parseApiError(error, 'No se pudo crear el menú'))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_48px_-38px_rgba(57,48,35,0.7)] sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="technical-label text-primary">Nueva publicación</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">Cargar menú</h2>
          <p className="mt-1 text-sm text-muted-foreground">Completá los datos que verán los usuarios antes de pedir.</p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><Plus /></span>
      </div>

      {submitError && <AlertBanner variant="error" title="No se pudo publicar" className="mb-5">{submitError}</AlertBanner>}

      <div className="grid gap-5 xl:grid-cols-[1fr_15rem]">
        <div className="space-y-4">
          <Field label="Nombre" error={errors.nombre?.message}>
            <Input placeholder="Ej: Menú del día" {...register('nombre')} aria-invalid={!!errors.nombre} />
          </Field>

          <Field label="Descripción" error={errors.descripcion?.message}>
            <Textarea rows={4} placeholder="Ingredientes, acompañamiento y detalles..." {...register('descripcion')} aria-invalid={!!errors.descripcion} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fecha" error={errors.fecha?.message}>
              <DateInput min={todayISO()} {...register('fecha')} aria-invalid={!!errors.fecha} />
            </Field>
            <Field label="Tipo" error={errors.tipo?.message}>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} items={TIPO_OPTIONS}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      {TIPO_OPTIONS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Precio" error={errors.precio?.message}>
              <Input type="number" min="0" step="0.01" placeholder="2500" {...register('precio')} aria-invalid={!!errors.precio} />
            </Field>
            <Field label="Cupo diario" error={errors.cupoDiario?.message}>
              <Input type="number" min="1" step="1" placeholder="30" {...register('cupoDiario')} aria-invalid={!!errors.cupoDiario} />
            </Field>
          </div>

          <Field label="URL de imagen" hint="Acepta una URL completa o una ruta del servidor, por ejemplo /assets/menu.jpg" error={errors.imagenUrl?.message}>
            <Input
              placeholder="/assets/menu.jpg"
              {...register('imagenUrl', { onChange: () => setImageFailed(false) })}
              aria-invalid={!!errors.imagenUrl}
            />
          </Field>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-secondary/35 p-3">
            <input type="checkbox" className="mt-1 size-4 accent-primary" {...register('activo')} />
            <span>
              <span className="block text-sm font-medium text-foreground">Publicar como activo</span>
              <span className="block text-xs text-muted-foreground">El menú podrá aparecer inmediatamente en el catálogo.</span>
            </span>
          </label>
        </div>

        <div>
          <Label className="technical-label">Vista previa</Label>
          <div className="mt-2 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/45">
            {previewUrl && !imageFailed ? (
              <img src={previewUrl} alt="Vista previa del menú" className="h-full w-full object-cover" onError={() => setImageFailed(true)} />
            ) : (
              <div className="px-5 text-center text-muted-foreground">
                <ImageIcon className="mx-auto size-8 opacity-45" />
                <p className="mt-2 text-xs">{imagenUrl && imageFailed ? 'No se pudo cargar la imagen' : 'La imagen aparecerá acá'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => { reset(DEFAULT_VALUES); setSubmitError(null); setImageFailed(false) }}>
          <RotateCcw />Limpiar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
          {isSubmitting ? 'Publicando...' : 'Publicar menú'}
        </Button>
      </div>
    </form>
  )
}

function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
