import { motion } from 'motion/react'
import { CalendarCheck, Salad, Star, Zap } from 'lucide-react'

const BENEFICIOS = [
  { icon: Zap, title: 'Rápido', description: 'Pedí sin perder tiempo entre clases.' },
  { icon: CalendarCheck, title: 'Organizado', description: 'Sabé cuándo y dónde retirar tu vianda.' },
  { icon: Salad, title: 'Variado', description: 'Encontrá opciones para distintos gustos.' },
  { icon: Star, title: 'Con progreso', description: 'Cada pedido suma a tu experiencia.' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export default function FeaturesSection() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="rounded-full bg-soft-sage px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Beneficios
          </span>
          <h2 className="max-w-2xl font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
            Todo lo que necesitás para comer mejor en el campus.
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {BENEFICIOS.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-warm-brown">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 font-semibold text-charcoal">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-warm-brown">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
