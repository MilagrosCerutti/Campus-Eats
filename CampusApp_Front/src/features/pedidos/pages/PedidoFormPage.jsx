import { useState } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, Check, ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { formatCurrency, getMenuImageUrl } from '@/shared/utils'
import { TIPO_CONFIG } from '@/features/menus/constants'
import { usePedidoDetail } from '../hooks/usePedidoDetail'
import pedidoService from '../services/pedidoService'
import PedidoForm from '../components/PedidoForm'
import Spinner from '@/shared/components/Spinner'
import ErrorMessage from '@/shared/components/ErrorMessage'
import CommandHeader from '@/shared/components/CommandHeader'
import { EDITABLE_ESTADOS } from '../constants'
import { refreshMenuAvailability } from '@/features/menus/utils/menuAvailability'

/* ─── PREVIEW PANEL (panel derecho del espacio libre) ─────────── */

function MenuPreviewCard({ preview }) {
  const [imgFailed, setImgFailed] = useState(false)
  const { menu, total, cantidad } = preview
  const tipo = TIPO_CONFIG[menu.tipo] ?? TIPO_CONFIG.clasico
  const imageUrl = getMenuImageUrl(menu.imagenUrl)
  const hasImage = imageUrl && !imgFailed

  return (
    <motion.div
      key={menu.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_48px_-42px_rgba(57,48,35,0.75)]"
    >
      {hasImage ? (
        <img
          src={imageUrl}
          alt={menu.nombre}
          className="h-44 w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="flex h-28 items-center justify-center bg-secondary/50">
          <ImageOff className="size-8 text-muted-foreground/25" />
        </div>
      )}

      <div className="space-y-4 p-5">
        <div>
          <span
            className={cn(
              'text-[9px] font-orbitron tracking-wider uppercase border rounded px-1.5 py-px',
              tipo.badge
            )}
          >
            {tipo.label}
          </span>
          <h3 className="mt-2 font-orbitron text-sm font-bold leading-snug text-foreground">
            {menu.nombre}
          </h3>
        </div>

        {menu.descripcion && (
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-5">
            {menu.descripcion}
          </p>
        )}

        <div className="h-px bg-border" />

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Precio unitario</span>
            <span className="font-medium text-foreground">{formatCurrency(menu.precio)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Cupo disponible</span>
            <span className="font-medium text-foreground">
              {menu.cupoDisponible ?? menu.cupoDiario}
            </span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Cantidad seleccionada</span>
            <span className="font-medium text-foreground">×{cantidad}</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2.5">
          <span className="font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground">
            Total estimado
          </span>
          <span className="font-orbitron text-base font-bold text-foreground">
            {formatCurrency(total)}
          </span>
        </div>
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          El total definitivo lo recalcula el backend al confirmar.
        </p>
      </div>
    </motion.div>
  )
}

/* ─── SUCCESS OVERLAY ──────────────────────────────────────────── */

function SuccessOverlay({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 240, damping: 22 }}
        className="mx-4 w-full max-w-sm rounded-3xl border border-border bg-card p-8 text-center shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.16, type: 'spring', stiffness: 280, damping: 18 }}
          className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-emerald-500/12 ring-4 ring-emerald-500/18"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.28, type: 'spring', stiffness: 320, damping: 16 }}
            className="flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
          >
            <Check className="size-8 stroke-[2.5]" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="text-xl font-bold text-foreground"
        >
          {data.type === 'create' ? '¡Pedido creado!' : '¡Cambios guardados!'}
        </motion.h2>

        {data.nombre && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.44 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            {data.nombre}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.52 }}
          className="mt-5 font-orbitron text-[9px] tracking-[0.3em] uppercase text-primary"
        >
          Redirigiendo al detalle...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

/* ─── PAGE ─────────────────────────────────────────────────────── */

