import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh tt-grid-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Signal Lost</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted">
            The requested route does not exist in this console.
          </div>
          <Link
            to="/dashboard"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-primary/70 bg-primary px-4 text-sm font-semibold tracking-tight text-ink shadow-[var(--tt-shadow-red)] transition-all duration-300 hover:shadow-[0_0_38px_rgba(255,23,68,0.55)] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Return to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

