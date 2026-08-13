import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

const VARIANTS = {
  error: { Icon: AlertCircle, className: 'alert-banner--error' },
  warning: { Icon: TriangleAlert, className: 'alert-banner--warning' },
  success: { Icon: CheckCircle2, className: 'alert-banner--success' },
  info: { Icon: Info, className: 'alert-banner--info' },
}

export default function AlertBanner({ title, children, variant = 'info', className, action }) {
  const config = VARIANTS[variant] ?? VARIANTS.info
  const { Icon } = config

  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className={cn('alert-banner', config.className, className)}>
      <span className="alert-banner__icon"><Icon /></span>
      <div className="min-w-0 flex-1">
        {title && <p className="alert-banner__title">{title}</p>}
        <div className="alert-banner__description">{children}</div>
      </div>
      {action}
    </div>
  )
}
