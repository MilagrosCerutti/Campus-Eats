import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const NativeSelect = React.forwardRef(function NativeSelect({ className, children, ...props }, ref) {
  return (
    <div className="relative min-w-0">
      <select
        ref={ref}
        data-slot="native-select"
        className={cn(
          "h-10 w-full appearance-none rounded-lg border border-input bg-secondary/40 px-3 pr-9 text-sm text-foreground outline-none transition-colors",
          "focus:border-ring focus:bg-card focus:ring-3 focus:ring-ring/20 hover:border-foreground/25",
          "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
})

export { NativeSelect }
