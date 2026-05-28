import { useMemo, useState } from 'react'
import { List } from 'lucide-react'
import { Button } from '../common/Button'
import { parseUrlsFromText } from '../../utils/validators'

export function BatchURLInput({
  onScan,
  isLoading,
}: {
  onScan: (urls: string[]) => void
  isLoading: boolean
}) {
  const [text, setText] = useState('')

  const { valid, invalid } = useMemo(() => parseUrlsFromText(text), [text])

  return (
    <div className="space-y-3">
      <label className="block">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-muted">
          <List className="h-3.5 w-3.5" aria-hidden="true" />
          Batch URLs (one per line)
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={'https://example.com\nhttps://suspicious-site.net'}
          className="w-full rounded-xl border border-border/60 bg-panel2/70 px-3 py-2 text-sm text-text placeholder:text-muted/60 focus:border-cyan/70 focus:outline-none focus:ring-2 focus:ring-cyan/40"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-muted">
          {valid.length > 0
            ? `${valid.length} valid URL${valid.length === 1 ? '' : 's'} ready to scan`
            : 'Paste URLs to begin'}
        </span>
        {invalid.length > 0 ? (
          <span className="text-xs text-warning">{invalid.length} invalid line(s) ignored</span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled={valid.length === 0 || isLoading} onClick={() => onScan(valid)}>
          {isLoading ? 'Scanning…' : 'Scan All'}
        </Button>
        <Button
          variant="secondary"
          disabled={isLoading || !text}
          onClick={() => setText('')}
        >
          Clear all
        </Button>
      </div>
    </div>
  )
}
