import { motion } from 'motion/react'
import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * @param {{ eyebrow: string, title: string, description?: string, code?: string, action?: React.ReactNode, back?: React.ReactNode, className?: string }} props
 */
export default function CommandHeader({
  eyebrow,
  title,
  description,
  code = 'CE',
  action,
  back,
  className,
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('command-header mb-7', className)}
    >
      {back}
      <div className="command-header__panel overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid lg:grid-cols-[1fr_auto]">
          <div className="px-5 py-5 sm:px-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <span className="technical-label text-primary">{eyebrow}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {title}
            </h1>
            {description && <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{description}</p>}
          </div>

          <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-border px-5 py-4 lg:min-w-52">
            <div className="flex items-center gap-2">
              <span className="system-dot" />
              <span className="technical-label">En vivo</span>
            </div>
            <div className="font-orbitron text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
              {code}
            </div>
            {action}
          </div>
        </div>
        <div className="hud-rule" />
      </div>
    </motion.header>
  )
}
