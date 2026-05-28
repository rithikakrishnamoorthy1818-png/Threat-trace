import { NavLink } from 'react-router-dom'
import { BarChart3, FileUp, FileText, Link2, Radar, Shield, Users } from 'lucide-react'
import { cn } from '../../utils/cn'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/upload', label: 'Upload', icon: FileUp },
  { to: '/scan-url', label: 'URL Scanner', icon: Link2 },
  { to: '/threat-intel', label: 'Threat Intel', icon: Radar },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/admin', label: 'Admin', icon: Users },
]

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {open ? (
        <button
          className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm lg:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      ) : null}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-dvh w-[280px] border-r border-border/60 bg-ink/75 backdrop-blur lg:static lg:z-auto lg:block',
          'transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
          <div className="rounded-xl border border-primary/45 bg-panel2/70 p-2 shadow-[var(--tt-shadow-red)]">
            <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div className="font-heading text-xs font-bold tracking-[0.16em] uppercase text-text">
            Control Plane
          </div>
        </div>

        <nav className="px-3 py-4">
          <div className="mb-3 px-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
            Navigation
          </div>
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-all duration-300',
                      'border-transparent hover:border-cyan/30 hover:bg-panel2/40 hover:shadow-[0_0_26px_rgba(0,188,212,0.12)]',
                      isActive
                        ? 'border-cyan/40 bg-panel/55 shadow-[0_0_28px_rgba(0,188,212,0.14)]'
                        : '',
                    )
                  }
                  onClick={onClose}
                >
                  <item.icon
                    className="h-4 w-4 text-muted transition-colors group-hover:text-cyan"
                    aria-hidden="true"
                  />
                  <span className="font-body">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

