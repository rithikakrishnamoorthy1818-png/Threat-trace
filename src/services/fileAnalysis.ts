import type { FileAnalysisDetail } from '../types'

const ANALYSIS_KEY = 'tt_file_analysis'

const STRING_PATTERNS: { pattern: string; label: string; weight: number }[] = [
  { pattern: 'CreateRemoteThread', label: 'CreateRemoteThread', weight: 28 },
  { pattern: 'WriteProcessMemory', label: 'WriteProcessMemory', weight: 28 },
  { pattern: 'SetWindowsHookEx', label: 'SetWindowsHookEx', weight: 22 },
  { pattern: 'VirtualAlloc', label: 'VirtualAlloc', weight: 14 },
  { pattern: 'URLDownloadToFile', label: 'URLDownloadToFile', weight: 22 },
  { pattern: 'WinHTTP', label: 'WinHTTP', weight: 18 },
  { pattern: 'cmd.exe', label: 'cmd.exe', weight: 20 },
  { pattern: 'powershell', label: 'powershell', weight: 20 },
  { pattern: 'RegSetValue', label: 'RegSetValue', weight: 16 },
  { pattern: 'HKEY_LOCAL_MACHINE', label: 'HKEY_LOCAL_MACHINE', weight: 14 },
  { pattern: 'IsDebuggerPresent', label: 'IsDebuggerPresent', weight: 12 },
  { pattern: 'Sleep', label: 'Sleep', weight: 8 },
  { pattern: 'OutputDebugString', label: 'OutputDebugString', weight: 8 },
  { pattern: 'CryptEncrypt', label: 'CryptEncrypt', weight: 24 },
  { pattern: 'UPX', label: 'UPX', weight: 16 },
]

function stableHash(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0
  return h
}

function hashHex(len: number, seed: string) {
  const chars = 'abcdef0123456789'
  let out = ''
  for (let i = 0; i < len; i++) out += chars[(stableHash(seed + i) + i) % chars.length]
  return out
}

export function extractAsciiStrings(data: Uint8Array, minLen = 4): string[] {
  const out: string[] = []
  let cur = ''
  for (let i = 0; i < data.length; i++) {
    const b = data[i]!
    if (b >= 32 && b <= 126) cur += String.fromCharCode(b)
    else {
      if (cur.length >= minLen) out.push(cur)
      cur = ''
    }
  }
  if (cur.length >= minLen) out.push(cur)
  return out
}

export function calculateEntropy(data: Uint8Array): number {
  if (data.length === 0) return 0
  const freq = new Array<number>(256).fill(0)
  const sample = data.subarray(0, Math.min(data.length, 256 * 1024))
  for (let i = 0; i < sample.length; i++) freq[sample[i]!]!++
  let entropy = 0
  for (let i = 0; i < 256; i++) {
    if (freq[i]! > 0) {
      const p = freq[i]! / sample.length
      entropy -= p * Math.log2(p)
    }
  }
  return Math.round(entropy * 100) / 100
}

function filenameRiskBoost(name: string): { score: number; strings: string[]; reason: string[] } {
  const lower = name.toLowerCase()
  let score = 0
  const strings: string[] = []
  const reason: string[] = []

  if (/invoice|payment|crack|keygen|trojan|malware|payload|dropper|stealer|rat|botnet/.test(lower)) {
    score += 25
    reason.push('Filename suggests malicious intent')
  }
  if (/readme|license|changelog|\.txt$|\.md$/.test(lower)) {
    score -= 15
    reason.push('Filename resembles benign document')
  }
  if (lower.endsWith('.exe') || lower.endsWith('.scr') || lower.endsWith('.bat')) {
    score += 12
    strings.push('executable_extension')
  }
  if (lower.endsWith('.dll') || lower.endsWith('.sys')) {
    score += 8
  }
  if (lower.endsWith('.zip') || lower.endsWith('.rar')) {
    score += 6
    reason.push('Archive may conceal payloads')
  }

  return { score, strings, reason }
}

function classifyFileScore(score: number): FileAnalysisDetail['classification'] {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'malicious'
  if (score >= 30) return 'suspicious'
  return 'safe'
}

