import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  ChevronLeft, ChevronRight, ClipboardList, Gauge, LogOut, Plus,
  Building2, BarChart3, Users, UtensilsCrossed, UserRound, X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import BrandMark from './BrandMark'

const USER_SECTIONS = [{
  label: 'Tu campus',
  links: [
    { to: '/dashboard', icon: Gauge, label: 'Inicio', description: 'Tu resumen del día', code: '01' },
    { to: '/menus', icon: UtensilsCrossed, label: 'Menús', description: 'Elegí tu vianda', code: '02' },
    { to: '/pedidos', icon: ClipboardList, label: 'Mis pedidos', description: 'Estado e historial', code: '03' },
    { to: '/perfil', icon: UserRound, label: 'Mi perfil', description: 'Tu progreso y datos', code: '04' },
  ],
}]

const ADMIN_SECTIONS = [{
  label: 'Administración',
  links: [
    { to: '/admin', icon: BarChart3, label: 'Resumen y pedidos', description: 'Estados y entregas', code: 'A1' },
    { to: '/admin/menus', icon: UtensilsCrossed, label: 'Menús', description: 'Catálogo y cupos', code: 'A2' },
    { to: '/admin/sedes', icon: Building2, label: 'Sedes', description: 'Lugares disponibles', code: 'A3' },
    { to: '/admin/usuarios', icon: Users, label: 'Usuarios', description: 'Cuentas y permisos', code: 'A4' },
  ],
}]

function isRouteActive(pathname, to) {
  if (to === '/admin') return pathname === '/admin' || pathname.startsWith('/admin/pedidos/')
  if (to === '/dashboard') return pathname === '/dashboard'
  return pathname === to || pathname.startsWith(`${to}/`)
}

function NavItem({ item, active, onClick, collapsed }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      className={cn('sidebar-nav-item group', active && 'sidebar-nav-item--active')}
    >
      <span className="sidebar-nav-item__code">{item.code}</span>
      <span className="sidebar-nav-item__icon"><Icon /></span>
      <span className="sidebar-collapsible-copy min-w-0 flex-1">
        <span className="sidebar-nav-item__label">{item.label}</span>
        <span className="sidebar-nav-item__description">{item.description}</span>
      </span>
    </Link>
  )
}

function Brand({ home, onClose, collapsed, onToggleCollapsed }) {
  return (
    <div className="sidebar-brand">
      <Link to={home} onClick={onClose} className="flex min-w-0 items-center gap-3" aria-label="Inicio">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <BrandMark className="size-5" />
        </span>
        <span className="sidebar-collapsible-copy min-w-0">
          <span className="sidebar-brand__name">CampusEats</span>
          <span className="sidebar-brand__product">Gestión de viandas</span>
        </span>
      </Link>
      <button type="button" onClick={onClose} className="sidebar-close lg:hidden" aria-label="Cerrar menú">
        <X className="size-4" />
      </button>
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="sidebar-close hidden lg:grid"
        aria-label={collapsed ? 'Expandir barra lateral' : 'Minimizar barra lateral'}
        title={collapsed ? 'Expandir barra lateral' : 'Minimizar barra lateral'}
      >
        {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>
    </div>
  )
}

function SidebarContent({ onClose, collapsed = false, onToggleCollapsed = () => {} }) {
  const { user, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const sections = isAdmin ? ADMIN_SECTIONS : USER_SECTIONS
  const home = isAdmin ? '/admin' : '/dashboard'

  function handleLogout() {
    logout()
    toast.info('Sesión cerrada')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Brand home={home} onClose={onClose} collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} />

      {!isAdmin && (
        <div className="px-3 pt-4">
          <Link
            to="/pedidos/nuevo"
            onClick={onClose}
            className="sidebar-primary-action"
            aria-label="Nuevo pedido"
            title={collapsed ? 'Nuevo pedido' : undefined}
          >
            <span className="sidebar-primary-action__icon"><Plus className="size-4" /></span>
            <span className="sidebar-collapsible-copy">
              <span className="block text-sm font-semibold">Nuevo pedido</span>
              <span className="block text-[10px] text-white/70">Elegí tu vianda de hoy</span>
            </span>
          </Link>
        </div>
      )}

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        {sections.map((section) => (
          <section key={section.label} className="mb-6">
            <div className="sidebar-section-label sidebar-collapsible-copy">
              <span>{section.label}</span>
              <span className="sidebar-section-label__line" />
            </div>
            <div className="space-y-1.5">
              {section.links.map((item) => (
                <NavItem
                  key={item.to}
                  item={item}
                  active={isRouteActive(location.pathname, item.to)}
                  onClick={onClose}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="sidebar-session">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/perfil"
            onClick={onClose}
            aria-label="Mi perfil"
            title={collapsed ? 'Mi perfil' : undefined}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-1 py-0.5 transition-colors hover:bg-secondary/60"
          >
            <span className="sidebar-avatar shrink-0">{user?.nombre?.charAt(0)?.toUpperCase() ?? '?'}</span>
            <span className="sidebar-collapsible-copy min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">{user?.nombre}</span>
              <span className="technical-label mt-0.5 block">{isAdmin ? 'Administrador' : 'Estudiante'}</span>
            </span>
          </Link>
          <button type="button" onClick={handleLogout} className="sidebar-logout" aria-label="Cerrar sesión" title="Cerrar sesión">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ isOpen, onClose, collapsed, onToggleCollapsed }) {
  return (
    <>
      <aside className={cn('sidebar-frame hidden lg:flex', collapsed && 'sidebar-frame--collapsed')}>
        <SidebarContent collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} onClose={() => {}} />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="sidebar-frame fixed inset-y-0 left-0 z-50 flex lg:hidden"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
