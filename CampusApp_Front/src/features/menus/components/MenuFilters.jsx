import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DateInput } from '@/components/ui/date-input'
import { TIPOS_FILTER } from '../constants'

export default function MenuFilters({ filters, onChange }) {
  const hasActive = filters.tipo !== '' || filters.fecha !== ''

  return (
    <div className="filter-console flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Tipo pills */}
      <div className="flex flex-wrap gap-2">
        {TIPOS_FILTER.map(({ value, label, activeClass }) => {
          const active = filters.tipo === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...filters, tipo: value, page: 1 })}
              className={cn(
                'px-3.5 py-1.5 rounded-md border text-sm font-medium transition-all duration-150',
                active
                  ? activeClass
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex min-w-0 flex-col gap-2 sm:ml-auto sm:flex-row">
        {/* Date input */}
        <div className="min-w-0 flex-1 sm:w-44">
          <DateInput
            value={filters.fecha}
            onChange={(e) => onChange({ ...filters, fecha: e.target.value, page: 1 })}
            aria-label="Filtrar por fecha"
          />
        </div>

        {/* Clear */}
        {hasActive && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, tipo: '', fecha: '', page: 1 })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
          >
            <X className="w-3.5 h-3.5" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
