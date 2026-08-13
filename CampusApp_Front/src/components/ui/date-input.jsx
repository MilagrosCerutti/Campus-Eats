import * as React from 'react'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const DateInput = React.forwardRef(function DateInput({ className, ...props }, ref) {
  return (
    <div className="relative min-w-0">
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        type="date"
        className={cn(
          'h-10 w-full min-w-0 rounded-lg border border-input bg-secondary/40 pl-10 pr-3 text-sm text-foreground outline-none transition-colors [color-scheme:light]',
          'focus:border-primary/50 focus:bg-card focus:ring-3 focus:ring-primary/20',
          'disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive',
          className
        )}
        {...props}
      />
    </div>
  )
})

export { DateInput }
