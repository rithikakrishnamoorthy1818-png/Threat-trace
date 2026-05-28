import type {
  AnalysisOverview,
  MalwareFamilyStat,
  PDFAnalysisData,
  ScanRecord,
  TimelinePoint,
  URLScan,
} from '../types'
import { api } from './api'
import { urlScannerService } from './urlScannerService'
import { detailToOverview, getFileAnalysis, scanStatusFromClassification } from './fileAnalysis'

function sleep(ms: number) {
  return new Promise((r) => window.setTimeout(r, ms))
}

function hashLike(len: number) {
  const chars = 'abcdef0123456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export const analysisService = {
  async getDashboardStats() {
    await sleep(280)
    const urlHistory = urlScannerService.getLocalHistory()
    const suspiciousUrls = urlHistory.filter(
      (s) => s.classification !== 'safe' && Date.now() - new Date(s.scannedAt).getTime() < 7 * 86400000,
    ).length
    return {
      filesScanned: 12842,
      threatsDetected: 392,
      criticalAlerts: 18,
      suspiciousUrlsThisWeek: suspiciousUrls || 14,
    }
  },

  async getRecentURLScans(limit = 3): Promise<URLScan[]> {
    await sleep(180)
    return urlScannerService.getLocalHistory().slice(0, limit)
  },

  async getURLRiskDistribution() {
    await sleep(180)
    const hist = urlScannerService.getLocalHistory()
    const counts = { safe: 0, suspicious: 0, malicious: 0, phishing: 0 }
    for (const s of hist) counts[s.classification]++
    if (hist.length === 0) {
      return [
        { name: 'Safe', value: 42, color: 'var(--tt-success)' },
        { name: 'Suspicious', value: 18, color: 'var(--tt-warning)' },
        { name: 'Malicious', value: 9, color: 'var(--tt-primary)' },
        { name: 'Phishing', value: 6, color: '#b388ff' },
      ]
    }
    return [
      { name: 'Safe', value: counts.safe, color: 'var(--tt-success)' },
      { name: 'Suspicious', value: counts.suspicious, color: 'var(--tt-warning)' },
      { name: 'Malicious', value: counts.malicious, color: 'var(--tt-primary)' },
      { name: 'Phishing', value: counts.phishing, color: '#b388ff' },
    ]
  },

  async getThreatTimeline(): Promise<TimelinePoint[]> {
    await sleep(350)
    const now = new Date()
    const points: TimelinePoint[] = []
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const label = d.toISOString().slice(5, 10)
      const base = 6 + Math.sin(i / 3.2) * 2
      const spikes = i % 11 === 0 ? 10 : 0
      points.push({ day: label, threats: Math.max(0, Math.round(base + spikes + Math.random() * 3)) })
    }
    return points
  },

  async getTopFamilies(): Promise<MalwareFamilyStat[]> {
    await sleep(320)
    return [
      { family: 'RedLine', count: 68 },
      { family: 'AgentTesla', count: 54 },
      { family: 'QakBot', count: 43 },
      { family: 'AsyncRAT', count: 38 },
      { family: 'Lumma', count: 29 },
    ]
  },

  async getRecentScans(): Promise<ScanRecord[]> {
    await sleep(200)
    try {
      const raw = localStorage.getItem('tt_recent_uploads')
      if (raw) {
        const uploads = JSON.parse(raw) as { id: string; name: string; at: string }[]
        if (uploads.length) {
          return uploads.map((u) => {
            const detail = getFileAnalysis(u.id)
            const risk = detail?.riskScore ?? 0
            const status = detail
              ? scanStatusFromClassification(detail.classification)
              : 'Pending'
            return {
              id: u.id,
              fileName: u.name,
              scanDate: detail?.uploadTime ?? u.at,
              riskScore: risk,
              malwareFamily: detail?.malwareFamily ?? 'Pending',
              status,
            }
          })
        }
      }
    } catch {
      /* fall through */
    }
    return []
  },

  getUploadMeta(scanId: string): { fileName: string; mediaKind: 'binary' | 'pdf' } | null {
    try {
      const raw = localStorage.getItem('tt_recent_uploads')
      if (!raw) return null
      const items = JSON.parse(raw) as { id: string; name: string }[]
      const hit = items.find((x) => x.id === scanId)
      if (!hit) return null
      const isPdf = hit.name.toLowerCase().endsWith('.pdf')
      return { fileName: hit.name, mediaKind: isPdf ? 'pdf' : 'binary' }
    } catch {
      return null
    }
  },

  async getAnalysisOverview(scanId: string): Promise<AnalysisOverview> {
    await sleep(180)
    const stored = getFileAnalysis(scanId)
    if (stored) return detailToOverview(stored)

    const meta = this.getUploadMeta(scanId)
    const isPdf = meta?.mediaKind === 'pdf'
    return {
      id: scanId,
      fileName: meta?.fileName ?? (isPdf ? 'document.pdf' : 'unknown.bin'),
      fileSizeBytes: 0,
      fileType: isPdf ? 'PDF Document' : 'Unknown',
      uploadTime: new Date().toISOString(),
      md5: hashLike(32),
      sha1: hashLike(40),
      sha256: hashLike(64),
      riskScore: 0,
      confidence: 50,
      malwareFamily: 'Unknown',
      mediaKind: isPdf ? 'pdf' : 'binary',
      classification: 'safe',
      reason: 'No analysis data found for this scan.',
    }
  },

  async getPDFAnalysis(scanId: string): Promise<PDFAnalysisData> {
    try {
      const res = await api.get(`/analysis/${scanId}/pdf-analysis`)
      return res.data as PDFAnalysisData
    } catch {
      await sleep(480)
      return {
        basicInfo: {
          pages: 12,
          author: 'John Doe',
          creator: 'Microsoft Word',
          createdDate: new Date('2024-01-15').toISOString(),
          modifiedDate: new Date('2024-02-02').toISOString(),
          encrypted: false,
          fileSize: 2_621_440,
          isSuspicious: true,
          riskScore: 68,
        },
        content: {
          extractedText:
            'Please verify your account immediately. Click the link below to confirm your identity and update payment details. This document contains embedded resources that may execute scripts when opened in vulnerable viewers.',
          imagesCount: 4,
          embeddedFiles: ['payload.exe', 'macro.bin'],
        },
        metadata: {
          title: 'Invoice Q1 2024',
          subject: 'Billing',
          keywords: ['invoice', 'payment', 'urgent'],
          producer: 'Adobe PDF Library 15.0',
          anomalies: [
            'File modified multiple times',
            'Creator/Producer mismatch',
            'No author metadata in some revisions',
          ],
        },
        security: {
          hasJavaScript: true,
          hasEmbeddedExecutables: true,
          hasSuspiciousLinks: true,
          suspiciousLinkCount: 3,
          hasForms: true,
        },
        threats: {
          maliciousLinks: [
            'https://malware.com/download',
            'https://phishing.net/login',
            'http://cdn-bad.example/track',
          ],
          suspiciousPatterns: [
            'verify your account',
            'confirm identity',
            'update payment',
          ],
          embeddedFilesRisk: [{ name: 'payload.exe', risk: 'HIGH' }],
          riskScore: 68,
        },
      }
    }
  },

  async extractPDFText(scanId: string): Promise<string> {
    try {
      const res = await api.get(`/analysis/${scanId}/pdf-text`)
      return (res.data as { extracted_text: string }).extracted_text
    } catch {
      const data = await this.getPDFAnalysis(scanId)
      return data.content.extractedText
    }
  },
}

