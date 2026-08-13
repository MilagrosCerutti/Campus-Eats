import { useEffect, useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

export default function AccessDeniedDialog() {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const handler = (event) => setMessage(event.detail || 'Tu cuenta no tiene permisos para realizar esta operación.')
    window.addEventListener('auth:forbidden', handler)
    return () => window.removeEventListener('auth:forbidden', handler)
  }, [])

  return (
    <Dialog open={!!message} onOpenChange={(open) => { if (!open) setMessage(null) }}>
      <DialogContent showCloseButton={false} className="overflow-hidden border-border bg-card p-0 shadow-2xl sm:max-w-md">
        <DialogHeader className="p-5 pb-4">
          <span className="confirm-dialog__icon confirm-dialog__icon--danger"><ShieldAlert /></span>
          <DialogTitle className="pt-2 text-lg font-semibold text-foreground">Acceso denegado</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="m-0 rounded-none px-5 py-4">
          <Button onClick={() => setMessage(null)}>Entendido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
