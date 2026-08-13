import { motion } from 'motion/react'
import { Star } from 'lucide-react'

const TESTIMONIOS = [
  { quote: 'Ahora puedo pedir mi almuerzo antes de entrar a clase.', name: 'Martina G.', role: 'Estudiante de Diseño', bg: '#75866B' },
  { quote: 'Me encanta ver cuánto me falta para subir de nivel.', name: 'Julián R.', role: 'Estudiante de Ingeniería', bg: '#D98268' },
  { quote: 'Mucho más fácil que hacer cola en el buffet.', name: 'Lucía P.', role: 'Estudiante de Medicina', bg: '#765A4A' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function TestimonialsSection() {
  return (
    <section className="bg-secondary/40 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="rounded-full bg-soft-sage px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Testimonios
          </span>
          <h2 className="max-w-xl font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
            Lo que dicen quienes ya lo probaron.
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-5 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {TESTIMONIOS.map((t) => (
            <motion.div key={t.name} variants={itemVariants} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-1 text-[#D98268]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-charcoal">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span
                  className="grid size-9 place-items-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: t.bg }}
                >
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                  <p className="text-xs text-warm-brown">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
