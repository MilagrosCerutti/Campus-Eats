import { Link, useLocation } from 'react-router-dom'
import { Menu, Plus, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { buttonVariants } from '@/components/ui/button'
import BrandMark from './BrandMark'

const ROUTE_CONTEXT = [
  { match: (path) => path.startsWith('/pedidos/nuevo'), section: 'Pedidos', title: 'Nuevo pedido' },
  { match: (path) => path.includes('/editar'), section: 'Pedidos', title: 'Editar pedido' },
  { match: (path) => path.startsWith('/pedidos/'), section: 'Pedidos', title: 'Detalle de pedido' },
  { match: (path) => path === '/pedidos', section: 'Pedidos', title: 'Mis pedidos' },
  { match: (path) => path === '/menus', section: 'Menús', title: 'Menús disponibles' },
  { match: (path) => path === '/admin/menus', section: 'Administración', title: 'Gestión de menús' },
  { match: (path) => path === '/admin/sedes', section: 'Administración', title: 'Sedes' },
  { match: (path) => path === '/admin/usuarios', section: 'Administración', title: 'Gestión de usuarios' },
  { match: (path) => path.startsWith('/admin/'), section: 'Administración', title: 'Historial del pedido' },
  { match: (path) => path === '/admin', section: 'Administración', title: 'Resumen y pedidos' },
  { match: (path) => path === '/dashboard', section: 'Inicio', title: 'Tu campus' },
  { match: (path) => path === '/perfil', section: 'Cuenta', title: 'Mi perfil' },
]

export default function Topbar({ onMenuClick, className }) {
  const { user, isAdmin } = useAuth()
  const location = useLocation()
  const context = ROUTE_CONTEXT.find((item) => item.match(location.pathname)) ?? ROUTE_CONTEXT.at(-1)

  return (
    <header className={cn(
      'app-topbar sticky top-0 z-30 flex min-h-16 min-w-0 items-center gap-3 px-3 backdrop-blur-xl sm:px-4 lg:px-6',
      className
    )}>
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Abrir menú"
      >
        <Menu className="w-4.5 h-4.5" />
      </button>

      {/* Brand — mobile only */}
      <div className="flex min-w-0 items-center gap-2 lg:hidden">
        <span className="order66-mark !h-7 !w-7"><BrandMark className="size-4" /></span>
        <span className="hidden font-orbitron text-xs font-bold text-foreground sm:inline">
          CampusEats
        </span>
      </div>

      <div className="min-w-0 flex-1 lg:flex lg:items-center lg:gap-3">
        <div>
          <div className="technical-label hidden sm:block">{context.section}</div>
          <div className="truncate text-sm font-semibold text-foreground sm:mt-1">{context.title}</div>
        </div>
      </div>

      {!isAdmin && !location.pathname.startsWith('/pedidos/nuevo') && (
        <Link aria-label="Nuevo pedido" to="/pedidos/nuevo" className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}>
          <Plus className="size-3.5" /> <span className="hidden md:inline">Nuevo pedido</span>
        </Link>
      )}

      {/* User info — desktop only */}
      <div className="hidden lg:flex items-center gap-3">
        <GraduationCap className="w-4 h-4 text-primary" />
        <div className="text-right">
          <div className="text-sm font-medium text-foreground">{user?.nombre}</div>
          <div className="font-orbitron text-[8px] tracking-widest uppercase text-muted-foreground">
            {isAdmin ? 'Administrador' : 'Estudiante'}
          </div>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-200">
          <span className="font-orbitron text-[11px] text-lime-900 font-bold">
            {user?.nombre?.charAt(0)?.toUpperCase() ?? '?'}
          </span>
        </div>
      </div>
    </header>
  )
}
