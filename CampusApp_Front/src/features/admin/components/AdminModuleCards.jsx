import { Link } from 'react-router-dom'
import { ArrowRight, Building2, ClipboardList, Plus, Users, UtensilsCrossed } from 'lucide-react'

const MODULES = [
  {
    to: '/admin',
    icon: ClipboardList,
    eyebrow: 'Operaciones',
    title: 'Pedidos',
    description: 'Supervisar estados, entregas e historial.',
    action: 'Ver operaciones',
  },
  {
    to: '/admin/menus',
    icon: UtensilsCrossed,
    eyebrow: 'Catálogo',
    title: 'Menús',
    description: 'Publicar menús y revisar cupos disponibles.',
    action: 'Gestionar menús',
    badge: <><Plus className="size-3" /> Alta habilitada</>,
  },
  {
    to: '/admin/sedes',
    icon: Building2,
    eyebrow: 'Logística',
    title: 'Sedes',
    description: 'Administrá los lugares disponibles para retirar pedidos.',
    action: 'Ver sedes',
  },
  {
    to: '/admin/usuarios',
    icon: Users,
    eyebrow: 'Accesos',
    title: 'Usuarios',
    description: 'Administrar cuentas, estados y roles.',
    action: 'Gestionar usuarios',
  },
]

export default function AdminModuleCards() {
  return (
    <section className="mb-7">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="technical-label text-primary">Módulos administrativos</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">Accesos de gestión</h2>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:block">Acciones exclusivas para administradores</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {MODULES.map(({ to, icon: Icon, eyebrow, title, description, action, badge }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card p-5 shadow-[0_16px_44px_-38px_rgba(57,48,35,0.7)] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_22px_46px_-34px_rgba(57,48,35,0.75)]"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-xl border border-border bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              {badge && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">{badge}</span>}
            </div>
            <p className="technical-label mt-5">{eyebrow}</p>
            <h3 className="mt-1 text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
              {action}<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
