import { cn } from '../../utils/cn'

export function RiskGauge({
  value,
  size = 74,
  stroke = 8,
  label,
}: {
  value: number
  size?: number
  stroke?: number
  label?: string
}) {
  const v = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (v / 100) * c
  const offset = c - dash

  const color =
    v >= 75 ? 'var(--tt-primary)' : v >= 45 ? 'var(--tt-warning)' : 'var(--tt-success)'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="rgba(0,188,212,0.14)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          strokeDashoffset={offset}
          style={{
            filter:
              v >= 75
                ? 'drop-shadow(0 0 10px rgba(255,23,68,0.45))'
                : v >= 45
                  ? 'drop-shadow(0 0 10px rgba(255,145,0,0.35))'
                  : 'drop-shadow(0 0 10px rgba(0,255,65,0.32))',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={cn('font-heading text-sm font-bold', v >= 75 ? 'text-primary' : v >= 45 ? 'text-warning' : 'text-success')}>
          {v}%
        </div>
        {label ? <div className="text-[10px] text-muted">{label}</div> : null}
      </div>
    </div>
  )
}