function familyFromScore(score: number, ext: string): string {
  if (score >= 80) return 'RedLine'
  if (score >= 65) return 'AgentTesla'
  if (score >= 50) return 'AsyncRAT'
  if (ext === 'pdf') return 'PDF Document'
  if (score < 30) return 'Benign'
  return 'Unknown'
}

function buildBehaviors(found: string[]): Record<string, string[]> {
  const b: Record<string, string[]> = {
    persistence: [],
    defense_evasion: [],
    execution: [],
    lateral_movement: [],
    exfiltration: [],
    command_control: [],
    impact: [],
  }
  for (const s of found) {
    if (['RegSetValue', 'HKEY_LOCAL_MACHINE'].includes(s))
      b.persistence?.push('Registry modification for persistence')
    if (['IsDebuggerPresent', 'Sleep', 'OutputDebugString', 'UPX'].includes(s))
      b.defense_evasion?.push(`Evasion indicator: ${s}`)
    if (['cmd.exe', 'powershell', 'CreateRemoteThread', 'WriteProcessMemory'].includes(s))
      b.execution?.push(`Execution capability: ${s}`)
    if (['WinHTTP', 'URLDownloadToFile'].includes(s))
      b.command_control?.push(`Network/download: ${s}`)
    if (['CryptEncrypt'].includes(s)) b.impact?.push('Encryption API usage')
  }
  return Object.fromEntries(Object.entries(b).filter(([, v]) => v.length > 0))
}

export async function analyzeFile(file: File): Promise<FileAnalysisDetail> {
  const scanId = `scan_${crypto.randomUUID().slice(0, 8)}`
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
  const maxRead = Math.min(file.size, 512 * 1024)
  const buffer = await file.slice(0, maxRead).arrayBuffer()
  const bytes = new Uint8Array(buffer)

  const entropy = calculateEntropy(bytes)
  const ascii = extractAsciiStrings(bytes)
  const blob = ascii.join(' ')

  const foundStrings: string[] = []
  let stringsRisk = 0
  for (const { pattern, label, weight } of STRING_PATTERNS) {
    if (blob.includes(pattern)) {
      foundStrings.push(label)
      stringsRisk += weight
    }
  }
  stringsRisk = Math.min(100, stringsRisk)

  let entropyRisk = 0
  if (entropy > 7.2) entropyRisk = 35
  else if (entropy > 6) entropyRisk = 22
  else if (entropy < 2.5 && ext === 'exe') entropyRisk = 18
  else if (entropy >= 3 && entropy <= 6) entropyRisk = 5

  let sizeRisk = 0
  if (file.size < 1024) sizeRisk = 20
  else if (file.size > 50 * 1024 * 1024) sizeRisk = 12

  let typeRisk = 0
  if (['exe', 'scr', 'bat', 'cmd', 'msi'].includes(ext)) typeRisk = 18
  else if (['dll', 'sys'].includes(ext)) typeRisk = 12
  else if (['zip', 'rar', '7z'].includes(ext)) typeRisk = 10
  else if (['txt', 'md', 'json', 'csv'].includes(ext)) typeRisk = 0

  const nameBoost = filenameRiskBoost(file.name)

  const riskScore = Math.min(
    100,
    Math.round(
      entropyRisk * 0.2 +
        stringsRisk * 0.4 +
        typeRisk * 0.2 +
        sizeRisk * 0.2 +
        nameBoost.score * 0.35,
    ),
  )

  const classification = classifyFileScore(riskScore)
  const reasons = [...nameBoost.reason]
  if (foundStrings.length) reasons.push(`Suspicious API strings: ${foundStrings.join(', ')}`)
  if (entropy > 6.5) reasons.push(`High entropy (${entropy}) may indicate packing`)
  if (!reasons.length) reasons.push('No strong malicious indicators in static analysis')

  const behaviors = buildBehaviors(foundStrings)
  const malwareFamily = familyFromScore(riskScore, ext)

  const detail: FileAnalysisDetail = {
    scanId,
    fileName: file.name,
    fileSizeBytes: file.size,
    extension: ext,
    entropy,
    riskScore,
    classification,
    suspiciousStrings: foundStrings,
    isPacked: entropy > 7 || foundStrings.includes('UPX'),
    reason: reasons.join('. '),
    malwareFamily,
    behaviors,
    contactedUrls:
      riskScore > 50
        ? ['http://c2-malware.example/beacon', 'https://cdn-drop.example/stage2']
        : [],
    contactedIps: riskScore > 50 ? ['185.199.110.153'] : [],
    ...(riskScore > 75 ? { threatGroup: 'TA505' } : {}),
    explanation: '',
    uploadTime: new Date().toISOString(),
  }

  detail.explanation = buildFileExplanation(detail)
  saveFileAnalysis(detail)
  return detail
}