export default function PedidoFormPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { pedido, isLoading, error } = usePedidoDetail(isEdit ? id : null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [successData, setSuccessData] = useState(null)
  const [preview, setPreview] = useState(null)

  const preselectedMenuId = searchParams.get('menuId')

  async function handleSubmit(data) {
    setSubmitting(true)
    setSubmitError(null)
    try {
      if (isEdit) {
        const { menuId, cantidad, turnoEntrega, puntoRetiroId, observaciones } = data
        const updated = await pedidoService.updatePedido(id, {
          menuId,
          cantidad,
          turnoEntrega,
          puntoRetiroId,
          observaciones,
        })
        await refreshMenuAvailability().catch(() => null)
        setSuccessData({
          type: 'update',
          nombre: `${updated.menuNombre} · ${formatCurrency(updated.total)}`,
        })
        setTimeout(() => navigate(`/pedidos/${id}`, { replace: true }), 1800)
      } else {
        const created = await pedidoService.createPedido(data)
        setSuccessData({ type: 'create', nombre: created.menuNombre, id: created.id })
        setTimeout(() => navigate(`/pedidos/${created.id}`, { replace: true }), 1800)
      }
    } catch (err) {
      setSubmitError(err.response?.data?.error ?? 'No se pudo procesar el pedido')
    } finally {
      setSubmitting(false)
    }
  }

  const defaultValues =
    isEdit && pedido
      ? {
          menuId: pedido.menuId,
          fecha: pedido.fecha,
          cantidad: pedido.cantidad,
          turnoEntrega: pedido.turnoEntrega,
          puntoRetiroId: pedido.puntoRetiroId,
          observaciones: pedido.observaciones ?? '',
        }
      : preselectedMenuId
        ? { menuId: Number(preselectedMenuId) }
        : undefined

  return (
    <>
      <AnimatePresence>{successData && <SuccessOverlay data={successData} />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="order-form-consumer"
      >
        <CommandHeader
          eyebrow={isEdit ? 'Modificar orden' : 'Nueva orden'}
          title={isEdit ? 'Editar Pedido' : 'Solicitar Vianda'}
          code={isEdit ? `ORD / ${id}` : 'ORD / NEW'}
          description={
            isEdit
              ? 'Actualizá los datos permitidos antes de confirmar los cambios.'
              : 'Configurá la ración, entrega y cantidad de la nueva solicitud.'
          }
          back={
            <Link
              to={isEdit ? `/pedidos/${id}` : '/pedidos'}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'gap-1.5 -ml-2 mb-3 font-orbitron text-[9px] tracking-widest uppercase text-muted-foreground'
              )}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {isEdit ? 'Detalle' : 'Mis pedidos'}
            </Link>
          }
        />

        {isEdit && isLoading && <Spinner />}
        {isEdit && !isLoading && error && <ErrorMessage message={error} />}

        {isEdit && !isLoading && !error && pedido && !EDITABLE_ESTADOS.includes(pedido.estado) && (
          <ErrorMessage message="Solo se pueden editar pedidos pendientes o confirmados." />
        )}

        {(!isEdit ||
          (!isLoading && !error && pedido && EDITABLE_ESTADOS.includes(pedido.estado))) && (
          <div className={cn('flex items-start gap-6', !isEdit && 'max-w-5xl')}>
            {/* Formulario — mantiene su ancho original */}
            <div className="min-w-0 w-full max-w-3xl shrink-0">
              <PedidoForm
                isEdit={isEdit}
                pedidoInfo={
                  isEdit && pedido
                    ? { menuNombre: pedido.menuNombre, fecha: pedido.fecha }
                    : undefined
                }
                defaultValues={defaultValues}
                onSubmit={handleSubmit}
                isLoading={submitting}
                error={submitError}
                onPreviewChange={setPreview}
              />
            </div>

            {/* Panel lateral — usa el espacio blanco a la derecha */}
            <AnimatePresence>
              {preview && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3 }}
                  className="hidden lg:block w-72 shrink-0 sticky top-6"
                >
                  <p className="mb-3 font-orbitron text-[9px] tracking-[0.4em] uppercase text-primary">
                    Ración seleccionada
                  </p>
                  <MenuPreviewCard preview={preview} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </>
  )
}
