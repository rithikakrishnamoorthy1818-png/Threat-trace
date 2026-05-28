import { LoaderCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

export function LoadingSpinner({
  label = 'Loading…',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-3 text-sm text-muted', className)}>
      <LoaderCircle
        aria-hidden="true"
        className="h-5 w-5 animate-spin text-cyan drop-shadow-[0_0_12px_rgba(0,188,212,0.6)]"
      />
      <span className="font-body">{label}</span>
    </div>
  )
}

