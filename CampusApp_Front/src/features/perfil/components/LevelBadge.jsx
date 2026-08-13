import { cn } from '@/lib/utils'
import { getLevelInfo } from '../levels'

export default function LevelBadge({ totalPedidos = 0, className }) {
  const { current } = getLevelInfo(totalPedidos)

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium',
      'border-primary/30 bg-primary/10 text-primary',
      className
    )}>
      <span aria-hidden="true">{current.emoji}</span>
      <span className="font-orbitron tracking-wide">Nivel {current.level}</span>
      <span className="text-[10px] opacity-70 hidden sm:inline">— {current.nombre}</span>
    </div>
  )
}
