import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import RegisterForm from '../components/RegisterForm'
import BrandMark from '@/shared/components/BrandMark'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit({ confirmPassword: _discard, ...data }) {
    setIsLoading(true)
    setError(null)
    try {
      const user = await registerUser(data)
      toast.success('¡Cuenta creada!', { description: `Bienvenido a CampusEats, ${user.nombre}` })
      navigate(user.rol === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error ?? 'No fue posible completar el registro.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-shell flex min-h-screen w-full max-w-full flex-col overflow-x-clip bg-background lg:flex-row">

      {/* ── PANEL IZQUIERDO (header en mobile, columna en desktop) ── */}
      <div className="relative flex flex-col items-center justify-center border-b bg-secondary/40 py-10 px-8 lg:w-[40%] lg:shrink-0 lg:border-b-0 lg:border-r lg:py-0">
        {/* Fondo con trama de puntos */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(117,134,107,0.18) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.6,
          }}
        />

        {/* Luz ambiental cálida esquina */}
        <div
          className="absolute bottom-0 right-0 pointer-events-none"
          style={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,130,104,0.16) 0%, transparent 70%)',
            filter: 'blur(60px)',
            transform: 'translate(30%, 30%)',
          }}
        />

        {/* Logo + wordmark */}
        <div className="relative z-10 flex flex-col items-center gap-4 lg:gap-6">
          <div className="grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 lg:size-40 lg:rounded-[2.5rem]">
            <BrandMark className="size-8 lg:size-20" />
          </div>
          <p className="font-orbitron text-xs tracking-[0.3em] uppercase text-primary lg:text-sm">
            Campus Eats
          </p>
        </div>
      </div>

      {/* ── PANEL DERECHO ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex min-w-0 max-w-full flex-1 flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:py-0"
      >
        <div className="relative z-10 w-full max-w-[420px]">
          {/* Encabezado del formulario */}
          <div className="mb-8">
            <div className="inline-block rounded-full border border-primary/25 bg-primary/8 px-3 py-1 font-orbitron text-[10px] tracking-[0.2em] uppercase text-primary mb-3">
              Nuevo por acá
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              Creá tu cuenta
            </h1>

            <p className="text-sm text-muted-foreground">
              Completá el formulario y empezá a pedir tu vianda.
            </p>
          </div>

          <div className="mb-6 h-px bg-gradient-to-r from-border to-transparent" />

          {/* Formulario */}
          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

          {/* Footer link */}
          <p className="text-sm mt-6 text-center text-muted-foreground lg:text-left">
            ¿Ya tenés cuenta?{' '}
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: 'link' }),
                'p-0 h-auto font-orbitron text-[10px] tracking-wider uppercase text-primary'
              )}
            >
              Iniciar sesión →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
