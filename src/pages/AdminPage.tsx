import { useState } from 'react'
import { Shield, Users, Settings, Activity } from 'lucide-react'
import { AppShell } from '../components/common/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { useAuth } from '../hooks/useAuth'
import { useNotification } from '../hooks/useNotification'

const OPERATORS = [
  { name: 'ThreatTrace Analyst', email: 'analyst@threattrace.local', role: 'analyst', status: 'active' },
  { name: 'SOC Lead', email: 'lead@threattrace.local', role: 'admin', status: 'active' },
  { name: 'Guest Reviewer', email: 'guest@threattrace.local', role: 'analyst', status: 'invited' },
]

export default function AdminPage() {
  const { user } = useAuth()
  const notify = useNotification()
  const [sandbox, setSandbox] = useState(true)
  const [retention, setRetention] = useState('90')

  return (
    <AppShell
      title="Admin"
      subtitle="Operator management, platform settings, and system health."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="tt-noise lg:col-span-1">
          <CardHeader>
            <CardTitle>Session</CardTitle>
            <Shield className="h-4 w-4 text-cyan" />
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted">Signed in as </span>
              <span className="font-semibold text-text">{user?.name ?? 'Unknown'}</span>
            </div>
            <div className="text-muted">{user?.email}</div>
            <Badge variant={user?.role === 'admin' ? 'info' : 'safe'}>{user?.role ?? 'analyst'}</Badge>
          </CardContent>
        </Card>

        <Card className="tt-noise lg:col-span-2">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
            {[
              ['API', 'Operational'],
              ['Sandbox', 'Online'],
              ['VT Enrichment', 'Stub'],
              ['Queue', 'Idle'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border/50 bg-panel2/30 p-3">
                <div className="text-xs text-muted">{k}</div>
                <div className="mt-1 font-semibold text-success">{v}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="tt-noise">
          <CardHeader>
            <CardTitle>Operators</CardTitle>
            <Users className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {OPERATORS.map((op) => (
                <li
                  key={op.email}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-panel2/30 px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-semibold text-text">{op.name}</div>
                    <div className="text-xs text-muted">{op.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={op.role === 'admin' ? 'info' : 'safe'}>{op.role}</Badge>
                    <Badge variant={op.status === 'active' ? 'safe' : 'pending'}>{op.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              className="mt-3 w-full"
              variant="secondary"
              onClick={() => notify.info('Invite stub', 'User invites connect to API later.')}
            >
              Invite operator
            </Button>
          </CardContent>
        </Card>

        <Card className="tt-noise">
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <Settings className="h-4 w-4 text-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted">Enable sandbox detonation</span>
              <input
                type="checkbox"
                checked={sandbox}
                onChange={(e) => setSandbox(e.target.checked)}
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Report retention (days)</span>
              <select
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className="mt-1 w-full rounded-xl border-border/60 bg-panel2/70 px-3 py-2 text-text"
              >
                <option value="30">30</option>
                <option value="90">90</option>
                <option value="180">180</option>
                <option value="365">365</option>
              </select>
            </label>
            <Button
              className="w-full"
              onClick={() => notify.success('Settings saved', 'Configuration stored locally (stub).')}
            >
              Save settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
