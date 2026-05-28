import { cn } from '../../utils/cn'

export function ProgressBar({
  value,
  tone = 'cyan',
}: {
  value: number
  tone?: 'cyan' | 'primary' | 'success' | 'warning'
}) {
  const v = Math.max(0, Math.min(100, value))
  const color =
    tone === 'primary'
      ? 'bg-primary'
      : tone === 'success'
        ? 'bg-success'
        : tone === 'warning'
          ? 'bg-warning'
          : 'bg-cyan'

  return (
    <div className="h-3 w-full rounded-full border border-border/60 bg-panel2/60 p-0.5">
      <div
        className={cn(
          'h-full rounded-full transition-all duration-300',
          color,
        )}
        style={{
          width: `${v}%`,
          boxShadow:
            tone === 'primary'
              ? '0 0 16px rgba(255,23,68,0.35)'
              : tone === 'success'
                ? '0 0 16px rgba(0,255,65,0.22)'
                : tone === 'warning'
                  ? '0 0 16px rgba(255,145,0,0.22)'
                  : '0 0 16px rgba(0,188,212,0.25)',
        }}
      />
    </div>
  )
}

