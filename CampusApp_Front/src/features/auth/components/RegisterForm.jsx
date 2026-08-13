import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/* ─── PASSWORD STRENGTH ─────────────────────────────────────────── */

const PASSWORD_RULES = [
  { test: (v) => v.length >= 8,             label: '8+ caracteres' },
  { test: (v) => /[A-Z]/.test(v),           label: '1 mayúscula'   },
  { test: (v) => /[0-9]/.test(v),           label: '1 número'      },
  { test: (v) => /[^a-zA-Z0-9]/.test(v),   label: '1 símbolo'     },
]

const STRENGTH_META = [
  { label: 'Muy débil', color: 'text-destructive',  bar: 'bg-destructive' },
  { label: 'Débil',     color: 'text-orange-400',   bar: 'bg-orange-400'  },
  { label: 'Aceptable', color: 'text-amber-400',    bar: 'bg-amber-400'   },
  { label: 'Segura',    color: 'text-emerald-500',  bar: 'bg-emerald-500' },
]

function PasswordStrength({ value }) {
  if (!value) return null
  const passed = PASSWORD_RULES.filter((r) => r.test(value)).length
  const meta   = STRENGTH_META[passed - 1]

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {PASSWORD_RULES.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-0.5 flex-1 rounded-full transition-colors duration-300',
              i < passed ? meta.bar : 'bg-border'
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {PASSWORD_RULES.map(({ label, test }, i) => (
            <span
              key={i}
              className={cn(
                'flex items-center gap-0.5 text-[10px] transition-colors duration-200',
                test(value) ? 'text-emerald-500' : 'text-muted-foreground/50'
              )}
            >
              <Check className={cn('size-2.5', test(value) ? 'opacity-100' : 'opacity-0')} />
              {label}
            </span>
          ))}
        </div>
        {passed > 0 && (
          <span className={cn('font-orbitron text-[9px] tracking-wider', meta.color)}>
            {meta.label}
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── SCHEMA ────────────────────────────────────────────────────── */

const schema = z
  .object({
    nombre:          z.string().min(2, 'Mínimo 2 caracteres'),
    email:           z.string().email('Email inválido'),
    password:        z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/,         'Debe contener al menos una mayúscula')
      .regex(/[0-9]/,         'Debe contener al menos un número')
      .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un símbolo'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

const FIELDS = [
  { id: 'nombre',          label: 'Nombre completo',    icon: User, type: 'text',     placeholder: 'Juana Pérez',        autoComplete: 'name' },
  { id: 'email',           label: 'Email',               icon: Mail, type: 'email',    placeholder: 'vos@universidad.edu', autoComplete: 'email' },
  { id: 'password',        label: 'Contraseña',          icon: Lock, type: 'password', placeholder: '••••••••',            autoComplete: 'new-password', toggle: true },
  { id: 'confirmPassword', label: 'Confirmar contraseña', icon: Lock, type: 'password', placeholder: '••••••••',           autoComplete: 'new-password', toggle: true },
]

/* ─── COMPONENT ─────────────────────────────────────────────────── */

export default function RegisterForm({ onSubmit, isLoading, error }) {
  const [visible, setVisible] = useState({ password: false, confirmPassword: false })
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const passwordValue        = watch('password', '')
  const confirmPasswordValue = watch('confirmPassword', '')
  const passwordsMatch       = !!confirmPasswordValue && passwordValue === confirmPasswordValue

  const toggle = (id) => setVisible((v) => ({ ...v, [id]: !v[id] }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {FIELDS.map(({ id, label, icon: Icon, type, placeholder, autoComplete, toggle: hasToggle }) => (
        <div key={id} className="space-y-1.5">
          <Label htmlFor={id} className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
            {label}
          </Label>
          <motion.div
            className="relative"
            animate={errors[id] ? { x: [-5, 5, -4, 4, -2, 2, 0] } : {}}
            transition={{ duration: 0.35 }}
          >
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id={id}
              type={hasToggle && visible[id] ? 'text' : type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={cn('pl-9', hasToggle && 'pr-10', errors[id] && 'border-destructive focus-visible:ring-destructive')}
              {...register(id)}
            />
            {hasToggle && (
              <button
                type="button"
                onClick={() => toggle(id)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {visible[id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </motion.div>

          {/* Indicador de fortaleza para password */}
          {id === 'password' && <PasswordStrength value={passwordValue} />}

          {/* Indicador de coincidencia para confirmPassword */}
          {id === 'confirmPassword' && confirmPasswordValue && !errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-xs text-emerald-500"
            >
              <Check className="w-3 h-3 shrink-0" /> Las contraseñas coinciden
            </motion.p>
          )}
          {id === 'confirmPassword' && confirmPasswordValue && !passwordsMatch && !errors.confirmPassword && null}

          <AnimatePresence>
            {errors[id] && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-xs text-destructive"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />{errors[id].message}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Live "no coinciden" cuando hay valor pero aún no hay error de zod */}
          {id === 'confirmPassword' && confirmPasswordValue && !passwordsMatch && !errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-xs text-amber-500"
            >
              <X className="w-3 h-3 shrink-0" /> Las contraseñas no coinciden
            </motion.p>
          )}
        </div>
      ))}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={isLoading || !isValid}
        className="w-full font-orbitron text-xs tracking-[0.15em] uppercase h-10 mt-1"
      >
        {isLoading
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creando cuenta...</>
          : 'Crear cuenta'}
      </Button>
    </form>
  )
}
