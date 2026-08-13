import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { User, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import pedidoService from '@/features/pedidos/services/pedidoService'
import LevelBadge from '../components/LevelBadge'
import LevelProgressCard from '../components/LevelProgressCard'
import TabDatosPersonales from '../components/TabDatosPersonales'
import TabSeguridad from '../components/TabSeguridad'
import TabMisPedidos from '../components/TabMisPedidos'

const TABS = [
  { id: 'datos', label: 'Datos personales', icon: User },
  { id: 'seguridad', label: 'Seguridad', icon: Shield },
  { id: 'pedidos', label: 'Mis pedidos', icon: null },
]

function Avatar({ nombre }) {
  const initial = nombre?.[0]?.toUpperCase() ?? '?'
  return (
    <div className={cn(
      'w-20 h-20 rounded-full flex items-center justify-center shrink-0',
      'bg-gradient-to-br from-primary/80 to-primary/40',
      'ring-2 ring-primary/40 ring-offset-2 ring-offset-background'
    )}>
      <span className="font-orbitron text-2xl font-bold text-white">{initial}</span>
    </div>
  )
}

export default function PerfilPage() {
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('datos')
  const [totalPedidos, setTotalPedidos] = useState(0)

  useEffect(() => {
    pedidoService.getPedidos({ limit: 1, page: 1 })
      .then((data) => setTotalPedidos(data.total ?? 0))
      .catch(() => setTotalPedidos(0))
  }, [])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5"
      >
        <Avatar nombre={user?.nombre} />
        <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
          <h1 className="font-orbitron text-xl font-bold text-foreground">{user?.nombre}</h1>
          <LevelBadge totalPedidos={totalPedidos} />
          <p className="text-sm text-muted-foreground">
            {isAdmin ? 'Administrador' : 'Estudiante'}
          </p>
        </div>
      </motion.div>

      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <LevelProgressCard totalPedidos={totalPedidos} />
        </motion.div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex border-b border-border px-4 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground border-b-2 border-transparent'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'datos' && <TabDatosPersonales user={user} />}
          {activeTab === 'seguridad' && <TabSeguridad />}
          {activeTab === 'pedidos' && <TabMisPedidos />}
        </div>
      </div>
    </div>
  )
}
