import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import BrandMark from '@/shared/components/BrandMark'

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#como-funciona', label: '¿Cómo funciona?' },
  { href: '#menus', label: 'Menús' },
  { href: '#sedes', label: 'Sedes' },
  { href: '#sobre-campuseats', label: 'Sobre CampusEats' },
]

export default function LandingNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <a href="#inicio" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <BrandMark className="size-4.5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Campus<span className="text-primary">Eats</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-warm-brown transition-colors hover:text-charcoal"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className="text-sm font-medium text-warm-brown transition-colors hover:text-charcoal">
            Iniciar sesión
          </Link>
          <Link to="/register" className={cn(buttonVariants({ size: 'sm' }), 'rounded-full px-5')}>
            Crear cuenta
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground lg:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border/70 bg-background lg:hidden"
          >
            <nav className="flex flex-col px-6 py-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/60 py-3.5 text-[15px] font-medium text-foreground last:border-0"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 py-4">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full rounded-full')}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), 'w-full rounded-full')}
                >
                  Crear cuenta
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
