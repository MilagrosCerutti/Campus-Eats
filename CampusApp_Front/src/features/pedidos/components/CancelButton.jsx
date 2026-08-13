import { useState } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import pedidoService from '../services/pedidoService'
import { refreshMenuAvailability } from '@/features/menus/utils/menuAvailability'

export default function CancelButton({ pedidoId, onSuccess, size = 'default', className }) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function handleCancel() {
    setLoading(true)
    try {
      const updated = await pedidoService.cancelar(pedidoId)
      await refreshMenuAvailability().catch(() => null)
      toast.success('Pedido cancelado', { description: `La orden #${pedidoId} quedó anulada.` })
      onSuccess?.(updated)
    } catch (err) {
      toast.error('No se pudo cancelar el pedido', { description: err.response?.data?.error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size={size === 'sm' ? 'sm' : 'default'}
        onClick={() => setOpen(true)}
        className={cn('gap-1.5', className)}
      >
        <X className="size-3.5" /> Cancelar
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="¿Cancelar este pedido?"
        description="El pedido quedará anulado y esta acción no se puede deshacer."
        confirmLabel="Cancelar pedido"
        variant="destructive"
        isLoading={loading}
        onConfirm={handleCancel}
      />
    </>
  )
}
