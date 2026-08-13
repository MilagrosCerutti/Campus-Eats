"use client"

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border border-border bg-secondary/40 p-1',
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        'relative inline-flex items-center gap-2 rounded-lg px-4 py-1.5 font-orbitron text-[10px] tracking-widest uppercase text-muted-foreground transition-colors outline-none cursor-pointer',
        'data-[active]:bg-primary data-[active]:text-primary-foreground data-[active]:shadow-sm',
        'hover:text-foreground data-[active]:hover:text-primary-foreground',
        'disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Panel
      className={cn('outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
