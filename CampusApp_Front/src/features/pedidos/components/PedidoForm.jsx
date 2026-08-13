import { useEffect } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { motion, AnimatePresence } from 'motion/react'
import {
  Loader2,
  AlertCircle,
  MapPin,
  StickyNote,
  UtensilsCrossed,
  Calendar,
  Lock,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { DateInput } from '@/components/ui/date-input'
import { cn } from '@/lib/utils'
import AlertBanner from '@/shared/components/AlertBanner'
import { formatCurrency, formatDate, getMenuImageUrl } from '@/shared/utils'
import { TIPO_CONFIG } from '@/features/menus/constants'
import { TURNO_OPTIONS } from '../constants'
import { usePedidoForm } from '../hooks/usePedidoForm'

export default function PedidoForm({
  defaultValues,
  pedidoInfo,
  isEdit = false,
  onSubmit,
  isLoading,
  error,
  onPreviewChange,
}) {
  const {
    form,
    menus,
    loadingMenus,
    menusError,
    sedes,
    loadingSedes,
    sedesError,
    selectedMenu,
    total,
    canSubmit,
  } = usePedidoForm({ defaultValues, isEdit })
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form

  const watchMenuId = useWatch({ control, name: 'menuId' })
  const watchCantidad = useWatch({ control, name: 'cantidad' })

  useEffect(() => {
    if (!onPreviewChange) return
    onPreviewChange(
      selectedMenu ? { menu: selectedMenu, total, cantidad: Number(watchCantidad) || 1 } : null
    )
  }, [selectedMenu, total, watchCantidad]) // eslint-disable-line react-hooks/exhaustive-deps

  const sedeItems = sedes.map((s) => ({
    value: String(s.id),
    label: s.nombre + (s.direccion ? ` — ${s.direccion}` : ''),
  }))

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-[0_20px_55px_-44px_rgba(57,48,35,0.8)] sm:p-6"
    >
      {isEdit && pedidoInfo && (
        <div className="flex items-center gap-3 p-3 rounded border border-border/60 bg-secondary/20">
          <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">{pedidoInfo.menuNombre}</span>
            {' · '}
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(pedidoInfo.fecha)}
            </span>
            <p className="text-[10px] mt-0.5 font-orbitron tracking-wider uppercase opacity-60">
              La fecha no es editable. El menú puede cambiarse por otro activo de la misma fecha.
            </p>
          </div>
        </div>
      )}

      {!isEdit && (
        <div className="space-y-1.5">
          <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
            Fecha de entrega
          </Label>
          <DateInput
            {...register('fecha')}
            aria-invalid={!!errors.fecha}
            className={cn(errors.fecha && 'border-destructive')}
          />
          {errors.fecha && <FieldError msg={errors.fecha.message} />}
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Menú
        </Label>
        {loadingMenus ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Cargando menús...
          </div>
        ) : menusError ? (
          <AlertBanner variant="error" title="No se pudieron cargar los menús">
            {menusError}
          </AlertBanner>
        ) : menus.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Sin menús disponibles para esta fecha
          </div>
        ) : (
          <div className="grid gap-2">
            {menus.map((menu) => {
              const tipo = TIPO_CONFIG[menu.tipo] ?? TIPO_CONFIG.clasico
              const selected = String(menu.id) === String(watchMenuId)
              const disabled = menu.cupoDisponible < 1 && !(isEdit && selected)
              const thumbUrl = getMenuImageUrl(menu.imagenUrl)
              return (
                <label
                  key={menu.id}
                  className={cn(
                    'relative flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors duration-150',
                    disabled && 'opacity-50 cursor-not-allowed',
                    selected && !disabled && 'border-primary/50 bg-primary/5',
                    !selected && !disabled && 'border-border hover:border-border/80'
                  )}
                >
                  <input
                    type="radio"
                    className="mt-0.5 accent-primary"
                    disabled={disabled}
                    {...register('menuId')}
                    value={menu.id}
                    checked={selected}
                  />
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-lg border border-border object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/50">
                      <UtensilsCrossed className="size-4 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-orbitron text-xs font-semibold text-foreground">
                        {menu.nombre}
                      </span>
                      <span
                        className={cn(
                          'text-[9px] font-orbitron tracking-wider uppercase border rounded px-1.5 py-px',
                          tipo.badge
                        )}
                      >
                        {tipo.label}
                      </span>
                      {disabled && (
                        <span className="text-[9px] font-orbitron tracking-wider uppercase border border-destructive/30 text-destructive rounded px-1.5 py-px">
                          Sin cupo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{formatCurrency(menu.precio)} / unidad</span>
                      <span>Cupo: {menu.cupoDisponible ?? menu.cupoDiario} restantes</span>
                    </div>
                  </div>
                </label>
              )
            })}
          </div>
        )}
        {errors.menuId && <FieldError msg={errors.menuId.message} />}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
            Cantidad
          </Label>
          <Input
            type="number"
            min={1}
            max={10}
            {...register('cantidad')}
            className={cn(errors.cantidad && 'border-destructive')}
          />
          {errors.cantidad && <FieldError msg={errors.cantidad.message} />}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
            Turno
          </Label>
          <Controller
            name="turnoEntrega"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? ''}
                onValueChange={field.onChange}
                items={TURNO_OPTIONS}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.turnoEntrega}>
                  <SelectValue placeholder="Seleccionar turno..." />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {TURNO_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.turnoEntrega && <FieldError msg={errors.turnoEntrega.message} />}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          <MapPin className="inline w-3 h-3 mr-1" />
          Sede
        </Label>
        {loadingSedes ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            Cargando sedes...
          </div>
        ) : sedesError ? (
          <AlertBanner variant="error" title="No se pudieron cargar las sedes">
            {sedesError}
          </AlertBanner>
        ) : (
          <Controller
            name="puntoRetiroId"
            control={control}
            render={({ field }) => (
              <Select
                value={String(field.value ?? '')}
                onValueChange={(v) => field.onChange(Number(v))}
                items={sedeItems}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.puntoRetiroId}>
                  <SelectValue placeholder="Elegí dónde querés retirar tu vianda..." />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {sedes.map((sede) => (
                    <SelectItem key={sede.id} value={String(sede.id)}>
                      {sede.nombre}
                      {sede.direccion ? ` — ${sede.direccion}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        {errors.puntoRetiroId && <FieldError msg={errors.puntoRetiroId.message} />}
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          <StickyNote className="inline w-3 h-3 mr-1" />
          Observaciones (opcional)
        </Label>
        <Textarea
          rows={3}
          placeholder="Sin cubiertos, alergia a..."
          {...register('observaciones')}
          className="resize-none"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <AlertBanner variant="error" title="Revisá el pedido">
              {error}
            </AlertBanner>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hud-rule opacity-50" />
      <Button
        type="submit"
        disabled={isLoading || !canSubmit}
        className="w-full font-orbitron text-xs tracking-[0.15em] uppercase h-10"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Procesando...
          </>
        ) : isEdit ? (
          'Guardar cambios'
        ) : (
          'Confirmar pedido'
        )}
      </Button>
    </form>
  )
}

function FieldError({ msg }) {
  return (
    <p className="flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {msg}
    </p>
  )
}
