export const ESTADO_CONFIG = {
  pendiente: {
    label:     'Pendiente',
    className: 'border-amber-500/40 text-amber-600 bg-amber-500/10',
    dot:       'bg-amber-500',
  },
  confirmado: {
    label:     'Confirmado',
    className: 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10',
    dot:       'bg-emerald-500',
  },
  entregado: {
    label:     'Entregado',
    className: 'border-sky-500/40 text-sky-600 bg-sky-500/10',
    dot:       'bg-sky-500',
  },
  cancelado: {
    label:     'Cancelado',
    className: 'border-[#D98268]/40 text-[#9A4A30] bg-[#D98268]/10',
    dot:       'bg-[#D98268]',
  },
}

export const TURNO_OPTIONS = [
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'cena',     label: 'Cena' },
]

export const ESTADOS_FILTER = [
  { value: '',           label: 'Todos' },
  { value: 'pendiente',  label: 'Pendiente' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'entregado',  label: 'Entregado' },
  { value: 'cancelado',  label: 'Cancelado' },
]

export const EDITABLE_ESTADOS = ['pendiente', 'confirmado']
export const CANCELABLE_ESTADOS = ['pendiente', 'confirmado']
