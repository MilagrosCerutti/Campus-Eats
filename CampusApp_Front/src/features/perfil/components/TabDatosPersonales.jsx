import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Save, Loader2, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import perfilService from '../services/perfilService'

const PUNTOS_RETIRO = ['Cafetería Central', 'Cantina Norte', 'Cantina Sur', 'Edificio A', 'Edificio B']
const TURNOS = ['Almuerzo', 'Cena']

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  puntoRetiro: z.string().min(1),
  turno: z.string().min(1),
})

export default function TabDatosPersonales({ user }) {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: user?.nombre ?? '',
      puntoRetiro: PUNTOS_RETIRO[0],
      turno: TURNOS[0],
    },
  })

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await perfilService.updatePerfil(data)
      toast.success('Perfil actualizado', { description: 'Tus datos han sido guardados.' })
    } catch {
      toast.error('No se pudo actualizar el perfil', { description: 'Intenta de nuevo más tarde.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      <div className="space-y-1.5">
        <Label htmlFor="nombre" className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Nombre
        </Label>
        <Input
          id="nombre"
          placeholder="Nombre completo"
          {...register('nombre')}
          aria-invalid={!!errors.nombre}
        />
        {errors.nombre && (
          <p className="text-xs text-destructive">{errors.nombre.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="email"
            type="email"
            value={user?.email ?? ''}
            disabled
            className="pl-9"
            readOnly
          />
        </div>
        <p className="text-[10px] text-muted-foreground">El email no puede modificarse.</p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Sede preferida
        </Label>
        <Controller
          name="puntoRetiro"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ''}
              onValueChange={field.onChange}
              items={PUNTOS_RETIRO.map((p) => ({ value: p, label: p }))}
            >
              <SelectTrigger className="w-full" aria-invalid={!!errors.puntoRetiro}>
                <SelectValue placeholder="Seleccionar punto..." />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {PUNTOS_RETIRO.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Turno preferido
        </Label>
        <Controller
          name="turno"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ''}
              onValueChange={field.onChange}
              items={TURNOS.map((t) => ({ value: t, label: t }))}
            >
              <SelectTrigger className="w-full" aria-invalid={!!errors.turno}>
                <SelectValue placeholder="Seleccionar turno..." />
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                {TURNOS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="gap-2">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Guardar cambios
      </Button>
    </form>
  )
}
