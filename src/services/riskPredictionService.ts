import type { FileAnalysisDetail, RiskPredictionResult } from '../types'
import type { URLScanResult } from '../types'

export function predictFileRisk(detail: FileAnalysisDetail): RiskPredictionResult {
  const strings = detail.suspiciousStrings
  const malware = Math.min(1, detail.riskScore / 100)
  let ransomware = 0
  if (strings.includes('CryptEncrypt')) ransomware += 0.45
  if (detail.behaviors.impact?.length) ransomware += 0.2
  if (detail.isPacked) ransomware += 0.15
  ransomware = Math.min(1, ransomware)

  return {
    malwareProbability: malware,
    ransomwareProbability: ransomware,
    phishingProbability: 0,
    overallRisk: Math.max(malware, ransomware),
    threatTypes: [
      {
        type: 'Malware',
        probability: malware,
        explanation:
          detail.riskScore > 70
            ? 'High entropy, suspicious APIs, and dangerous behavior patterns'
            : 'Some suspicious static indicators present',
      },
      {
        type: 'Ransomware',
        probability: ransomware,
        explanation:
          strings.includes('CryptEncrypt')
            ? 'Encryption APIs detected'
            : 'No strong ransomware indicators',
      },
      {
        type: 'Phishing',
        probability: 0,
        explanation: 'N/A for file scans',
      },
    ],
  }
}

export function predictUrlRisk(result: URLScanResult): RiskPredictionResult {
  let phishing = result.phishingScore / 100
  let malware = result.malwareScore / 100
  if (result.classification === 'phishing') phishing = Math.max(phishing, 0.7)
  if (result.classification === 'malicious') malware = Math.max(malware, 0.85)

  return {
    malwareProbability: malware,
    ransomwareProbability: 0,
    phishingProbability: phishing,
    overallRisk: Math.max(malware, phishing),
    threatTypes: [
      {
        type: 'Malware',
        probability: malware,
        explanation: result.reason ?? 'URL reputation and content signals',
      },
      {
        type: 'Ransomware',
        probability: 0,
        explanation: 'N/A for URL scans',
      },
      {
        type: 'Phishing',
        probability: phishing,
        explanation:
          result.phishingIndicators?.length
            ? `Phishing indicators: ${result.phishingIndicators.join(', ')}`
            : 'Low phishing signal strength',
      },
    ],
  }
}


