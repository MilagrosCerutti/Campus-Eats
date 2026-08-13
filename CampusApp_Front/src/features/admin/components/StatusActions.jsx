import { useState } from 'react'
import { CheckCircle2, PackageCheck, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import adminService from '../services/adminService'
import { refreshMenuAvailability } from '@/features/menus/utils/menuAvailability'

const ACTIONS = {
  pendiente: [
    {
      key: 'confirmar',
      label: 'Confirmar',
      icon: CheckCircle2,
      call: adminService.confirmar,
      variant: 'default',
      description: 'El pedido pasará de pendiente a confirmado y quedará listo para preparar.',
    },
    {
      key: 'cancelar',
      label: 'Cancelar',
      icon: X,
      call: adminService.cancelar,
      variant: 'destructive',
      description: 'El pedido quedará cancelado y esta acción no se puede deshacer.',
    },
  ],
  confirmado: [
    {
      key: 'entregar',
      label: 'Entregar',
      icon: PackageCheck,
      call: adminService.entregar,
      variant: 'default',
      description: 'El pedido pasará a entregado y finalizará su recorrido operativo.',
    },
    {
      key: 'cancelar',
      label: 'Cancelar',
      icon: X,
      call: adminService.cancelar,
      variant: 'destructive',
      description: 'El pedido quedará cancelado y esta acción no se puede deshacer.',
    },
  ],
}

export default function StatusActions({ pedido, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const actions = ACTIONS[pedido.estado]

  if (!actions) return <span className="text-xs text-muted-foreground">—</span>

  async function handleAction() {
    if (!selected) return
    setLoading(true)
    try {
      const updated = await selected.call(pedido.id)
      if (selected.key === 'cancelar' || selected.key === 'entregar') {
        await refreshMenuAvailability().catch(() => null)
      }
      toast.success(`Pedido #${pedido.id} actualizado`, {
        description: `Nuevo estado: ${selected.label.toLowerCase()}.`,
      })
      onSuccess?.(updated)
    } catch (err) {
      toast.error('No se pudo realizar la acción', { description: err.response?.data?.error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.key}
              type="button"
              variant={action.variant}
              size="sm"
              onClick={() => setSelected(action)}
              aria-label={`${action.label} pedido #${pedido.id}`}
              title={action.label}
              className="gap-1.5"
            >
              <Icon className="size-3.5" />
              <span className="hidden xl:inline">{action.label}</span>
            </Button>
          )
        })}
      </div>
      <ConfirmDialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
        title={`${selected?.label ?? 'Actualizar'} pedido #${pedido.id}`}
        description={selected?.description}
        confirmLabel={selected?.label}
        variant={selected?.variant}
        isLoading={loading}
        onConfirm={handleAction}
      />
    </>
  )
}
