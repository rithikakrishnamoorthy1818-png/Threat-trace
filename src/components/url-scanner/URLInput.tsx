import { useEffect, useMemo, useState } from 'react'
import { Link2 } from 'lucide-react'
import { Button } from '../common/Button'
import { isValidHttpUrl } from '../../utils/validators'
import { cn } from '../../utils/cn'

const HISTORY_KEY = 'tt_url_input_history'

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function pushHistory(url: string) {
  const next = [url, ...loadHistory().filter((u) => u !== url)].slice(0, 5)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
}

export function URLInput({
  onScan,
  isLoading,
}: {
  onScan: (url: string) => void
  isLoading: boolean
}) {
  const [value, setValue] = useState('https://')
  const [touched, setTouched] = useState(false)
  const [history, setHistory] = useState<string[]>(() => loadHistory())

  const valid = useMemo(() => isValidHttpUrl(value), [value])

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  return (
    <div className="space-y-3">
      <label className="block">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-muted">
          <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
          Target URL
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="https://example.com"
          className={cn(
            'w-full rounded-xl border bg-panel2/70 px-3 py-2.5 text-sm text-text placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-cyan/40',
            touched && !valid
              ? 'border-primary/60'
              : 'border-border/60 focus:border-cyan/70',
          )}
          aria-invalid={touched && !valid}
        />
        {touched && !valid ? (
          <p className="mt-1 text-xs text-primary" role="alert">
            Enter a valid URL starting with http:// or https://
          </p>
        ) : null}
      </label>

      {history.length > 0 ? (
        <div>
          <div className="mb-1 text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
            Recent (last 5)
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((u) => (
              <button
                key={u}
                type="button"
                className="max-w-full truncate rounded-lg border border-border/50 bg-panel2/40 px-2 py-1 text-xs text-muted transition-colors hover:border-cyan/40 hover:text-text"
                onClick={() => {
                  setValue(u)
                  setTouched(false)
                }}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <Button
        className="w-full sm:w-auto"
        disabled={!valid || isLoading}
        onClick={() => {
          pushHistory(value.trim())
          setHistory(loadHistory())
          onScan(value.trim())
        }}
      >
        {isLoading ? 'Scanning…' : 'Scan URL'}
      </Button>
    </div>
  )
}
