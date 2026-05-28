import { AppShell } from '../components/common/AppShell'
import { ThreatIntelligence } from '../components/threat-intel/ThreatIntelligence'

export default function ThreatIntelPage() {
  return (
    <AppShell
      title="Threat Intelligence"
      subtitle="Search and correlate families, groups, and recent activity."
    >
      <ThreatIntelligence />
    </AppShell>
  )
}

