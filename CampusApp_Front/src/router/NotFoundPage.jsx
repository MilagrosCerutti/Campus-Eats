import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import BrandMark from '@/shared/components/BrandMark'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">

      {/* Marca de agua de fondo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <BrandMark className="w-[60vmin] h-[60vmin] text-foreground" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="font-orbitron font-black leading-none select-none mb-4"
          style={{
            fontSize: 'clamp(5rem,18vw,9rem)',
            color: 'rgba(117,134,107,0.14)',
          }}
        >
          404
        </motion.div>

        <p className="font-orbitron text-lg text-foreground mb-2">
          Esta página no está en el menú.
        </p>

        <p className="text-sm mb-8 max-w-sm mx-auto text-muted-foreground">
          No encontramos lo que buscabas. Probá volver al inicio.
        </p>

        <Link to="/" className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}>
          <Home className="w-4 h-4" />
          <span className="font-orbitron text-[10px] tracking-widest uppercase">Volver al inicio</span>
        </Link>
      </motion.div>
    </div>
  )
}