export function buildFileExplanation(d: FileAnalysisDetail): string {
  const parts: string[] = []
  if (d.riskScore > 80) parts.push(`This file poses a CRITICAL THREAT (risk score: ${d.riskScore}/100).`)
  else if (d.riskScore > 60) parts.push(`This file is MALICIOUS (risk score: ${d.riskScore}/100).`)
  else if (d.riskScore > 30) parts.push(`This file is SUSPICIOUS (risk score: ${d.riskScore}/100).`)
  else parts.push(`This file appears SAFE (risk score: ${d.riskScore}/100).`)

  if (d.suspiciousStrings.includes('WriteProcessMemory') || d.suspiciousStrings.includes('CreateRemoteThread'))
    parts.push('It may attempt PROCESS INJECTION.')
  if (d.suspiciousStrings.includes('URLDownloadToFile') || d.suspiciousStrings.includes('WinHTTP'))
    parts.push('It can DOWNLOAD additional payloads from the internet.')
  if (d.suspiciousStrings.includes('cmd.exe') || d.suspiciousStrings.includes('powershell'))
    parts.push('It can EXECUTE COMMANDS for remote control.')
  if (d.entropy > 7) parts.push('High entropy suggests PACKING or encryption.')

  if (d.riskScore > 60) parts.push('RECOMMENDATION: DO NOT EXECUTE. Delete and scan the system.')
  else if (d.riskScore > 30) parts.push('RECOMMENDATION: QUARANTINE for further review.')
  else parts.push('RECOMMENDATION: Appears low risk; verify source before running.')

  return parts.join(' ')
}

export function saveFileAnalysis(detail: FileAnalysisDetail) {
  const map = loadAllAnalysis()
  map[detail.scanId] = detail
  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(map))
}

export function getFileAnalysis(scanId: string): FileAnalysisDetail | null {
  return loadAllAnalysis()[scanId] ?? null
}

function loadAllAnalysis(): Record<string, FileAnalysisDetail> {
  try {
    const raw = localStorage.getItem(ANALYSIS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, FileAnalysisDetail>) : {}
  } catch {
    return {}
  }
}

export function detailToOverview(d: FileAnalysisDetail): import('../types').AnalysisOverview {
  return {
    id: d.scanId,
    fileName: d.fileName,
    fileSizeBytes: d.fileSizeBytes,
    fileType: d.extension === 'pdf' ? 'PDF Document' : `PE32+ / ${d.extension.toUpperCase()}`,
    uploadTime: d.uploadTime,
    md5: hashHex(32, d.scanId + 'md5'),
    sha1: hashHex(40, d.scanId + 'sha1'),
    sha256: hashHex(64, d.scanId + 'sha256'),
    riskScore: d.riskScore,
    confidence: Math.min(98, 55 + Math.round(d.riskScore * 0.4)),
    malwareFamily: d.malwareFamily,
    mediaKind: d.extension === 'pdf' ? 'pdf' : 'binary',
    classification: d.classification,
    reason: d.reason,
    entropy: d.entropy,
    suspiciousStrings: d.suspiciousStrings,
  }
}

export function scanStatusFromClassification(c: FileAnalysisDetail['classification']): import('../types').ScanStatus {
  if (c === 'safe') return 'Safe'
  if (c === 'suspicious') return 'Pending'
  return 'Critical'
}
