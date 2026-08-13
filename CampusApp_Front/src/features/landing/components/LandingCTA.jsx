import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function LandingCTA() {
  return (
    <section className="bg-background px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-[#5F6E57] px-6 py-16 text-center sm:px-12 sm:py-20"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 20%, rgba(217,130,104,0.35), transparent 70%)' }}
        />

        <div className="relative z-10">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            ¿Listo para tu próxima vianda?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-white/85">
            Descubrí una nueva forma de vivir la comida en el campus.
          </p>
          <Link
            to="/register"
            className={cn(buttonVariants({ size: 'lg' }), 'mt-7 gap-2 rounded-full bg-white px-8 text-charcoal hover:bg-white/90')}
          >
            Empezar ahora <ArrowRight className="size-4" />
          </Link>

          <div className="mx-auto mt-10 max-w-xs border-t border-white/25 pt-6">
            <p className="font-display text-lg font-extrabold text-white">CampusEats</p>
            <p className="mt-1 text-sm text-white/75">Tu campus. Tu comida. Tu progreso.</p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
