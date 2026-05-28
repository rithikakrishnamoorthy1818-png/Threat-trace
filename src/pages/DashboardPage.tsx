import { AppShell } from '../components/common/AppShell'
import { Dashboard } from '../components/dashboard/Dashboard'
import { Button } from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'
import { LogOut } from 'lucide-react'

export default function DashboardPage() {
  const { logout } = useAuth()
  return (
    <AppShell
      title="Dashboard"
      subtitle="Operational overview of scans, detections, and alerts."
      actions={
        <Button variant="ghost" onClick={logout} aria-label="Logout">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </Button>
      }
    >
      <Dashboard />
    </AppShell>
  )
}

