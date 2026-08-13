import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const schema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export default function LoginForm({ onSubmit, isLoading, error }) {
  const [showPwd, setShowPwd] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Email
        </Label>
        <motion.div
          className="relative"
          animate={errors.email ? { x: [-5, 5, -4, 4, -2, 2, 0] } : {}}
          transition={{ duration: 0.35 }}
        >
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="email"
            type="email"
            placeholder="vos@universidad.edu"
            autoComplete="email"
            className={cn('pl-9', errors.email && 'border-destructive focus-visible:ring-destructive')}
            {...register('email')}
          />
        </motion.div>
        <AnimatePresence>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="w-3 h-3 shrink-0" />{errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-[10px] font-orbitron tracking-widest uppercase text-muted-foreground">
          Contraseña
        </Label>
        <motion.div
          className="relative"
          animate={errors.password ? { x: [-5, 5, -4, 4, -2, 2, 0] } : {}}
          transition={{ duration: 0.35 }}
        >
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="password"
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            className={cn('pl-9 pr-10', errors.password && 'border-destructive focus-visible:ring-destructive')}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </motion.div>
        <AnimatePresence>
          {errors.password && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="w-3 h-3 shrink-0" />{errors.password.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Server error */}
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

      <Button type="submit" disabled={isLoading} className="w-full font-orbitron text-xs tracking-[0.15em] uppercase h-10">
        {isLoading
          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verificando...</>
          : 'Iniciar Sesión'}
      </Button>
    </form>
  )
}
