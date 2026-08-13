import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import heroFood from '../../../assets/landing/hero-food-DJo2kg1i.jpg'
import bowlVerde from '../../../assets/landing/bowl-verde-D7BZu0Tv.jpg'

const AVATARS = [
  { letter: 'A', bg: '#75866B' },
  { letter: 'M', bg: '#D98268' },
  { letter: 'L', bg: '#5F6E57' },
  { letter: 'J', bg: '#765A4A' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

function FloatingCard({ className, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 + delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export default function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-background px-6 pt-14 pb-24 sm:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-12">
        {/* Copy */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-warm-brown"
          >
            <Sparkles className="size-3.5 text-primary" />
            Tu campus. Tu comida. Tu progreso.
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-charcoal sm:text-6xl">
            Comé bien.
            <br />
            <span className="text-primary">Viví el campus.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 max-w-md text-base leading-relaxed text-warm-brown sm:text-lg">
            Pedí tu vianda favorita, elegí dónde retirarla y seguí disfrutando tu día.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className={cn(buttonVariants({ size: 'lg' }), 'rounded-full px-7 gap-2')}>
              Empezar ahora <ArrowRight className="size-4" />
            </Link>
            <a
              href="#menus"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-full bg-card px-7')}
            >
              Explorar CampusEats
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 flex items-center gap-4 border-t border-border pt-6">
            <div className="flex -space-x-2.5">
              {AVATARS.map((a) => (
                <span
                  key={a.letter}
                  className="grid size-9 place-items-center rounded-full border-2 border-background text-xs font-bold text-white"
                  style={{ backgroundColor: a.bg }}
                >
                  {a.letter}
                </span>
              ))}
            </div>
            <p className="text-sm text-warm-brown">
              Una forma más simple de disfrutar tus comidas en el campus.
            </p>
          </motion.div>
        </motion.div>

        {/* Imagen + tarjetas flotantes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-black/10">
            <img
              src={heroFood}
              alt="Bowl de comida saludable servido en el campus"
              className="aspect-[5/6] w-full object-cover"
            />
          </div>

          <FloatingCard className="absolute -left-4 top-6 w-52 sm:-left-8 sm:top-10 sm:w-60">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-lg shadow-black/10">
              <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-secondary">
                <img src={bowlVerde} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-charcoal">Pedido listo</p>
                <p className="truncate text-xs text-warm-brown">Retiro 12:40 · Biblioteca</p>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard delay={0.6} className="absolute -bottom-6 -left-4 w-56 sm:-bottom-8 sm:-left-10 sm:w-64">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/10">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Nivel 3</span>
                <Star className="size-3.5 fill-primary text-primary" />
              </div>
              <p className="text-sm font-semibold text-charcoal">Explorador Gastronómico</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[70%] rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-warm-brown">14 pedidos realizados</p>
            </div>
          </FloatingCard>

          <FloatingCard delay={1.1} className="absolute -right-3 bottom-16 w-44 sm:-right-8 sm:bottom-20 sm:w-52">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/10">
              <p className="px-3 pt-3 text-xs font-bold text-charcoal">
                Campus<span className="text-primary">Eats</span>
              </p>
              <img src={bowlVerde} alt="" className="mt-2 h-20 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold text-charcoal">Bowl Verde</p>
                <p className="text-xs text-warm-brown">Vegano · $4.800</p>
                <div className="mt-2 rounded-full bg-primary py-1.5 text-center text-xs font-semibold text-primary-foreground">
                  Pedir ahora
                </div>
                <p className="mt-1.5 text-[11px] text-warm-brown">📍 Patio Norte</p>
              </div>
            </div>
          </FloatingCard>
        </motion.div>
      </div>
    </section>
  )
}
