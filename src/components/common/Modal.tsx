import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import { Button } from './Button'

export function Modal({
  open,
  title,
  children,
  onClose,
  className,
}: {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
  className?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className={cn(
              'relative w-full max-w-2xl rounded-2xl border border-cyan/35 bg-panel/90 shadow-[0_0_40px_rgba(0,188,212,0.18)]',
              className,
            )}
            initial={{ y: 10, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border/50 px-5 py-4">
              <div className="min-w-0">
                {title ? (
                  <h2 className="font-heading font-bold tracking-wide text-text">
                    {title}
                  </h2>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close"
                onClick={onClose}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

