import { motion } from 'motion/react'
import { Award, Compass, Trophy } from 'lucide-react'

const BADGES = [
  { icon: Award, label: 'Primer pedido' },
  { icon: Compass, label: 'Explorador' },
  { icon: Trophy, label: 'Foodie del Campus' },
]

const STATS = [
  { value: '5 días', label: 'Racha' },
  { value: '4', label: 'Sedes visitadas' },
  { value: '3', label: 'Logros' },
]

export default function ProgressSection() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 inline-block rounded-full bg-soft-sage px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Progreso
          </span>
          <h2 className="font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
            Cada vianda cuenta.
          </h2>
          <p className="mt-2 text-warm-brown">Disfrutá, pedí y avanzá.</p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {BADGES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-charcoal"
              >
                <Icon className="size-4 text-primary" />
                {label}
              </span>
            ))}
          </div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-warm-brown">
            Sumás experiencia con cada pedido y desbloqueás logros a medida que descubrís nuevos menús y sedes del campus.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-border bg-card p-6 shadow-lg shadow-black/5 sm:p-8"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
              MC
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Nivel 3</p>
              <p className="font-semibold text-charcoal">Explorador Gastronómico</p>
              <p className="text-xs text-warm-brown">14 pedidos realizados</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-charcoal">Progreso de nivel</span>
              <span className="text-warm-brown">14 / 20</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '70%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-[#D98268]"
              />
            </div>
            <p className="mt-2 text-xs text-warm-brown">6 pedidos para alcanzar <span className="font-semibold text-charcoal">Foodie del Campus</span></p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-secondary/50 py-3 text-center">
                <p className="font-display text-lg font-bold text-charcoal">{stat.value}</p>
                <p className="mt-0.5 text-[11px] text-warm-brown">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
