import { useState } from 'react'
import { AppShell } from '../components/common/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { useAuthContext } from '../context/AuthContext'
import { useNotification } from '../hooks/useNotification'
import { cn } from '../utils/cn'

type Section = 'account' | 'notifications' | 'api' | 'scan' | 'appearance'

const sections: { id: Section; label: string }[] = [
  { id: 'account', label: 'Account' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'api', label: 'API' },
  { id: 'scan', label: 'Scan Preferences' },
  { id: 'appearance', label: 'Appearance' },
]

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
      <span className="text-sm text-text">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-cyan/70' : 'bg-panel2',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  )
}

export default function SettingsPage() {
  const { user, logout } = useAuthContext()
  const notify = useNotification()
  const [section, setSection] = useState<Section>('account')

  const [emailNotif, setEmailNotif] = useState(true)
  const [desktopNotif, setDesktopNotif] = useState(false)
  const [scanComplete, setScanComplete] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(false)
  const [notifFreq, setNotifFreq] = useState('instant')
  const [twoFa, setTwoFa] = useState(false)
  const [scanTimeout, setScanTimeout] = useState('60')
  const [autoDelete, setAutoDelete] = useState('90')
  const [maxFileSize, setMaxFileSize] = useState('100')
  const [fontSize, setFontSize] = useState('medium')
  const [apiKey] = useState('tt_live_••••••••••••••••3f9a')

  const panel = (() => {
    switch (section) {
      case 'account':
        return (
          <div className="space-y-4">
            <Card className="tt-noise">
              <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                  <div className="text-xs text-muted">Username</div>
                  <div className="font-semibold text-text">{user?.name ?? 'Analyst'}</div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                  <div>
                    <div className="text-xs text-muted">Email</div>
                    <div className="font-semibold text-text">{user?.email ?? 'analyst@threattrace.local'}</div>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => notify.info('Email', 'Change email flow (stub).')}>
                    Change
                  </Button>
                </div>
                <Button variant="secondary" onClick={() => notify.info('Password', 'Change password flow (stub).')}>
                  Change password
                </Button>
                <Toggle checked={twoFa} onChange={setTwoFa} label="Two-factor authentication" />
                <Button variant="ghost" onClick={() => { logout(); notify.warning('Sessions', 'Logged out all devices (local).') }}>
                  Logout all devices
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case 'notifications':
        return (
          <Card className="tt-noise">
            <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Toggle checked={emailNotif} onChange={setEmailNotif} label="Email notifications" />
              <Toggle checked={desktopNotif} onChange={setDesktopNotif} label="Desktop notifications" />
              <Toggle checked={scanComplete} onChange={setScanComplete} label="Scan complete notifications" />
              <Toggle checked={criticalAlerts} onChange={setCriticalAlerts} label="Critical threat alerts" />
              <Toggle checked={dailyDigest} onChange={setDailyDigest} label="Daily digest" />
              <label className="block text-sm">
                <span className="text-muted">Frequency</span>
                <select
                  value={notifFreq}
                  onChange={(e) => setNotifFreq(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-panel2/40 px-3 py-2 text-text"
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </label>
            </CardContent>
          </Card>
        )
      case 'api':
        return (
          <Card className="tt-noise">
            <CardHeader><CardTitle>API Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2 font-mono text-sm">{apiKey}</div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={async () => { await navigator.clipboard.writeText('tt_live_demo_key'); notify.success('Copied', 'API key copied.') }}>
                  Copy API key
                </Button>
                <Button variant="ghost" onClick={() => notify.warning('Regenerate', 'This will invalidate your current key.')}>
                  Regenerate key
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case 'scan':
        return (
          <Card className="tt-noise">
            <CardHeader><CardTitle>Scan Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <label className="block text-sm">
                <span className="text-muted">Default scan timeout</span>
                <select value={scanTimeout} onChange={(e) => setScanTimeout(e.target.value)} className="mt-1 w-full rounded-xl border border-border/60 bg-panel2/40 px-3 py-2 text-text">
                  <option value="30">30 seconds</option>
                  <option value="60">60 seconds</option>
                  <option value="120">120 seconds</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-muted">Auto-delete old scans</span>
                <select value={autoDelete} onChange={(e) => setAutoDelete(e.target.value)} className="mt-1 w-full rounded-xl border border-border/60 bg-panel2/40 px-3 py-2 text-text">
                  <option value="never">Never</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-muted">Max file size</span>
                <select value={maxFileSize} onChange={(e) => setMaxFileSize(e.target.value)} className="mt-1 w-full rounded-xl border border-border/60 bg-panel2/40 px-3 py-2 text-text">
                  <option value="50">50 MB</option>
                  <option value="100">100 MB</option>
                  <option value="200">200 MB</option>
                </select>
              </label>
            </CardContent>
          </Card>
        )
      case 'appearance':
        return (
          <Card className="tt-noise">
            <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
                <div className="text-xs text-muted">Theme</div>
                <div className="font-semibold text-text">Dark (default)</div>
              </div>
              <label className="block text-sm">
                <span className="text-muted">Font size</span>
                <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="mt-1 w-full rounded-xl border border-border/60 bg-panel2/40 px-3 py-2 text-text">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </label>
            </CardContent>
          </Card>
        )
    }
  })()

  return (
    <AppShell title="Settings" subtitle="Account, notifications, API, and scan preferences.">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-1 rounded-2xl border border-border/60 bg-panel/45 p-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                'w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors',
                section === s.id ? 'bg-cyan/10 text-cyan border border-cyan/30' : 'text-muted hover:text-text hover:bg-panel2/40',
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div>{panel}</div>
      </div>
    </AppShell>
  )
}
