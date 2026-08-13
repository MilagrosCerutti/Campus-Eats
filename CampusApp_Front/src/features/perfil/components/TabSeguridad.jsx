import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import perfilService from '../services/perfilService'

const schema = z.object({
  passwordActual: z.string().min(1, 'Requerido'),
  passwordNueva: z.string().min(8, 'Mínimo 8 caracteres'),
  passwordConfirm: z.string().min(1, 'Requerido'),
}).refine((d) => d.passwordNueva === d.passwordConfirm, {
  message: 'Las contraseñas no coinciden',
  path: ['passwordConfirm'],
})

function PasswordInput({ id, label, registration, error, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder ?? '••••••••'}
          className={cn('pl-9 pr-10', error && 'border-destructive')}
          aria-invalid={!!error}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  )
}

function StrengthBar({ password }) {
  const len = password?.length ?? 0
  const strength = len < 6 ? 0 : len < 10 ? 1 : 2
  const labels = ['Débil', 'Media', 'Fuerte']
  const colors = ['bg-red-500', 'bg-yellow-400', 'bg-green-500']

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= strength && password ? colors[strength] : 'bg-border'
            )}
          />
        ))}
      </div>
      {password && (
        <p className="text-[10px] text-muted-foreground">{labels[strength]}</p>
      )}
    </div>
  )
}

export default function TabSeguridad() {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { passwordActual: '', passwordNueva: '', passwordConfirm: '' },
  })

  const nuevaPass = watch('passwordNueva')

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      await perfilService.updatePassword({
        passwordActual: data.passwordActual,
        passwordNueva: data.passwordNueva,
      })
      toast.success('Código de acceso actualizado')
      reset()
    } catch {
      toast.error('No se pudo actualizar la contraseña', { description: 'Verifica tu contraseña actual.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      <PasswordInput
        id="passwordActual"
        label="Contraseña actual"
        registration={register('passwordActual')}
        error={errors.passwordActual}
      />

      <div className="space-y-2">
        <PasswordInput
          id="passwordNueva"
          label="Nueva contraseña"
          registration={register('passwordNueva')}
          error={errors.passwordNueva}
        />
        <StrengthBar password={nuevaPass} />
      </div>

      <PasswordInput
        id="passwordConfirm"
        label="Confirmar contraseña"
        registration={register('passwordConfirm')}
        error={errors.passwordConfirm}
      />

      <Button type="submit" disabled={isLoading} className="gap-2">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
        Actualizar código de acceso
      </Button>
    </form>
  )
}
