import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { GitFork, Lock, Mail } from 'lucide-react'
import { Button } from '../common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../hooks/useNotification'

export function Login() {
  const { login } = useAuth()
  const notify = useNotification()
  const nav = useNavigate()
  const location = useLocation()
  const from = useMemo(() => {
    const s = location.state as { from?: string } | null
    return s?.from ?? '/dashboard'
  }, [location.state])

  const [email, setEmail] = useState('analyst@threattrace.local')
  const [password, setPassword] = useState('password')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-dvh tt-grid-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md tt-noise">
        <CardHeader>
          <div>
            <CardTitle>Access Console</CardTitle>
            <div className="mt-1 text-sm text-muted">
              Authenticate to ThreatTrace.
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              try {
                setLoading(true)
                await login(email, password)
                if (!remember) {
                  // keep current session only (stub); leave token stored for now
                }
                notify.success('Session established', 'Welcome back.')
                nav(from, { replace: true })
              } catch (err) {
                notify.error('Login failed', String(err))
              } finally {
                setLoading(false)
              }
            }}
          >
            <label className="block">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-muted">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email
              </div>
              <input
                className="w-full rounded-xl border-border/60 bg-panel2/70 px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-cyan/70 focus:ring-cyan/40"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-muted">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Password
              </div>
              <input
                className="w-full rounded-xl border-border/60 bg-panel2/70 px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-cyan/70 focus:ring-cyan/40"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <a className="text-sm text-cyan hover:underline" href="#">
                Forgot password?
              </a>
            </div>

            <Button className="w-full" disabled={loading} type="submit">
              {loading ? 'Authorizing…' : 'Login'}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() =>
                  notify.info('OAuth stub', 'Google OAuth integration comes later.')
                }
                aria-label="Continue with Google"
              >
                G
                <span className="sr-only">Continue with Google</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() =>
                  notify.info('OAuth stub', 'GitHub OAuth integration comes later.')
                }
                aria-label="Continue with GitHub"
              >
                <GitFork className="h-4 w-4" aria-hidden="true" />
                GitHub
              </Button>
            </div>

            <div className="text-center text-sm text-muted">
              New operator?{' '}
              <Link className="text-cyan hover:underline" to="/signup">
                Create account
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

