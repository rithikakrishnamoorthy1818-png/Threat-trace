import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User } from 'lucide-react'
import { Button } from '../common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../hooks/useNotification'
import { cn } from '../../utils/cn'

function strength(pw: string) {
  let score = 0
  if (pw.length >= 10) score += 1
  if (/[A-Z]/.test(pw)) score += 1
  if (/[0-9]/.test(pw)) score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  return score // 0..4
}

export function Signup() {
  const { signup } = useAuth()
  const notify = useNotification()
  const nav = useNavigate()

  const [name, setName] = useState('ThreatTrace Analyst')
  const [email, setEmail] = useState('analyst@threattrace.local')
  const [password, setPassword] = useState('S3cure!Passw0rd')
  const [confirm, setConfirm] = useState('S3cure!Passw0rd')
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const s = useMemo(() => strength(password), [password])
  const ok = accepted && password === confirm && password.length >= 8

  return (
    <div className="min-h-dvh tt-grid-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md tt-noise">
        <CardHeader>
          <div>
            <CardTitle>Provision Account</CardTitle>
            <div className="mt-1 text-sm text-muted">
              Create an operator identity.
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              if (!ok) return
              try {
                setLoading(true)
                await signup(name, email, password)
                notify.success('Account created', 'Session established.')
                nav('/dashboard', { replace: true })
              } catch (err) {
                notify.error('Signup failed', String(err))
              } finally {
                setLoading(false)
              }
            }}
          >
            <label className="block">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-muted">
                <User className="h-3.5 w-3.5" aria-hidden="true" /> Name
              </div>
              <input
                className="w-full rounded-xl border-border/60 bg-panel2/70 px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-cyan/70 focus:ring-cyan/40"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Password strength</span>
                  <span>{s}/4</span>
                </div>
                <div className="mt-1 grid grid-cols-4 gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 rounded-full border border-border/60 bg-panel2/70',
                        s > i
                          ? i >= 2
                            ? 'bg-success/70 border-success/50 shadow-[0_0_14px_rgba(0,255,65,0.18)]'
                            : 'bg-warning/70 border-warning/50 shadow-[0_0_14px_rgba(255,145,0,0.16)]'
                          : '',
                      )}
                    />
                  ))}
                </div>
              </div>
            </label>

            <label className="block">
              <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-muted">
                <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Confirm
              </div>
              <input
                className="w-full rounded-xl border-border/60 bg-panel2/70 px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-cyan/70 focus:ring-cyan/40"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              {confirm && confirm !== password ? (
                <div className="mt-1 text-xs text-primary">
                  Passwords do not match.
                </div>
              ) : null}
            </label>

            <label className="flex items-start gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span>
                I agree to the terms and acknowledge responsible use.
              </span>
            </label>

            <Button className="w-full" disabled={!ok || loading} type="submit">
              {loading ? 'Provisioning…' : 'Create account'}
            </Button>

            <div className="text-center text-sm text-muted">
              Already authorized?{' '}
              <Link className="text-cyan hover:underline" to="/login">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

