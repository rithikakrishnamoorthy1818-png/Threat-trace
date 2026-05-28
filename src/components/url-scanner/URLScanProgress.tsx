import { Check, X } from 'lucide-react'
import { Button } from '../common/Button'
import { ProgressBar } from '../upload/ProgressBar'
import { truncateMiddle } from '../../utils/formatters'
import { cn } from '../../utils/cn'

export type BatchProgressItem = {
  url: string
  ok: boolean
}

export function URLScanProgress({
  currentIndex,
  total,
  currentUrl,
  completed,
  onCancel,
}: {
  currentIndex: number
  total: number
  currentUrl: string
  completed: BatchProgressItem[]
  onCancel: () => void
}) {
  const pct = total > 0 ? Math.round((currentIndex / total) * 100) : 0
  const remaining = Math.max(0, total - currentIndex)
  const etaSec = remaining * 2

  return (
    <div className="tt-noise tt-scanline rounded-2xl border border-border/60 bg-panel/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-heading text-sm font-bold tracking-wide uppercase text-text">
          Batch scan in progress
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="mt-3 text-sm text-muted">
        {currentIndex}/{total} URLs scanned
      </div>
      <div className="mt-2">
        <ProgressBar value={pct} tone="cyan" />
      </div>
      <div className="mt-2 text-xs text-muted">
        Current: <span className="text-text">{truncateMiddle(currentUrl, 56)}</span>
      </div>
      <div className="mt-1 text-xs text-muted">
        Est. time remaining: ~{etaSec}s
      </div>

      {completed.length > 0 ? (
        <ul className="mt-4 max-h-40 space-y-1 overflow-auto">
          {completed.map((c) => (
            <li
              key={c.url}
              className="flex items-center gap-2 rounded-lg border border-border/40 bg-panel2/30 px-2 py-1 text-xs"
            >
              {c.ok ? (
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              ) : (
                <X className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              )}
              <span className={cn('truncate', c.ok ? 'text-text' : 'text-primary')}>
                {truncateMiddle(c.url, 52)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
