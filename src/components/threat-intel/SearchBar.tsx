import { Search } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-border/60 bg-panel2/60 px-3 py-2 focus-within:border-cyan/70 focus-within:shadow-[0_0_26px_rgba(0,188,212,0.14)] transition-all">
      <Search className="h-4 w-4 text-muted" aria-hidden="true" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by hash, family, threat group…"
        className="h-10 w-full bg-transparent text-sm text-text placeholder:text-muted/60 focus:outline-none"
        aria-label="Threat intel search"
      />
    </label>
  )
}

