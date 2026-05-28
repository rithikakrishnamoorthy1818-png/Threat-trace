import type { URLScan, URLScanResult } from '../types'
import { api } from './api'
import { analyzeUrl } from './urlReputation'

const HISTORY_KEY = 'tt_url_scan_history'
const RESULTS_KEY = 'tt_url_scan_results'

function sleep(ms: number) {
  return new Promise((r) => window.setTimeout(r, ms))
}

function loadHistory(): URLScan[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as URLScan[]) : []
  } catch {
    return []
  }
}

function saveHistory(items: URLScan[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 200)))
}

function loadResultsMap(): Record<string, URLScanResult> {
  try {
    const raw = localStorage.getItem(RESULTS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, URLScanResult>) : {}
  } catch {
    return {}
  }
}

function saveResult(result: URLScanResult) {
  const map = loadResultsMap()
  map[result.id] = result
  localStorage.setItem(RESULTS_KEY, JSON.stringify(map))
}

function getCachedResult(scanId: string): URLScanResult | null {
  return loadResultsMap()[scanId] ?? null
}

function appendHistory(scan: URLScan, result: URLScanResult) {
  saveResult(result)
  const next = [scan, ...loadHistory().filter((s) => s.id !== scan.id)].slice(0, 200)
  saveHistory(next)
}

export const urlScannerService = {
  getLocalHistory(): URLScan[] {
    return loadHistory()
  },

  clearHistory() {
    saveHistory([])
    localStorage.removeItem(RESULTS_KEY)
  },

  deleteScan(id: string) {
    saveHistory(loadHistory().filter((s) => s.id !== id))
    const map = loadResultsMap()
    delete map[id]
    localStorage.setItem(RESULTS_KEY, JSON.stringify(map))
  },

  async scanURL(url: string): Promise<{ scanId: string; result: URLScanResult }> {
    try {
      const res = await api.post('/url/scan', { url })
      return res.data as { scanId: string; result: URLScanResult }
    } catch {
      await sleep(500)
      const scanId = `url_${crypto.randomUUID().slice(0, 8)}`
      const result = analyzeUrl(url, scanId)
      const scan: URLScan = {
        id: scanId,
        url,
        scannedAt: result.scannedAt,
        riskScore: result.riskScore,
        classification: result.classification,
      }
      appendHistory(scan, result)
      return { scanId, result }
    }
  },

  async getURLResults(scanId: string): Promise<URLScanResult> {
    const cached = getCachedResult(scanId)
    if (cached) return cached

    try {
      const res = await api.get(`/url/${scanId}/results`)
      return res.data as URLScanResult
    } catch {
      await sleep(200)
      const hist = loadHistory().find((s) => s.id === scanId)
      if (hist) {
        const result = analyzeUrl(hist.url, scanId)
        saveResult(result)
        return result
      }
      return analyzeUrl('https://example.com', scanId)
    }
  },

  async batchScanURLs(
    urls: string[],
    onProgress?: (index: number, url: string, result?: URLScanResult) => void,
  ): Promise<URLScanResult[]> {
    try {
      const res = await api.post('/url/batch-scan', { urls })
      return res.data as URLScanResult[]
    } catch {
      const results: URLScanResult[] = []
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i]!
        onProgress?.(i, url)
        await sleep(400)
        const scanId = `url_${crypto.randomUUID().slice(0, 8)}`
        const result = analyzeUrl(url, scanId)
        appendHistory(
          {
            id: scanId,
            url,
            scannedAt: result.scannedAt,
            riskScore: result.riskScore,
            classification: result.classification,
          },
          result,
        )
        results.push(result)
        onProgress?.(i + 1, url, result)
      }
      return results
    }
  },

  async getURLHistory(limit = 20, offset = 0): Promise<URLScan[]> {
    try {
      const res = await api.get(`/url/history?limit=${limit}&offset=${offset}`)
      return res.data as URLScan[]
    } catch {
      await sleep(100)
      return loadHistory().slice(offset, offset + limit)
    }
  },
}
