import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Download, ExternalLink, Search } from 'lucide-react'
import { analysisService } from '../../services/analysisService'
import { useFetch } from '../../hooks/useFetch'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'
import { RiskGauge } from '../dashboard/RiskGauge'
import { formatBytes, formatDateTime } from '../../utils/formatters'
import { cn } from '../../utils/cn'
import { useNotification } from '../../hooks/useNotification'
import { explainPdf } from '../../services/explainabilityService'
import { ExplainabilityPanel } from './ExplainabilityPanel'
import { Link } from 'react-router-dom'

type PdfTabId = 'overview' | 'content' | 'metadata' | 'security' | 'threats' | 'fulltext'

const pdfTabs: { id: PdfTabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'content', label: 'Content' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'security', label: 'Security' },
  { id: 'threats', label: 'Threats' },
  { id: 'fulltext', label: 'Full Text' },
]

export function PDFAnalysisTab({ scanId }: { scanId: string }) {
  const notify = useNotification()
  const [tab, setTab] = useState<PdfTabId>('overview')
  const [textModal, setTextModal] = useState(false)
  const [search, setSearch] = useState('')
  const { data, loading } = useFetch(() => analysisService.getPDFAnalysis(scanId), [scanId])

  const fullText = useFetch(() => analysisService.extractPDFText(scanId), [scanId])

  const filteredText = useMemo(() => {
    const t = fullText.data ?? data?.content.extractedText ?? ''
    if (!search.trim()) return t
    const q = search.toLowerCase()
    return t
      .split('\n')
      .filter((line) => line.toLowerCase().includes(q))
      .join('\n')
  }, [fullText.data, data, search])

  const panel = useMemo(() => {
    if (!data) return null
    switch (tab) {
      case 'content':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                <div className="text-xs text-muted">Pages</div>
                <div className="mt-1 font-semibold text-text">{data.basicInfo.pages}</div>
              </div>
              <div className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                <div className="text-xs text-muted">Images</div>
                <div className="mt-1 font-semibold text-text">{data.content.imagesCount}</div>
              </div>
            </div>
            <Card className="tt-noise">
              <CardHeader>
                <CardTitle>Text preview</CardTitle>
                <Button variant="secondary" size="sm" onClick={() => setTextModal(true)}>
                  View full text
                </Button>
              </CardHeader>
              <CardContent>
                <div className="tt-terminal max-h-32 overflow-auto text-sm text-text">
                  {data.content.extractedText.slice(0, 200)}
                  {data.content.extractedText.length > 200 ? '…' : ''}
                </div>
              </CardContent>
            </Card>
            {data.content.embeddedFiles.length > 0 ? (
              <Card className="tt-noise">
                <CardHeader>
                  <CardTitle>Embedded files</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {data.content.embeddedFiles.map((f) => (
                      <li key={f} className="rounded-lg border border-border/50 bg-panel2/30 px-3 py-2 text-text">
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )
      case 'metadata':
        return (
          <Card className="tt-noise">
            <CardContent className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
              {[
                ['Title', data.metadata.title],
                ['Subject', data.metadata.subject],
                ['Keywords', data.metadata.keywords?.join(', ')],
                ['Producer', data.metadata.producer],
                ['Created', formatDateTime(data.basicInfo.createdDate)],
                ['Modified', formatDateTime(data.basicInfo.modifiedDate)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">{k}</div>
                  <div className="mt-1 text-sm text-text">{v ?? '—'}</div>
                </div>
              ))}
              {data.metadata.anomalies.length > 0 ? (
                <div className="sm:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted">
                    Metadata anomalies
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-warning">
                    {data.metadata.anomalies.map((a) => (
                      <li key={a}>• {a}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )
      case 'security':
        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                ['JavaScript', data.security.hasJavaScript],
                ['Embedded executables', data.security.hasEmbeddedExecutables],
                ['Suspicious links', data.security.hasSuspiciousLinks],
                ['Forms', data.security.hasForms],
              ] as [string, boolean][]
            ).map(([label, val]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-panel2/30 px-3 py-2"
              >
                <span className="text-sm text-muted">{label}</span>
                <Badge variant={val ? 'warning' : 'safe'}>{val ? 'Yes' : 'No'}</Badge>
              </div>
            ))}
            {data.security.encryptionType ? (
              <div className="rounded-xl border border-border/50 bg-panel2/30 p-3 sm:col-span-2">
                <div className="text-xs text-muted">Encryption</div>
                <div className="mt-1 text-sm text-text">{data.security.encryptionType}</div>
              </div>
            ) : null}
            <div className="rounded-xl border border-border/50 bg-panel2/30 p-3 sm:col-span-2">
              <div className="text-xs text-muted">Suspicious link count</div>
              <div className="mt-1 font-semibold text-text">
                {data.security.suspiciousLinkCount}
              </div>
            </div>
          </div>
        )
      case 'threats':
        return (
          <div className="space-y-4">
            <Card className="tt-noise">
              <CardHeader>
                <CardTitle>Malicious URLs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.threats.maliciousLinks.map((link) => (
                  <div
                    key={link}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/50 bg-panel2/30 px-3 py-2"
                  >
                    <span className="break-all text-sm text-text">{link}</span>
                    <div className="flex gap-1">
                      <Link to={`/scan-url`}>
                        <Button variant="secondary" size="sm">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Scan
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Copy link"
                        onClick={async () => {
                          await navigator.clipboard.writeText(link)
                          notify.success('Copied', 'Link copied.')
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="tt-noise">
              <CardHeader>
                <CardTitle>Suspicious patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted">
                  {data.threats.suspiciousPatterns.map((p) => (
                    <li key={p} className="rounded-lg bg-panel2/30 px-2 py-1 text-text">
                      "{p}"
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {data.threats.embeddedFilesRisk.length > 0 ? (
              <Card className="tt-noise">
                <CardHeader>
                  <CardTitle>Embedded file risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.threats.embeddedFilesRisk.map((f) => (
                      <li
                        key={f.name}
                        className="flex items-center justify-between rounded-xl border border-border/50 bg-panel2/30 px-3 py-2"
                      >
                        <span className="text-sm text-text">{f.name}</span>
                        <Badge variant={f.risk === 'HIGH' ? 'critical' : 'warning'}>
                          {f.risk}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )
      case 'fulltext':
        return (
          <Card className="tt-noise">
            <CardHeader>
              <CardTitle>Full extracted text</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    const t = fullText.data ?? data.content.extractedText
                    await navigator.clipboard.writeText(t)
                    notify.success('Copied', 'Full text copied.')
                  }}
                >
                  <Copy className="h-4 w-4" /> Copy all
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const t = fullText.data ?? data.content.extractedText
                    const blob = new Blob([t], { type: 'text/plain' })
                    const a = document.createElement('a')
                    a.href = URL.createObjectURL(blob)
                    a.download = `pdf-text-${scanId}.txt`
                    a.click()
                    URL.revokeObjectURL(a.href)
                  }}
                >
                  <Download className="h-4 w-4" /> Download .txt
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-2 rounded-xl border border-border/60 bg-panel2/60 px-3 py-2">
                <Search className="h-4 w-4 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search in text…"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </label>
              <textarea
                readOnly
                value={filteredText}
                className="tt-terminal h-64 w-full resize-y rounded-xl border border-border/50 bg-ink/30 p-3 text-sm text-text"
              />
            </CardContent>
          </Card>
        )
      default:
        return (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr]">
            <Card className="tt-noise">
              <CardHeader>
                <CardTitle>Risk</CardTitle>
                <Badge variant={data.basicInfo.isSuspicious ? 'warning' : 'safe'}>
                  {data.basicInfo.isSuspicious ? 'Suspicious' : 'Clean'}
                </Badge>
              </CardHeader>
              <CardContent className="flex justify-center">
                <RiskGauge value={data.basicInfo.riskScore} size={150} stroke={11} />
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Pages', String(data.basicInfo.pages)],
                ['Author', data.basicInfo.author ?? 'Unknown'],
                ['Created', formatDateTime(data.basicInfo.createdDate)],
                ['Encrypted', data.basicInfo.encrypted ? 'Yes' : 'No'],
                ['File size', formatBytes(data.basicInfo.fileSize)],
                ['Creator', data.basicInfo.creator ?? 'Unknown'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                  <div className="text-xs text-muted">{k}</div>
                  <div className="mt-1 text-sm font-semibold text-text">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }, [tab, data, fullText.data, scanId, search, filteredText, notify])

  if (loading) {
    return (
      <div className="tt-scanline rounded-2xl border border-border bg-panel/60 px-6 py-6">
        <LoadingSpinner label="Analyzing PDF…" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-panel/45 p-2">
        {pdfTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300',
              tab === t.id
                ? 'border border-cyan/40 bg-ink/35 text-text'
                : 'text-muted hover:text-text hover:bg-panel2/40 border border-transparent',
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
        {panel}
      </motion.div>

      <ExplainabilityPanel
        type="pdf"
        explanation={explainPdf(
          fullText.data ?? data.content.extractedText,
          data.basicInfo.riskScore,
        )}
        riskScore={data.basicInfo.riskScore}
        classification={data.basicInfo.isSuspicious ? 'suspicious' : 'safe'}
      />

      <Modal open={textModal} title="Full extracted text" onClose={() => setTextModal(false)}>
        <textarea
          readOnly
          className="tt-terminal h-72 w-full rounded-xl border border-border/50 bg-ink/30 p-3 text-sm"
          value={fullText.data ?? data.content.extractedText}
        />
      </Modal>
    </div>
  )
}
