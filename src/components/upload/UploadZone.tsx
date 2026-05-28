import { useCallback, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '../../utils/cn'

export function UploadZone({
  onPick,
  acceptText,
}: {
  onPick: (file: File) => void
  acceptText: string
}) {
  const [hover, setHover] = useState(false)

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setHover(false)
      const f = e.dataTransfer.files?.[0]
      if (f) onPick(f)
    },
    [onPick],
  )

  return (
    <div className="w-full">
      <label
        className={cn(
          'tt-noise tt-scanline flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-panel/45 px-6 py-10 text-center transition-all duration-300',
          hover
            ? 'border-primary/70 shadow-[0_0_40px_rgba(255,23,68,0.2)]'
            : 'border-border/60 hover:border-primary/55 hover:shadow-[0_0_34px_rgba(255,23,68,0.16)]',
        )}
        onDragEnter={() => setHover(true)}
        onDragLeave={() => setHover(false)}
        onDragOver={(e) => {
          e.preventDefault()
          setHover(true)
        }}
        onDrop={onDrop}
      >
        <div className="rounded-2xl border border-border/60 bg-ink/20 p-4 shadow-[0_0_26px_rgba(0,188,212,0.12)]">
          <UploadCloud className="h-6 w-6 text-cyan" aria-hidden="true" />
        </div>
        <div className="font-heading text-sm font-bold tracking-[0.16em] uppercase text-text">
          Drag malware files &amp; PDFs here or click to browse
        </div>
        <div className="text-sm text-muted">{acceptText}</div>
        <input
          className="sr-only"
          type="file"
          accept=".exe,.dll,.bin,.elf,.apk,.zip,.rar,.pdf,application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onPick(f)
          }}
        />
      </label>
    </div>
  )
}

