import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../utils/cn'

export type ToastTone = 'success' | 'warning' | 'info' | 'error'

export type ToastItem = {
  id: string
  title: string
  message?: string
  tone: ToastTone
}

type ToastContextValue = {
  push: (t: Omit<ToastItem, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

function iconFor(tone: ToastTone) {
  switch (tone) {
    case 'success':
      return CheckCircle2
    case 'warning':
      return AlertTriangle
    case 'error':
      return AlertTriangle
    default:
      return Info
  }
}

function toneClass(tone: ToastTone) {
  switch (tone) {
    case 'success':
      return 'border-success/60 shadow-[0_0_22px_rgba(0,255,65,0.18)]'
    case 'warning':
      return 'border-warning/60 shadow-[0_0_22px_rgba(255,145,0,0.18)]'
    case 'error':
      return 'border-primary/60 shadow-[0_0_22px_rgba(255,23,68,0.2)]'
    default:
      return 'border-cyan/55 shadow-[0_0_22px_rgba(0,188,212,0.14)]'
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = crypto.randomUUID()
    const item: ToastItem = { id, ...t }
    setItems((prev) => [item, ...prev].slice(0, 5))
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id))
    }, 4200)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed right-3 top-3 z-[60] flex w-[min(420px,calc(100vw-24px))] flex-col gap-2"
        aria-live="polite"
        aria-relevant="additions"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <ToastView
              key={t.id}
              item={t}
              onDismiss={() =>
                setItems((prev) => prev.filter((x) => x.id !== t.id))
              }
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function ToastView({
  item,
  onDismiss,
}: {
  item: ToastItem
  onDismiss: () => void
}) {
  const Icon = iconFor(item.tone)
  return (
    <motion.div
      className={cn(
        'tt-noise relative overflow-hidden rounded-2xl border bg-panel/80 px-4 py-3 backdrop-blur',
        toneClass(item.tone),
      )}
      initial={{ opacity: 0, x: 18, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 18, scale: 0.98 }}
      transition={{ duration: 0.22 }}
    >
      <div className="flex items-start gap-3">
        <Icon
          aria-hidden="true"
          className={cn(
            'mt-0.5 h-5 w-5',
            item.tone === 'success'
              ? 'text-success'
              : item.tone === 'warning'
                ? 'text-warning'
                : item.tone === 'error'
                  ? 'text-primary'
                  : 'text-cyan',
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="font-heading text-xs font-bold tracking-[0.08em] uppercase text-text">
            {item.title}
          </div>
          {item.message ? (
            <div className="mt-1 text-sm text-muted">{item.message}</div>
          ) : null}
        </div>
        <button
          type="button"
          className="rounded-lg p-1 text-muted transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70"
          aria-label="Dismiss notification"
          onClick={onDismiss}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/55 to-transparent opacity-60" />
    </motion.div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}

