import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export default function Spinner({ fullscreen = false, className }) {
  const content = (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative w-10 h-10">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-border border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border border-border border-b-sky-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <span className="font-orbitron text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
        Cargando
      </span>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-[#0B0D10] flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  )
}
