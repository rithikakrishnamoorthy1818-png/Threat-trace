import { useParams } from 'react-router-dom'
import { AppShell } from '../components/common/AppShell'
import { ThreatGraphComponent } from '../components/analysis/ThreatGraphComponent'
import { getFileAnalysis } from '../services/fileAnalysis'
import { generateThreatGraph } from '../services/threatGraphService'

export default function ThreatGraphPage() {
  const { scanId = '' } = useParams()
  const detail = getFileAnalysis(scanId)

  return (
    <AppShell title="Threat Graph" subtitle="Relationship map for scan artifacts.">
      {detail ? (
        <ThreatGraphComponent scanId={scanId} {...generateThreatGraph(detail)} />
      ) : (
        <div className="rounded-2xl border border-border/60 bg-panel/60 p-5 text-sm text-muted">
          No graph data found for this scan id.
        </div>
      )}
    </AppShell>
  )
}
