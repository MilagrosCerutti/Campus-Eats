import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * @param {{ page: number, totalPages: number, onChange: (page: number) => void, className?: string }} props
 */
export default function Pagination({ page, totalPages, onChange, className }) {
  if (!totalPages || totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  return (
    <nav aria-label="Paginación" className={cn('filter-console flex items-center justify-center gap-1.5 mt-7 w-fit mx-auto', className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {visible.reduce((acc, p, idx) => {
        const prev = visible[idx - 1]
        if (prev && p - prev > 1) {
          acc.push(
            <span key={`gap-${p}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground text-sm">
              …
            </span>
          )
        }
        acc.push(
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              'w-8 h-8 rounded-lg border text-sm font-medium transition-all duration-150',
              p === page
                ? 'bg-[#E11D48]/10 border-[#E11D48]/40 text-[#E11D48]'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            {p}
          </button>
        )
        return acc
      }, [])}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </nav>
  )
}
