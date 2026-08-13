import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = '¿Confirmar acción?',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  isLoading = false,
  onConfirm,
}) {
  const destructive = variant === 'destructive'
  async function handleConfirm() {
    await onConfirm?.()
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="overflow-hidden border-border bg-card p-0 shadow-2xl sm:max-w-md">
        <DialogHeader className="p-5 pb-4">
          <div className={destructive ? 'confirm-dialog__icon confirm-dialog__icon--danger' : 'confirm-dialog__icon'}>
            {destructive ? <AlertTriangle /> : <CheckCircle2 />}
          </div>
          <DialogTitle className="pt-2 text-lg font-semibold text-foreground">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter className="m-0 rounded-none px-5 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructiveSolid' : 'default'}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
