import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge, classificationBadgeVariant } from '../common/Badge'
import { Button } from '../common/Button'
import { RiskGauge } from '../dashboard/RiskGauge'
import { useFetch } from '../../hooks/useFetch'
import { urlScannerService } from '../../services/urlScannerService'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { formatDateTime } from '../../utils/formatters'
import { cn } from '../../utils/cn'
import { explainUrl } from '../../services/explainabilityService'
import { predictUrlRisk } from '../../services/riskPredictionService'
import { ExplainabilityPanel } from '../analysis/ExplainabilityPanel'
import { RiskPredictionPanel } from '../analysis/RiskPredictionPanel'
import { useNotification } from '../../hooks/useNotification'

type TabId = 'overview' | 'reputation' | 'content' | 'ssl' | 'network'

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'reputation', label: 'Reputation' },
  { id: 'content', label: 'Content' },
  { id: 'ssl', label: 'SSL/TLS' },
  { id: 'network', label: 'Network' },
]

function BoolMark({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-success" aria-label="Yes" />
  ) : (
    <X className="h-4 w-4 text-primary" aria-label="No" />
  )
}

export function URLScanResults({ scanId, url }: { scanId: string; url: string }) {
  const [tab, setTab] = useState<TabId>('overview')
  const notify = useNotification()
  const [nowMs] = useState<number>(() => Date.now())
  const { data, loading } = useFetch(
    () => urlScannerService.getURLResults(scanId),
    [scanId],
  )

  const result = data ?? null

  const content = useMemo(() => {
    if (!result) return null
    switch (tab) {
      case 'reputation':
        return (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="tt-noise">
              <CardHeader>
                <CardTitle>VirusTotal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  Detections:{' '}
                  <span className="font-semibold text-text">
                    {result.virustotal?.detections ?? 0}/{result.virustotal?.vendors ?? 72}{' '}
                    engines
                  </span>
                </div>
                <div className="text-muted">
                  Threat type: {result.virustotal?.threatType ?? 'unknown'}
                </div>
                {result.virustotal?.lastAnalysis ? (
                  <div className="text-muted">
                    Last analysis: {formatDateTime(result.virustotal.lastAnalysis)}
                  </div>
                ) : null}
              </CardContent>
            </Card>
            <Card className="tt-noise">
              <CardHeader>
                <CardTitle>URLhaus</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted">
                Status:{' '}
                <span className="font-semibold text-text">
                  {result.urlhaus?.status ?? 'unknown'}
                </span>
              </CardContent>
            </Card>
          </div>
        )
      case 'content':
        return (
          <Card className="tt-noise">
            <CardHeader>
              <CardTitle>Content Analysis</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                <span className="text-sm text-muted">Has forms</span>
                <BoolMark value={result.content?.hasForms ?? false} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                <span className="text-sm text-muted">Has scripts</span>
                <BoolMark value={result.content?.hasScripts ?? false} />
              </div>
              <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2 sm:col-span-2">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">
                  Embedded URLs
                </div>
                <div className="mt-1 text-sm font-semibold text-text">
                  {result.content?.embeddedUrlsCount ?? 0}
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">
                  Detected technologies
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(result.content?.detectedTechnologies ?? []).map((t) => (
                    <Badge key={t} variant="info">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 'ssl': {
        const expiry = result.ssl?.expiryDate
          ? new Date(result.ssl.expiryDate)
          : null
        const daysLeft = expiry
          ? Math.ceil((expiry.getTime() - nowMs) / 86400000)
          : null
        return (
          <Card className="tt-noise">
            <CardHeader>
              <CardTitle>SSL/TLS</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                <span className="text-sm text-muted">Certificate valid</span>
                <BoolMark value={result.ssl?.isValid ?? false} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                <span className="text-sm text-muted">Self-signed</span>
                <BoolMark value={result.ssl?.selfSigned ?? false} />
              </div>
              <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                <div className="text-xs text-muted">Issuer</div>
                <div className="mt-1 text-sm font-semibold text-text">
                  {result.ssl?.issuer ?? '—'}
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                <div className="text-xs text-muted">Protocol</div>
                <div className="mt-1 text-sm font-semibold text-text">
                  {result.ssl?.protocol ?? '—'}
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2 sm:col-span-2">
                <div className="text-xs text-muted">Expiry</div>
                <div className="mt-1 text-sm font-semibold text-text">
                  {expiry ? formatDateTime(expiry.toISOString()) : '—'}
                  {daysLeft !== null && daysLeft < 30 ? (
                    <span className="ml-2 text-warning">({daysLeft} days left)</span>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }
      case 'network':
        return (
          <Card className="tt-noise">
            <CardHeader>
              <CardTitle>Network</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                <div>
                  <div className="text-xs text-muted">IP address</div>
                  <div className="font-heading text-sm text-text">
                    {result.network?.ipAddress ?? '—'}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Copy IP"
                  onClick={async () => {
                    if (result.network?.ipAddress) {
                      await navigator.clipboard.writeText(result.network.ipAddress)
                      notify.success('Copied', 'IP address copied.')
                    }
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs text-muted">Country / City</div>
                  <div className="mt-1 font-semibold text-text">
                    {result.network?.country ?? '—'}, {result.network?.city ?? '—'}
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs text-muted">ASN</div>
                  <div className="mt-1 font-semibold text-text">
                    {result.network?.asn ?? '—'}
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3 sm:col-span-2">
                  <div className="text-xs text-muted">Organization</div>
                  <div className="mt-1 font-semibold text-text">
                    {result.network?.organization ?? '—'}
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs text-muted">Domain registered</div>
                  <div className="mt-1 text-text">{result.network?.domainRegistered ?? '—'}</div>
                </div>
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs text-muted">Days until expiry</div>
                  <div className="mt-1 text-text">
                    {result.network?.daysUntilExpiry ?? '—'}
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3 sm:col-span-2">
                  <div className="text-xs text-muted">WHOIS registrar</div>
                  <div className="mt-1 text-text">{result.network?.registrar ?? '—'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="tt-noise">
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <Badge variant={classificationBadgeVariant(result.classification)}>
                  {result.classification}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-around">
                  <RiskGauge value={result.riskScore} size={160} stroke={12} />
                  <div className="space-y-2 text-sm w-full max-w-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Confidence</span>
                      <span className="font-semibold text-text">{result.confidence}%</span>
                    </div>
                    <div className="h-2 rounded-full border border-border/60 bg-panel2/60 p-0.5">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          result.isWhitelisted ? 'bg-success' : 'bg-primary',
                        )}
                        style={{
                          width: `${result.confidence}%`,
                          boxShadow: result.isWhitelisted
                            ? '0 0 14px rgba(0,255,65,0.25)'
                            : '0 0 14px rgba(255,23,68,0.25)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="tt-noise">
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs text-muted">Domain age</div>
                  <div className="mt-1 font-semibold text-text">
                    {result.domainAgeDays ?? '—'} days
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs text-muted">SSL valid</div>
                  <div className="mt-1">
                    <BoolMark value={result.sslValid} />
                  </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs text-muted">Phishing score</div>
                  <div className="mt-1 font-semibold text-text">{result.phishingScore}</div>
                </div>
                <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs text-muted">Malware score</div>
                  <div className="mt-1 font-semibold text-text">{result.malwareScore}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }, [tab, result, notify, nowMs])

  if (loading) {
    return (
      <div className="tt-scanline rounded-2xl border border-border bg-panel/60 px-6 py-6">
        <LoadingSpinner label="Loading URL scan results…" />
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2 text-sm text-muted">
        Scanned: <span className="text-text break-all">{url}</span>
      </div>

      {result.phishingIndicators?.includes('blocked_domain') ? (
        <div
          className="rounded-xl border border-primary/60 bg-primary/10 px-4 py-3 font-heading text-sm font-bold tracking-wide text-primary shadow-[var(--tt-shadow-red)]"
          role="alert"
        >
          ⛔ Blocked Domain (test / example / reserved — not legitimate)
        </div>
      ) : null}

      {result.isWhitelisted ? (
        <div
          className="rounded-xl border border-success/60 bg-success/10 px-4 py-3 font-heading text-sm font-bold tracking-wide text-success shadow-[0_0_22px_rgba(0,255,65,0.18)]"
          role="status"
        >
          ✓ Known Legitimate Domain (Whitelisted)
        </div>
      ) : null}

      {result.reason ? (
        <div className="rounded-xl border border-border/50 bg-panel2/25 px-4 py-3 text-sm text-muted">
          <span className="font-bold tracking-[0.12em] uppercase text-text/80">Analysis: </span>
          {result.reason}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-panel/45 p-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70',
              tab === t.id
                ? 'border border-cyan/40 bg-ink/35 text-text shadow-[0_0_22px_rgba(0,188,212,0.14)]'
                : 'border border-transparent text-muted hover:bg-panel2/40 hover:text-text',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        {content}
      </motion.div>

      <ExplainabilityPanel
        type="url"
        explanation={explainUrl(result)}
        riskScore={result.riskScore}
        classification={result.classification}
      />
      <RiskPredictionPanel prediction={predictUrlRisk(result)} scanKind="url" />
    </div>
  )
}



