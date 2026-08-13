import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import lifestyleCampus from '../../../assets/landing/lifestyle-campus-2gxZTEx4.jpg'

export default function PhotoBannerSection() {
  return (
    <section id="sobre-campuseats" className="bg-background px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem]"
      >
        <img
          src={lifestyleCampus}
          alt="Estudiantes universitarios almorzando juntos en el campus"
          className="h-[420px] w-full object-cover sm:h-[480px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
          <h2 className="font-display max-w-lg text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Tu día empieza acá.
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/85 sm:text-base">
            Entre clases, trabajos y parciales, dejá que la comida sea la parte fácil.
          </p>
          <a href="#menus" className={cn(buttonVariants(), 'mt-6 gap-2 rounded-full bg-white px-6 text-charcoal hover:bg-white/90')}>
            Conocé CampusEats <ArrowRight className="size-4" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
