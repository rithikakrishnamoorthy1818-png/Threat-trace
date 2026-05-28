import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotificationCenter } from '../../context/NotificationCenterContext'
import { Button } from './Button'
import { cn } from '../../utils/cn'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? '' : 's'} ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const toneIcon = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

const toneColor = {
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-primary',
  info: 'text-cyan',
}

export function NotificationsPanel() {
  const { items, unreadCount, markRead, markAllRead, clearAll } = useNotificationCenter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const visible = items.slice(0, 5)

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-cyan/40 bg-panel/95 shadow-[var(--tt-shadow-cyan)] backdrop-blur"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="font-heading text-sm font-bold tracking-wide uppercase">Notifications</div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" aria-label="Mark all read" onClick={markAllRead}>
                  <CheckCheck className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" aria-label="Clear all" onClick={clearAll}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {visible.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted">No notifications yet.</div>
              ) : (
                visible.map((n) => {
                  const Icon = toneIcon[n.tone]
                  return (
                    <div
                      key={n.id}
                      className={cn(
                        'border-b border-border/40 px-4 py-3 transition-colors hover:bg-panel2/50',
                        !n.read && 'bg-cyan/5',
                      )}
                    >
                      <div className="flex gap-3">
                        <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', toneColor[n.tone])} />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-text">{n.message}</div>
                          <div className="mt-1 text-xs text-muted">{timeAgo(n.createdAt)}</div>
                          <div className="mt-2 flex items-center gap-2">
                            {n.href ? (
                              <Link
                                to={n.href}
                                className="text-xs font-semibold text-cyan hover:underline"
                                onClick={() => {
                                  markRead(n.id)
                                  setOpen(false)
                                }}
                              >
                                View report
                              </Link>
                            ) : null}
                            {!n.read ? (
                              <button
                                className="text-xs text-muted hover:text-text"
                                onClick={() => markRead(n.id)}
                              >
                                <Check className="mr-1 inline h-3 w-3" />
                                Mark read
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
