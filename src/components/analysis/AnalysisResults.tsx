import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { analysisService } from '../../services/analysisService'
import { getFileAnalysis } from '../../services/fileAnalysis'
import { explainFile } from '../../services/explainabilityService'
import { predictFileRisk } from '../../services/riskPredictionService'
import { generateThreatGraph } from '../../services/threatGraphService'
import { useFetch } from '../../hooks/useFetch'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { cn } from '../../utils/cn'
import { OverviewTab } from './OverviewTab'
import { StaticAnalysisTab } from './StaticAnalysisTab'
import { DynamicAnalysisTab } from './DynamicAnalysisTab'
import { ThreatIntelTab } from './ThreatIntelTab'
import { AttributionTab } from './AttributionTab'
import { PDFAnalysisTab } from './PDFAnalysisTab'
import { ExplainabilityPanel } from './ExplainabilityPanel'
import { BehaviorAnalysisTab } from './BehaviorAnalysisTab'
import { RiskPredictionPanel } from './RiskPredictionPanel'
import { ThreatGraphComponent } from './ThreatGraphComponent'

type TabId =
  | 'overview'
  | 'static'
  | 'dynamic'
  | 'intel'
  | 'attribution'
  | 'explainability'
  | 'behavior'
  | 'risk'
  | 'graph'
  | 'pdf-analysis'

type TabDef = { id: TabId; label: string }

export function AnalysisResults({ scanId }: { scanId: string }) {
  const [tab, setTab] = useState<TabId>('overview')
  const overview = useFetch(() => analysisService.getAnalysisOverview(scanId), [scanId])
  const fileDetail = useMemo(() => getFileAnalysis(scanId), [scanId])

  const isPdf =
    overview.data?.mediaKind === 'pdf' ||
    overview.data?.fileName.toLowerCase().endsWith('.pdf') ||
    overview.data?.fileType.toLowerCase().includes('pdf')

  const tabs = useMemo<TabDef[]>(() => {
    const base: TabDef[] = [
      { id: 'overview', label: 'Overview' },
      { id: 'static', label: 'Static Analysis' },
      { id: 'dynamic', label: 'Dynamic Analysis' },
      { id: 'explainability', label: 'AI Insight' },
      { id: 'behavior', label: 'Behavior' },
      { id: 'risk', label: 'ML Risk' },
      { id: 'graph', label: 'Threat Graph' },
      { id: 'intel', label: 'Threat Intelligence' },
      { id: 'attribution', label: 'Attribution' },
    ]
    if (isPdf) {
      base.push({ id: 'pdf-analysis', label: 'PDF Analysis' })
    }
    return base
  }, [isPdf])

  const content = useMemo(() => {
    if (!overview.data) return null
    const o = overview.data

    switch (tab) {
      case 'static':
        return <StaticAnalysisTab />
      case 'dynamic':
        return <DynamicAnalysisTab />
      case 'intel':
        return <ThreatIntelTab />
      case 'attribution':
        return <AttributionTab />
      case 'pdf-analysis':
        return <PDFAnalysisTab scanId={scanId} />
      case 'explainability':
        return fileDetail ? (
          <ExplainabilityPanel
            type="file"
            explanation={explainFile(fileDetail)}
            riskScore={fileDetail.riskScore}
            classification={fileDetail.classification}
          />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-panel/60 p-5 text-sm text-muted">
            No detailed analysis available. Re-upload the file to generate insights.
          </div>
        )
      case 'behavior':
        return fileDetail ? (
          <BehaviorAnalysisTab detail={fileDetail} />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-panel/60 p-5 text-sm text-muted">
            Behavior analysis requires a scanned file with stored results.
          </div>
        )
      case 'risk':
        return fileDetail ? (
          <RiskPredictionPanel prediction={predictFileRisk(fileDetail)} scanKind="file" />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-panel/60 p-5 text-sm text-muted">
            ML risk prediction unavailable for this scan.
          </div>
        )
      case 'graph':
        return fileDetail ? (
          <ThreatGraphComponent
            scanId={scanId}
            {...generateThreatGraph(fileDetail)}
          />
        ) : (
          <div className="rounded-2xl border border-border/60 bg-panel/60 p-5 text-sm text-muted">
            Threat graph requires analysis data from a file upload.
          </div>
        )
      default:
        return <OverviewTab overview={o} />
    }
  }, [tab, overview.data, scanId, fileDetail])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-panel/45 p-2 backdrop-blur">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70',
              tab === t.id
                ? 'bg-ink/35 text-text border border-cyan/40 shadow-[0_0_22px_rgba(0,188,212,0.14)]'
                : 'text-muted hover:text-text hover:bg-panel2/40 border border-transparent',
            )}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {overview.loading ? (
        <div className="tt-scanline rounded-2xl border border-border bg-panel/60 px-6 py-6 shadow-[var(--tt-shadow-cyan)]">
          <LoadingSpinner label="Rendering analysis…" />
        </div>
      ) : overview.error ? (
        <div className="rounded-2xl border border-primary/50 bg-panel/60 p-5 text-sm text-muted shadow-[var(--tt-shadow-red)]">
          Failed to load analysis.
        </div>
      ) : (
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {content}
        </motion.div>
      )}
    </div>
  )
}

