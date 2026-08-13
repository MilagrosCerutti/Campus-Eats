import { motion } from 'motion/react'

const STEPS = [
  { number: '01', title: 'Elegí', description: 'Explorá los menús disponibles.' },
  { number: '02', title: 'Pedí', description: 'Elegí tu vianda y realizá tu pedido.' },
  { number: '03', title: 'Retirá', description: 'Seleccioná la sede donde querés retirar tu pedido.' },
  { number: '04', title: 'Disfrutá', description: 'Retirá tu comida y seguí con tu día.' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-secondary/40 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="rounded-full bg-soft-sage px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Cómo funciona
          </span>
          <h2 className="font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
            Tu comida, a tu ritmo.
          </h2>
          <p className="max-w-md text-warm-brown">
            Pedí en pocos pasos y aprovechá mejor tu tiempo en el campus.
          </p>
        </motion.div>

        <motion.div
          className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="pointer-events-none absolute top-[2.1rem] left-0 right-0 hidden h-px bg-border lg:block" />

          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="relative z-10 grid size-11 place-items-center rounded-full bg-soft-sage text-sm font-bold text-primary">
                {step.number}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-charcoal">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-warm-brown">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
