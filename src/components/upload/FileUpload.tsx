import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadZone } from './UploadZone'
import { FilePreview } from './FilePreview'
import { ProgressBar } from './ProgressBar'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import { fileService } from '../../services/fileService'
import { isAcceptedFile, maxSizeOk } from '../../utils/validators'
import { useNotification } from '../../hooks/useNotification'
import { useNotificationCenter } from '../../context/NotificationCenterContext'
import { formatBytes } from '../../utils/formatters'

type RecentUpload = {
  id: string
  name: string
  size: number
  at: string
}

const RECENT_KEY = 'tt_recent_uploads'

function loadRecent(): RecentUpload[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? (JSON.parse(raw) as RecentUpload[]) : []
  } catch {
    return []
  }
}

function saveRecent(items: RecentUpload[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, 8)))
}

export function FileUpload() {
  const nav = useNavigate()
  const notify = useNotification()
  const alerts = useNotificationCenter()

  const [file, setFile] = useState<File | null>(null)
  const [stage, setStage] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle')
  const [progress, setProgress] = useState(0)
  const [recent, setRecent] = useState<RecentUpload[]>(() => loadRecent())

  const acceptText = useMemo(
    () => 'Accepted: exe, dll, bin, elf, apk, zip, rar, pdf · Max: 100MB',
    [],
  )

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <div className="text-center">
        <div className="font-heading text-2xl font-bold tracking-[0.1em] uppercase">
          Scan Malware File
        </div>
        <div className="mt-2 text-sm text-muted">
          Drag malware files &amp; PDFs for static + dynamic analysis (stub pipeline).
        </div>
      </div>

      {!file ? (
        <UploadZone
          acceptText={acceptText}
          onPick={(f) => {
            if (!isAcceptedFile(f)) {
              notify.error('Rejected', 'Unsupported file type.')
              return
            }
            if (!maxSizeOk(f)) {
              notify.error('Rejected', 'File exceeds 100MB.')
              return
            }
            setFile(f)
            setStage('idle')
            setProgress(0)
          }}
        />
      ) : (
        <div className="space-y-4">
          <FilePreview
            file={file}
            disabled={stage === 'uploading' || stage === 'processing'}
            onCancel={() => {
              setFile(null)
              setStage('idle')
              setProgress(0)
            }}
            onUpload={async () => {
              try {
                setStage('uploading')
                setProgress(0)
                const res = await fileService.uploadFile(file, (pct, st) => {
                  setStage(st)
                  setProgress(pct)
                })
                setStage('done')
                notify.success('Scan queued', 'Opening analysis results…')
                alerts.add({
                  message: `Scan completed: ${file.name}`,
                  tone: res.classification === 'safe' ? 'success' : res.classification === 'suspicious' ? 'warning' : 'error',
                  href: `/analysis/${res.scanId}`,
                })

                const nextRecent: RecentUpload[] = [
                  { id: res.scanId, name: file.name, size: file.size, at: new Date().toISOString() },
                  ...recent,
                ]
                setRecent(nextRecent.slice(0, 8))
                saveRecent(nextRecent)
                nav(`/analysis/${res.scanId}`)
              } catch (err) {
                notify.error('Upload failed', String(err))
                setStage('idle')
              }
            }}
          />

          {stage !== 'idle' ? (
            <Card className="tt-noise tt-scanline">
              <CardHeader>
                <CardTitle>Upload Progress</CardTitle>
                <Badge
                  variant={stage === 'processing' ? 'warning' : stage === 'done' ? 'safe' : 'info'}
                >
                  {stage === 'uploading'
                    ? 'Uploading…'
                    : stage === 'processing'
                      ? 'Processing…'
                      : 'Complete!'}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                <ProgressBar
                  value={progress}
                  tone={stage === 'processing' ? 'warning' : stage === 'done' ? 'success' : 'cyan'}
                />
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>{Math.round(progress)}%</span>
                  <span>
                    {stage === 'processing'
                      ? 'Detonating in sandbox…'
                      : stage === 'uploading'
                        ? 'Transferring sample…'
                        : 'Report generated.'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <div className="text-xs text-muted">Local history</div>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="text-sm text-muted">No uploads yet.</div>
          ) : (
            <ul className="space-y-2">
              {recent.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-panel2/30 px-3 py-2 hover:border-cyan/40 hover:bg-panel2/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-text">{u.name}</div>
                    <div className="text-xs text-muted">
                      {formatBytes(u.size)} · {new Date(u.at).toLocaleString()}
                    </div>
                  </div>
                  <button
                    className="text-sm text-cyan hover:underline"
                    onClick={() => nav(`/analysis/${u.id}`)}
                  >
                    Open
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

