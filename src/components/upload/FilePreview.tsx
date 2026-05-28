import { FileText, X } from 'lucide-react'
import { formatBytes } from '../../utils/formatters'
import { Button } from '../common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'

export function FilePreview({
  file,
  onCancel,
  onUpload,
  disabled,
}: {
  file: File
  onCancel: () => void
  onUpload: () => void
  disabled?: boolean
}) {
  return (
    <Card className="tt-noise">
      <CardHeader>
        <CardTitle>Selected File</CardTitle>
        <Button variant="ghost" size="sm" aria-label="Cancel" onClick={onCancel}>
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-border/60 bg-panel2/60 p-2">
            <FileText className="h-4 w-4 text-cyan" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-heading text-sm font-bold text-text">
              {file.name}
            </div>
            <div className="mt-1 text-sm text-muted">
              {formatBytes(file.size)} · {file.type || 'unknown'} ·{' '}
              {new Date(file.lastModified).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button className="flex-1" onClick={onUpload} disabled={disabled}>
            {disabled ? 'Working…' : 'Upload & Scan'}
          </Button>
          <Button
            className="flex-1"
            variant="secondary"
            onClick={onCancel}
            disabled={disabled}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

