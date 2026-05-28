import type { FileAnalysisDetail } from '../types'
import type { URLScanResult } from '../types'
import { buildFileExplanation } from './fileAnalysis'

export function explainFile(detail: FileAnalysisDetail): string {
  return detail.explanation || buildFileExplanation(detail)
}

export function explainUrl(result: URLScanResult): string {
  const parts: string[] = []
  const { riskScore, classification } = result

  if (classification === 'safe')
    parts.push(`This URL is SAFE (risk score: ${riskScore}/100). No threats detected.`)
  else if (classification === 'phishing')
    parts.push(`This URL is a PHISHING ATTACK (risk score: ${riskScore}/100).`)
  else if (classification === 'malicious')
    parts.push(`This URL hosts MALWARE (risk score: ${riskScore}/100).`)
  else parts.push(`This URL is SUSPICIOUS (risk score: ${riskScore}/100).`)

  if (result.reason) parts.push(result.reason)

  const age = result.domainAgeDays
  if (age !== undefined && age < 7)
    parts.push(`Domain registered only ${age} days ago — common in phishing campaigns.`)

  if (!result.sslValid)
    parts.push('No valid HTTPS certificate — unsafe for sensitive data.')

  for (const ind of result.phishingIndicators ?? []) {
    if (ind === 'urgency_language') parts.push('Urgent language detected on page.')
    if (ind === 'lookalike_domain') parts.push('Domain mimics a legitimate brand.')
    if (ind === 'suspicious_tld') parts.push('Suspicious top-level domain.')
    if (ind === 'credential_form') parts.push('Login form may harvest credentials.')
  }

  if (riskScore > 75) parts.push('RECOMMENDATION: DO NOT VISIT. Report if appropriate.')
  else if (riskScore > 50) parts.push('RECOMMENDATION: Avoid entering personal information.')
  else parts.push('RECOMMENDATION: Normal browsing caution applies.')

  return parts.join(' ')
}

export function explainPdf(text: string, riskScore: number): string {
  const parts: string[] = []
  const lower = text.toLowerCase()
  const indicators: string[] = []

  const urgent = ['verify', 'urgent', 'act now', 'update payment', 'confirm identity']
  const foundUrgent = urgent.filter((k) => lower.includes(k))
  if (foundUrgent.length) {
    indicators.push('urgency')
    parts.push(`URGENCY language: ${foundUrgent.join(', ')}.`)
  }

  const cred = ['password', 'credit card', 'social security', 'bank account']
  const foundCred = cred.filter((k) => lower.includes(k))
  if (foundCred.length) {
    indicators.push('credentials')
    parts.push(`Credential harvesting language: ${foundCred.join(', ')}.`)
  }

  if (indicators.length >= 2)
    parts.push('ASSESSMENT: Multiple phishing tactics — exercise extreme caution.')
  else if (indicators.length === 1)
    parts.push('ASSESSMENT: Potential phishing characteristics detected.')
  else if (riskScore < 30) parts.push('ASSESSMENT: No obvious phishing indicators in text.')
  else parts.push('ASSESSMENT: Review metadata and links before trusting this PDF.')

  return parts.join(' ')
}
