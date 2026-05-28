import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { cn } from '../../utils/cn'

function useCountUp(target: number, ms = 2000) {
  const [value, setValue] = useState(0)
  const t = useMemo(() => Math.max(0, target), [target])

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = 0
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / ms)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from + (t - from) * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [t, ms])

  return value
}

export function StatCard({
  title,
  value,
  tone = 'cyan',
  icon,
  hint,
}: {
  title: string
  value: number
  tone?: 'cyan' | 'primary' | 'success' | 'warning'
  icon: ReactNode
  hint?: string
}) {
  const v = useCountUp(value, 2000)
  const toneClass =
    tone === 'primary'
      ? 'border-primary/40 shadow-[var(--tt-shadow-red)]'
      : tone === 'success'
        ? 'border-success/30 shadow-[var(--tt-shadow-green)]'
        : tone === 'warning'
          ? 'border-warning/30 shadow-[0_0_24px_rgba(255,145,0,0.18)]'
          : 'border-cyan/35 shadow-[var(--tt-shadow-cyan)]'

  const glow =
    tone === 'primary'
      ? 'text-primary'
      : tone === 'success'
        ? 'text-success'
        : tone === 'warning'
          ? 'text-warning'
          : 'text-cyan'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className={cn('tt-noise border', toneClass)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div className={cn('rounded-xl border border-border/50 bg-panel2/60 p-2', glow)}>
            <span className={cn('block', glow)} aria-hidden="true">
              {icon}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-3">
            <div className="font-heading text-3xl font-bold tracking-tight text-text">
              {v.toLocaleString()}
            </div>
            {hint ? <div className="text-xs text-muted">{hint}</div> : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

