import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { Button } from './Button'
import { NotificationsPanel } from './NotificationsPanel'
import { UserCircle2, Shield } from 'lucide-react'

export function Header({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void
}) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-ink/65 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
          >
            <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_rgba(0,188,212,0.7)]" />
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(255,23,68,0.6)]" />
            <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_rgba(0,255,65,0.55)]" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-cyan/40 bg-panel2/70 p-2 shadow-[var(--tt-shadow-cyan)]">
              <Shield className="h-4 w-4 text-cyan" aria-hidden="true" />
            </div>
            <div className="leading-none">
              <div className="font-heading text-sm font-bold tracking-[0.1em] uppercase">
                ThreatTrace
              </div>
              <div className="text-xs text-muted">Malware Analysis & Attribution</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NotificationsPanel />
          <Button
            variant="ghost"
            size="sm"
            aria-label="Settings"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </Button>
          <div className="hidden items-center gap-2 rounded-xl border border-border/60 bg-panel2/60 px-3 py-1.5 sm:flex">
            <UserCircle2 className="h-4 w-4 text-muted" aria-hidden="true" />
            <div className="text-xs">
              <div className="font-semibold text-text">Analyst</div>
              <div className="text-[11px] text-muted">SOC Tier-2</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
