import { Hourglass, ShieldCheck, PackageCheck, Ban } from 'lucide-react'
import { cn } from '@/lib/utils'

const CONFIG = {
  pendiente:  {
    label: 'Pendiente',
    icon: Hourglass,
    dot: 'bg-amber-500', text: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200',
    leftBorder: 'border-l-[#FACC15]',
    pulse: true,
  },
  confirmado: {
    label: 'Confirmado',
    icon: ShieldCheck,
    dot: 'bg-emerald-500', text: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200',
    leftBorder: 'border-l-[#22C55E]',
    pulse: false,
  },
  entregado:  {
    label: 'Entregado',
    icon: PackageCheck,
    dot: 'bg-sky-500', text: 'text-sky-800', bg: 'bg-sky-50', border: 'border-sky-200',
    leftBorder: 'border-l-[#38BDF8]',
    pulse: false,
  },
  cancelado:  {
    label: 'Cancelado',
    icon: Ban,
    dot: 'bg-[#D98268]', text: 'text-[#9A4A30]', bg: 'bg-[#D98268]/10', border: 'border-[#D98268]/35',
    leftBorder: 'border-l-[#D98268]',
    pulse: false,
  },
}

export default function StatusBadge({ estado, className }) {
  const cfg = CONFIG[estado] ?? CONFIG.pendiente
  const Icon = cfg.icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 shadow-sm',
      'text-[10px] font-bold uppercase tracking-wide whitespace-nowrap',
      cfg.bg, cfg.border, cfg.text,
      className
    )}>
      <span className="relative flex items-center shrink-0">
        <Icon className="w-3 h-3" />
        {cfg.pulse && (
          <span className={cn('absolute -inset-0.5 rounded-full opacity-40 animate-ping', cfg.dot)} />
        )}
      </span>
      {cfg.label}
    </span>
  )
}

export { CONFIG as ESTADO_VISUAL }
