import { AlertOctagon, Bug, FileSearch } from 'lucide-react'
import { motion } from 'framer-motion'
import { useFetch } from '../../hooks/useFetch'
import { analysisService } from '../../services/analysisService'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { StatCard } from './StatCard'
import { ThreatChart } from './ThreatChart'
import { TopFamiliesChart } from './TopFamiliesChart'
import { RecentScansTable } from './RecentScansTable'
import { URLDashboardWidgets } from './URLDashboardWidgets'

export function Dashboard() {
  const stats = useFetch(() => analysisService.getDashboardStats(), [])
  const timeline = useFetch(() => analysisService.getThreatTimeline(), [])
  const families = useFetch(() => analysisService.getTopFamilies(), [])
  const scans = useFetch(() => analysisService.getRecentScans(), [])
  const urlRecent = useFetch(() => analysisService.getRecentURLScans(3), [])
  const urlDist = useFetch(() => analysisService.getURLRiskDistribution(), [])

  const loading =
    stats.loading ||
    timeline.loading ||
    families.loading ||
    scans.loading ||
    urlRecent.loading ||
    urlDist.loading

  if (loading) {
    return (
      <div className="tt-scanline rounded-2xl border border-border bg-panel/60 px-6 py-6 shadow-[var(--tt-shadow-cyan)]">
        <LoadingSpinner label="Synchronizing telemetry…" />
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.06, delayChildren: 0.04 },
        },
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          title="Files Scanned"
          value={stats.data?.filesScanned ?? 0}
          tone="cyan"
          icon={<FileSearch className="h-4 w-4" />}
          hint="30d total"
        />
        <StatCard
          title="Threats Detected"
          value={stats.data?.threatsDetected ?? 0}
          tone="warning"
          icon={<Bug className="h-4 w-4" />}
          hint="flagged"
        />
        <StatCard
          title="Critical Alerts"
          value={stats.data?.criticalAlerts ?? 0}
          tone="primary"
          icon={<AlertOctagon className="h-4 w-4" />}
          hint="requires triage"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ThreatChart data={timeline.data ?? []} />
        <TopFamiliesChart data={families.data ?? []} />
      </div>

      <URLDashboardWidgets
        recentScans={urlRecent.data ?? []}
        riskDistribution={urlDist.data ?? []}
        suspiciousCount={stats.data?.suspiciousUrlsThisWeek ?? 0}
      />

      <RecentScansTable data={scans.data ?? []} />
    </motion.div>
  )
}

