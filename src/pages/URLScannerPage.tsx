import { useCallback, useState } from 'react'
import { AppShell } from '../components/common/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import { URLInput } from '../components/url-scanner/URLInput'
import { BatchURLInput } from '../components/url-scanner/BatchURLInput'
import { URLScanResults } from '../components/url-scanner/URLScanResults'
import { RecentURLScans } from '../components/url-scanner/RecentURLScans'
import {
  URLScanProgress,
  type BatchProgressItem,
} from '../components/url-scanner/URLScanProgress'
import { urlScannerService } from '../services/urlScannerService'
import type { URLScan } from '../types'
import { useNotification } from '../hooks/useNotification'
import { useNotificationCenter } from '../context/NotificationCenterContext'

export default function URLScannerPage() {
  const notify = useNotification()
  const alerts = useNotificationCenter()
  const [history, setHistory] = useState<URLScan[]>(() => urlScannerService.getLocalHistory())
  const [loading, setLoading] = useState(false)
  const [activeScan, setActiveScan] = useState<{ scanId: string; url: string } | null>(null)

  const [batch, setBatch] = useState<{
    running: boolean
    currentIndex: number
    total: number
    currentUrl: string
    completed: BatchProgressItem[]
    cancelled: boolean
  } | null>(null)

  const refreshHistory = useCallback(() => {
    setHistory(urlScannerService.getLocalHistory())
  }, [])

  const runSingleScan = async (url: string) => {
    try {
      setLoading(true)
      const { scanId, result } = await urlScannerService.scanURL(url)
      setActiveScan({ scanId, url })
      refreshHistory()
      notify.success('Scan complete', 'URL analysis ready.')
      alerts.add({
        message: `URL scan: ${url}`,
        tone: result.classification === 'safe' ? 'success' : result.classification === 'suspicious' ? 'warning' : 'error',
        href: '/scan-url',
      })
    } catch (err) {
      notify.error('Scan failed', String(err))
    } finally {
      setLoading(false)
    }
  }

  const runBatchScan = async (urls: string[]) => {
    setBatch({
      running: true,
      currentIndex: 0,
      total: urls.length,
      currentUrl: urls[0] ?? '',
      completed: [],
      cancelled: false,
    })
    setLoading(true)

    let cancelled = false
    const cancelRef = { get cancelled() { return cancelled } }

    try {
      for (let i = 0; i < urls.length; i++) {
        if (cancelRef.cancelled) break
        const url = urls[i]!
        setBatch((b) =>
          b
            ? { ...b, currentIndex: i, currentUrl: url }
            : b,
        )
        const { scanId, result } = await urlScannerService.scanURL(url)
        const ok = result.classification === 'safe' || result.isWhitelisted === true
        setBatch((b) =>
          b
            ? {
                ...b,
                currentIndex: i + 1,
                completed: [...b.completed, { url, ok }],
              }
            : b,
        )
        if (i === urls.length - 1) {
          setActiveScan({ scanId, url })
        }
      }
      refreshHistory()
      notify.success('Batch complete', `${urls.length} URLs processed.`)
    } catch (err) {
      notify.error('Batch failed', String(err))
    } finally {
      setLoading(false)
      setBatch(null)
    }

    return () => {
      cancelled = true
    }
  }

  return (
    <AppShell
      title="URL Threat Scanner"
      subtitle="Single and batch URL reputation, SSL, and network enrichment."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="tt-noise">
            <CardHeader>
              <CardTitle>Single Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <URLInput onScan={runSingleScan} isLoading={loading && !batch?.running} />
            </CardContent>
          </Card>

          <Card className="tt-noise">
            <CardHeader>
              <CardTitle>Batch Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <BatchURLInput
                onScan={(urls) => {
                  void runBatchScan(urls)
                }}
                isLoading={loading}
              />
            </CardContent>
          </Card>
        </div>

        {batch?.running ? (
          <URLScanProgress
            currentIndex={batch.currentIndex}
            total={batch.total}
            currentUrl={batch.currentUrl}
            completed={batch.completed}
            onCancel={() => {
              setBatch((b) => (b ? { ...b, cancelled: true, running: false } : b))
              setLoading(false)
              notify.warning('Cancelled', 'Batch scan stopped.')
            }}
          />
        ) : null}

        {activeScan ? (
          <URLScanResults scanId={activeScan.scanId} url={activeScan.url} />
        ) : null}

        <RecentURLScans
          scans={history}
          onView={(scan) => setActiveScan({ scanId: scan.id, url: scan.url })}
          onRescan={(url) => void runSingleScan(url)}
          onDelete={(id) => {
            urlScannerService.deleteScan(id)
            refreshHistory()
            if (activeScan?.scanId === id) setActiveScan(null)
            notify.info('Deleted', 'Scan removed from history.')
          }}
          onClearAll={() => {
            urlScannerService.clearHistory()
            refreshHistory()
            setActiveScan(null)
            notify.success('Cleared', 'URL scan history cleared.')
          }}
        />
      </div>
    </AppShell>
  )
}
