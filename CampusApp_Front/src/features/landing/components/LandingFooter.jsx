import { Link } from 'react-router-dom'
import { AtSign, Mail, MessageCircle } from 'lucide-react'
import BrandMark from '@/shared/components/BrandMark'

const FOOTER_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#como-funciona', label: '¿Cómo funciona?' },
  { href: '#menus', label: 'Menús' },
  { href: '#sedes', label: 'Sedes' },
]

const SOCIALS = [
  { icon: AtSign, label: 'Instagram' },
  { icon: MessageCircle, label: 'Comunidad' },
  { icon: Mail, label: 'Contacto' },
]

export default function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <a href="#inicio" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <BrandMark className="size-4.5" />
            </span>
            <span>
              <span className="block font-display text-base font-extrabold text-charcoal">CampusEats</span>
              <span className="block text-xs text-warm-brown">Tu campus. Tu comida. Tu progreso.</span>
            </span>
          </a>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-warm-brown">
            {FOOTER_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-charcoal">
                {link.label}
              </a>
            ))}
            <Link to="/login" className="transition-colors hover:text-charcoal">Iniciar sesión</Link>
            <Link to="/register" className="transition-colors hover:text-charcoal">Crear cuenta</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                onClick={(e) => e.preventDefault()}
                className="grid size-9 place-items-center rounded-full border border-border text-warm-brown transition-colors hover:text-charcoal"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 border-t border-border pt-6 text-xs text-warm-brown">
          © {new Date().getFullYear()} CampusEats. Proyecto de comida universitaria.
        </p>
      </div>
    </footer>
  )
}
