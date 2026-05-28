import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { NotificationCenterItem } from '../types'

type AddInput = {
  title?: string
  message: string
  tone?: NotificationCenterItem['tone']
  href?: string
}

type NotificationCenterContextValue = {
  items: NotificationCenterItem[]
  unreadCount: number
  add: (input: AddInput) => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
}

const NotificationCenterContext = createContext<NotificationCenterContextValue | null>(null)

const STORAGE_KEY = 'tt_notification_center'

function loadItems(): NotificationCenterItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as NotificationCenterItem[]) : []
  } catch {
    return []
  }
}

function persist(items: NotificationCenterItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)))
}

export function NotificationCenterProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NotificationCenterItem[]>(() => loadItems())

  const persistAndSet = useCallback((next: NotificationCenterItem[]) => {
    persist(next)
    setItems(next)
  }, [])

  const add = useCallback(
    (input: AddInput) => {
      const item: NotificationCenterItem = {
        id: crypto.randomUUID(),
        title: input.title ?? 'ThreatTrace',
        message: input.message,
        tone: input.tone ?? 'info',
        createdAt: new Date().toISOString(),
        read: false,
        ...(input.href ? { href: input.href } : {}),
      }
      setItems((prev) => {
        const next = [item, ...prev].slice(0, 50)
        persist(next)
        return next
      })
    },
    [],
  )

  const markRead = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      persist(next)
      return next
    })
  }, [])

  const markAllRead = useCallback(() => {
    setItems((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }))
      persist(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => persistAndSet([]), [persistAndSet])

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items])

  const value = useMemo(
    () => ({ items, unreadCount, add, markRead, markAllRead, clearAll }),
    [items, unreadCount, add, markRead, markAllRead, clearAll],
  )

  return (
    <NotificationCenterContext.Provider value={value}>
      {children}
    </NotificationCenterContext.Provider>
  )
}

export function useNotificationCenter() {
  const ctx = useContext(NotificationCenterContext)
  if (!ctx) throw new Error('useNotificationCenter must be used within NotificationCenterProvider')
  return ctx
}
