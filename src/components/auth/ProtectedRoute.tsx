import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LoadingSpinner } from '../common/LoadingSpinner'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-dvh tt-grid-bg flex items-center justify-center">
        <div className="tt-scanline rounded-2xl border border-border bg-panel/70 px-8 py-7 shadow-[var(--tt-shadow-cyan)]">
          <LoadingSpinner label="Validating session…" />
        </div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}

