import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileText, Link2 } from 'lucide-react'
import { AppShell } from '../components/common/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge, classificationBadgeVariant } from '../components/common/Badge'
import { urlScannerService } from '../services/urlScannerService'
import { analysisService } from '../services/analysisService'
import { useFetch } from '../hooks/useFetch'
import { formatDateTime, formatTimeAgo, truncateMiddle } from '../utils/formatters'
import { useNotification } from '../hooks/useNotification'

type ReportFilter = 'all' | 'file' | 'url'

export default function ReportsPage() {
  const notify = useNotification()
  const [filter, setFilter] = useState<ReportFilter>('all')
  const fileScans = useFetch(() => analysisService.getRecentScans(), [])
  const urlScans = useMemo(() => urlScannerService.getLocalHistory(), [])

  const rows = useMemo(() => {
    const files = (fileScans.data ?? []).map((s) => ({
      id: s.id,
      type: 'file' as const,
      label: s.fileName,
      date: s.scanDate,
      risk: s.riskScore,
      meta: s.malwareFamily,
    }))
    const urls = urlScans.map((s) => ({
      id: s.id,
      type: 'url' as const,
      label: s.url,
      date: s.scannedAt,
      risk: s.riskScore,
      meta: s.classification,
    }))
    const merged = [...files, ...urls].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    if (filter === 'file') return merged.filter((r) => r.type === 'file')
    if (filter === 'url') return merged.filter((r) => r.type === 'url')
    return merged
  }, [fileScans.data, urlScans, filter])

  return (
    <AppShell
      title="Reports"
      subtitle="Unified export hub for file and URL analysis reports."
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'file', 'url'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'file' ? 'File scans' : 'URL scans'}
          </Button>
        ))}
      </div>

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Analysis Reports</CardTitle>
          <div className="text-xs text-muted">{rows.length} report(s)</div>
        </CardHeader>
        <CardContent>
          {fileScans.loading ? (
            <div className="text-sm text-muted">Loading reports…</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-muted">No reports yet. Run a file or URL scan first.</div>
          ) : (
            <ul className="space-y-2">
              {rows.map((r) => (
                <li
                  key={`${r.type}-${r.id}`}
                  className="flex flex-col gap-3 rounded-xl border border-border/50 bg-panel2/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between hover:border-cyan/35 transition-colors"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {r.type === 'file' ? (
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                    ) : (
                      <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-text" title={r.label}>
                        {truncateMiddle(r.label, 52)}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <span>{formatTimeAgo(r.date)}</span>
                        <span>·</span>
                        <span>{formatDateTime(r.date)}</span>
                        <Badge
                          variant={
                            r.type === 'url'
                              ? classificationBadgeVariant(
                                  r.meta as 'safe' | 'suspicious' | 'malicious' | 'phishing',
                                )
                              : 'info'
                          }
                        >
                          {r.meta}
                        </Badge>
                        <span className="text-warning">Risk {r.risk}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      to={r.type === 'file' ? `/analysis/${r.id}` : '/scan-url'}
                    >
                      <Button variant="secondary" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        notify.info('Export stub', 'PDF/JSON export integrates with API later.')
                      }
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  )
}
