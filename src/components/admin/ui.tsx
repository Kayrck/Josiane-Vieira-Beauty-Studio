'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/components/ui/utils'
import { buttonClass, type ButtonVariant } from './styles'

/* ───────────── Botão ───────────── */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  loading?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, className)}
      {...rest}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

/* ───────────── Campo com rótulo, dica e erro ───────────── */

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-espresso">
        {label}
        {optional && <span className="ml-1.5 font-normal text-espresso/50">(opcional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-espresso/55">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** aria-describedby coerente com o <Field>. */
export function describedBy(id: string, error?: string, hasHint = false) {
  if (error) return `${id}-error`
  return hasHint ? `${id}-hint` : undefined
}

/* ───────────── Selo de status ───────────── */

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium',
        active ? 'bg-emerald-100 text-emerald-800' : 'bg-espresso/10 text-espresso/60',
      )}
    >
      <span className={cn('size-1.5 rounded-full', active ? 'bg-emerald-600' : 'bg-espresso/40')} aria-hidden />
      {active ? 'Ativo' : 'Inativo'}
    </span>
  )
}

/* ───────────── Interruptor ───────────── */

export function Switch({
  id,
  checked,
  onChange,
  disabled,
  children,
}: {
  id: string
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          // o ::before amplia a área de toque para 64×48 px sem mudar o desenho do interruptor
          "relative h-8 w-14 shrink-0 rounded-full transition-colors before:absolute before:-inset-x-1 before:-inset-y-2 before:content-[''] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60",
          checked ? 'bg-emerald-600' : 'bg-espresso/25',
        )}
      >
        <span
          className={cn(
            'absolute left-1 top-1 size-6 rounded-full bg-white shadow transition-transform',
            checked && 'translate-x-6',
          )}
        />
      </button>
      <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
        {children}
      </label>
    </div>
  )
}

/* ───────────── Avisos (toasts) ───────────── */

type ToastKind = 'success' | 'error'
type ToastItem = { id: number; kind: ToastKind; message: string }
type ToastApi = { success: (message: string) => void; error: (message: string) => void }

const ToastContext = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = ++counter.current
    setItems((list) => [...list.slice(-2), { id, kind, message }])
    window.setTimeout(
      () => setItems((list) => list.filter((t) => t.id !== id)),
      kind === 'error' ? 7000 : 4000,
    )
  }, [])

  const api = useMemo<ToastApi>(
    () => ({ success: (m) => push('success', m), error: (m) => push('error', m) }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className={cn(
              'pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl px-4 py-3 text-sm shadow-[0_18px_40px_-14px_rgba(46,37,32,0.6)]',
              t.kind === 'error' ? 'bg-destructive text-destructive-foreground' : 'bg-espresso text-white',
            )}
          >
            {t.kind === 'error' ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-champagne" aria-hidden />
            )}
            <span className="leading-relaxed">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>.')
  return ctx
}

/* ───────────── Confirmação (usa o <dialog> nativo: foco, Esc e acessibilidade prontos) ───────────── */

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  tone = 'default',
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel: string
  cancelLabel?: string
  tone?: 'default' | 'danger'
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault() // Esc
        if (!busy) onCancel()
      }}
      onClick={(e) => {
        if (e.target === ref.current && !busy) onCancel() // clique no fundo
      }}
      aria-labelledby="confirm-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[1.4rem] border border-border bg-card p-0 text-espresso shadow-2xl backdrop:bg-espresso/55"
    >
      <div className="p-6">
        <h2 id="confirm-title" className="font-display text-2xl leading-tight text-espresso">
          {title}
        </h2>
        <div className="mt-3 text-[0.95rem] leading-relaxed text-espresso/70">{description}</div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} loading={busy}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  )
}

/* ───────────── Esqueleto de carregamento ───────────── */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-espresso/10', className)} aria-hidden />
}
