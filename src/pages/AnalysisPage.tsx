import { useParams } from 'react-router-dom'
import { AppShell } from '../components/common/AppShell'
import { AnalysisResults } from '../components/analysis/AnalysisResults'

export default function AnalysisPage() {
  const { scanId } = useParams()
  const id = scanId ?? 'scan_unknown'
  return (
    <AppShell
      title="Analysis"
      subtitle="Static + dynamic telemetry with intelligence enrichment."
    >
      <AnalysisResults scanId={id} />
    </AppShell>
  )
}

