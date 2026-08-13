import { Button } from '@/components/ui/button'
import AlertBanner from './AlertBanner'

export default function ErrorMessage({
  message = 'Ocurrió un error inesperado en el sistema.',
  onRetry,
}) {
  return (
    <AlertBanner
      variant="error"
      title="No pudimos completar la operación"
      className="my-4"
      action={onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    >
      {message}
    </AlertBanner>
  )
}
