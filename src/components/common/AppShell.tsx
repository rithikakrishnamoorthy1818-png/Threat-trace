import { type ReactNode, useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-dvh tt-grid-bg">
      <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 px-4 py-6 sm:px-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-[0.08em] uppercase">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-muted">{subtitle}</p>
              ) : null}
            </div>
            {actions ? <div className="flex gap-2">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}

