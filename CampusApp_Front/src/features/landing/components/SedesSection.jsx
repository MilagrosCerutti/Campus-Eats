import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Building2, MapPin } from 'lucide-react'
import campusMap from '../../../assets/landing/campus-map-vgvEJON3.jpg'
import sedeService from '@/features/sedes/services/sedeService'

const MAP_PINS = [
  { label: 'Cafetería Central', className: 'left-[8%] top-[28%]' },
  { label: 'Patio Norte', className: 'right-[10%] top-[42%]' },
  { label: 'Biblioteca', className: 'left-[16%] bottom-[14%]' },
  { label: 'Terraza Universitaria', className: 'right-[6%] bottom-[10%]' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export default function SedesSection() {
  const [sedes, setSedes] = useState([])

  useEffect(() => {
    let cancelled = false
    sedeService.getSedes({ activo: 1 })
      .then((data) => { if (!cancelled && Array.isArray(data)) setSedes(data.slice(0, 4)) })
      .catch(() => { if (!cancelled) setSedes([]) })
    return () => { cancelled = true }
  }, [])

  return (
    <section id="sedes" className="bg-secondary/40 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-14 flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="rounded-full bg-soft-sage px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Sedes
          </span>
          <h2 className="font-display text-3xl font-extrabold text-charcoal sm:text-4xl">
            Encontrá tu sede.
          </h2>
          <p className="max-w-md text-warm-brown">Elegí el lugar que mejor se adapte a tu día.</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl border border-border shadow-lg shadow-black/5"
          >
            <img src={campusMap} alt="Ilustración del campus universitario con sus sedes" className="w-full object-cover" />
            {MAP_PINS.map((pin) => (
              <span
                key={pin.label}
                className={`absolute inline-flex items-center gap-1.5 rounded-full border border-border bg-card/95 px-3 py-1.5 text-xs font-medium text-charcoal shadow-sm backdrop-blur-sm ${pin.className}`}
              >
                <MapPin className="size-3 text-primary" />
                {pin.label}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="flex flex-col gap-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {sedes.map((sede) => (
              <motion.div
                key={sede.id}
                variants={itemVariants}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-soft-sage text-primary">
                  <Building2 className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-charcoal">{sede.nombre}</p>
                  <p className="truncate text-sm text-warm-brown">{sede.direccion || 'Punto de retiro del campus'}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-warm-brown" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
