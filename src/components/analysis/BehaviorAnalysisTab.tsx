import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { cn } from '../../utils/cn'
import type { FileAnalysisDetail } from '../../types'

const TACTIC_META: Record<string, { label: string; severity: 'high' | 'medium' | 'low'; color: string }> = {
  persistence: { label: 'Persistence', severity: 'high', color: '#ff1744' },
  defense_evasion: { label: 'Defense Evasion', severity: 'medium', color: '#ff9100' },
  execution: { label: 'Execution', severity: 'high', color: '#ff1744' },
  lateral_movement: { label: 'Lateral Movement', severity: 'medium', color: '#ff9100' },
  exfiltration: { label: 'Exfiltration', severity: 'high', color: '#ff1744' },
  command_control: { label: 'Command & Control', severity: 'high', color: '#b388ff' },
  impact: { label: 'Impact', severity: 'high', color: '#ff1744' },
}

export function BehaviorAnalysisTab({ detail }: { detail: FileAnalysisDetail }) {
  const tactics = useMemo(
    () => Object.entries(detail.behaviors).filter(([, v]) => v.length > 0),
    [detail.behaviors],
  )
  const [selected, setSelected] = useState(tactics[0]?.[0] ?? '')

  const predictedProcesses = useMemo(() => {
    const out: { name: string; action: string; reason: string; risk: string }[] = []
    if (detail.behaviors.persistence?.length) {
      out.push({
        name: 'svchost.exe',
        action: 'Create/Modify',
        reason: 'May inject into legitimate system service',
        risk: 'high',
      })
    }
    if (detail.suspiciousStrings.some((s) => ['cmd.exe', 'powershell'].includes(s))) {
      out.push({
        name: 'cmd.exe / powershell.exe',
        action: 'Create',
        reason: 'Shell spawn for command execution',
        risk: 'high',
      })
    }
    return out
  }, [detail])

  if (!tactics.length) {
    return (
      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Predicted Behaviors</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          No MITRE ATT&amp;CK behaviors detected in static analysis.
        </CardContent>
      </Card>
    )
  }

  const activeItems = selected ? detail.behaviors[selected] ?? [] : []
  const meta = TACTIC_META[selected]

  return (
    <div className="space-y-4">
      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Predicted Behaviors (MITRE ATT&amp;CK)</CardTitle>
          <div className="text-xs text-muted">Static behavioral inference from file strings</div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tactics.map(([key]) => {
              const m = TACTIC_META[key]!
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={cn(
                    'rounded-xl border px-3 py-2 text-sm font-semibold transition-all',
                    selected === key
                      ? 'border-cyan/50 bg-panel2/60 text-text shadow-[0_0_16px_rgba(0,188,212,0.15)]'
                      : 'border-border/50 text-muted hover:text-text hover:border-cyan/30',
                  )}
                  style={{ borderLeftColor: m.color, borderLeftWidth: 3 }}
                >
                  {m.label}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-4 rounded-2xl border border-border/60 bg-panel2/25 p-4"
            >
              <div className="text-sm font-bold" style={{ color: meta?.color }}>
                {meta?.label}
              </div>
              <ul className="mt-3 space-y-2">
                {activeItems.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-text">
                    <span className="text-cyan">▸</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {predictedProcesses.length > 0 ? (
        <Card className="tt-noise">
          <CardHeader>
            <CardTitle>Predicted Process Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {predictedProcesses.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2 text-sm"
              >
                <div className="font-semibold text-text">
                  {p.name}{' '}
                  <span className="text-xs text-muted">({p.action})</span>
                </div>
                <div className="text-xs text-muted">{p.reason}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
