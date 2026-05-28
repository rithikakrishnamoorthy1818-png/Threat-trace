import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { cn } from '../../utils/cn'
import type { RiskPredictionResult } from '../../types'

function gaugeColor(pct: number) {
  if (pct >= 70) return 'from-primary to-red-600'
  if (pct >= 30) return 'from-warning to-amber-500'
  return 'from-success to-emerald-500'
}

function GaugeBar({ label, value, na }: { label: string; value: number; na?: boolean }) {
  const pct = Math.round(value * 100)
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-semibold text-text">{label}</span>
        <span className="text-muted">{na ? 'N/A' : `${pct}%`}</span>
      </div>
      <div className="h-3 rounded-full border border-border/60 bg-panel2/60 p-0.5">
        {!na ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={cn('h-full rounded-full bg-gradient-to-r', gaugeColor(pct))}
          />
        ) : (
          <div className="h-full w-full rounded-full bg-panel2/40" />
        )}
      </div>
    </div>
  )
}

export function RiskPredictionPanel({ prediction, scanKind }: { prediction: RiskPredictionResult; scanKind: 'file' | 'url' }) {
  const overallPct = Math.round(prediction.overallRisk * 100)

  return (
    <Card className="tt-noise">
      <CardHeader>
        <CardTitle>ML Risk Prediction</CardTitle>
        <div className="text-xs text-muted">Pattern analysis · entropy, APIs, behaviors</div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-2xl border border-border/60 bg-panel2/25 p-4 text-center">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">Overall Risk</div>
          <div className="mt-2 font-heading text-4xl font-bold text-text">{overallPct}%</div>
          <div className={cn('mt-1 text-sm font-semibold', overallPct >= 70 ? 'text-primary' : overallPct >= 30 ? 'text-warning' : 'text-success')}>
            {overallPct >= 70 ? 'HIGH RISK' : overallPct >= 30 ? 'ELEVATED' : 'LOW RISK'}
          </div>
        </div>

        <div className="space-y-3">
          <GaugeBar label="Malware" value={prediction.malwareProbability} />
          <GaugeBar
            label="Ransomware"
            value={prediction.ransomwareProbability}
            na={scanKind === 'url'}
          />
          <GaugeBar
            label="Phishing"
            value={prediction.phishingProbability}
            na={scanKind === 'file'}
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">Threat Analysis</div>
          {prediction.threatTypes.map((t) => (
            <div key={t.type} className="rounded-xl border border-border/50 bg-panel2/30 p-3">
              <div className="flex justify-between text-sm font-semibold">
                <span>{t.type}</span>
                <span>{Math.round(t.probability * 100)}%</span>
              </div>
              <p className="mt-1 text-xs text-muted">{t.explanation}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
