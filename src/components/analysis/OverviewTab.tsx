import { Copy, FileDigit, Share2 } from 'lucide-react'
import type { AnalysisOverview } from '../../types'
import { Button } from '../common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import { RiskGauge } from '../dashboard/RiskGauge'
import { formatBytes, formatDateTime } from '../../utils/formatters'
import { useNotification } from '../../hooks/useNotification'

function HashRow({ label, value }: { label: string; value: string }) {
  const notify = useNotification()
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
      <div className="min-w-0">
        <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
          {label}
        </div>
        <div className="truncate font-heading text-sm text-text">{value}</div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Copy ${label}`}
        onClick={async () => {
          await navigator.clipboard.writeText(value)
          notify.success('Copied', `${label} copied to clipboard.`)
        }}
      >
        <Copy className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  )
}

export function OverviewTab({ overview }: { overview: AnalysisOverview }) {
  const notify = useNotification()

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <Badge variant="info">{overview.fileType}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-panel2/25 p-4">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">
                Risk Score
              </div>
              <div className="mt-3 flex items-center justify-center">
                <RiskGauge value={overview.riskScore} size={170} stroke={12} label="0–100" />
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-border/60 bg-panel2/25 p-4">
              <div>
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">
                  Malware Family
                </div>
                <div className="mt-2">
                  <Badge variant={overview.riskScore >= 75 ? 'critical' : 'info'}>
                    {overview.malwareFamily}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="font-bold tracking-[0.2em] uppercase">Confidence</span>
                  <span>{overview.confidence}%</span>
                </div>
                <div className="mt-2 h-3 w-full rounded-full border border-border/60 bg-panel2/60 p-0.5">
                  <div
                    className="h-full rounded-full bg-cyan"
                    style={{
                      width: `${overview.confidence}%`,
                      boxShadow: '0 0 16px rgba(0,188,212,0.25)',
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
                    Size
                  </div>
                  <div className="mt-1 font-semibold text-text">
                    {formatBytes(overview.fileSizeBytes)}
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
                    Uploaded
                  </div>
                  <div className="mt-1 font-semibold text-text">
                    {formatDateTime(overview.uploadTime)}
                  </div>
                </div>
              </div>
              {overview.reason ? (
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3 text-sm text-muted">
                  <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
                    Analysis
                  </div>
                  <p className="mt-1 text-text">{overview.reason}</p>
                </div>
              ) : null}
              {overview.entropy !== undefined ? (
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3 text-sm">
                  <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
                    Entropy
                  </div>
                  <div className="mt-1 font-semibold text-text">{overview.entropy.toFixed(2)}</div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <HashRow label="MD5" value={overview.md5} />
            <HashRow label="SHA1" value={overview.sha1} />
            <HashRow label="SHA256" value={overview.sha256} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="tt-noise">
          <CardHeader>
            <CardTitle>File Details</CardTitle>
            <div className="text-xs text-muted">Immutable metadata</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
                Filename
              </div>
              <div className="mt-1 font-heading text-sm text-text">
                {overview.fileName}
              </div>
            </div>
            <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
                Analysis ID
              </div>
              <div className="mt-1 font-heading text-sm text-text">{overview.id}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="tt-noise">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <div className="text-xs text-muted">Exports & sharing (stub)</div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2">
            <Button
              variant="secondary"
              onClick={() => notify.info('Export stub', 'Export PDF integrates later.')}
            >
              <FileDigit className="h-4 w-4" aria-hidden="true" />
              Export PDF
            </Button>
            <Button
              variant="secondary"
              onClick={() => notify.info('Export stub', 'Export JSON integrates later.')}
            >
              <FileDigit className="h-4 w-4" aria-hidden="true" />
              Export JSON
            </Button>
            <Button
              variant="ghost"
              onClick={() => notify.info('Share stub', 'Share links integrate later.')}
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

