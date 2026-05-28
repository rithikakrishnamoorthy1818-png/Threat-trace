export type ScanStatus = 'Critical' | 'Safe' | 'Pending'

export type ScanRecord = {
  id: string
  fileName: string
  scanDate: string
  riskScore: number
  malwareFamily: string
  status: ScanStatus
}

export type TimelinePoint = { day: string; threats: number }

export type MalwareFamilyStat = { family: string; count: number }

export type AnalysisOverview = {
  id: string
  fileName: string
  fileSizeBytes: number
  fileType: string
  uploadTime: string
  md5: string
  sha1: string
  sha256: string
  riskScore: number
  confidence: number
  malwareFamily: string
  mediaKind?: 'binary' | 'pdf'
  classification?: 'safe' | 'suspicious' | 'malicious' | 'critical'
  reason?: string
  entropy?: number
  suspiciousStrings?: string[]
}

export type FileAnalysisDetail = {
  scanId: string
  fileName: string
  fileSizeBytes: number
  extension: string
  entropy: number
  riskScore: number
  classification: 'safe' | 'suspicious' | 'malicious' | 'critical'
  suspiciousStrings: string[]
  isPacked: boolean
  reason: string
  malwareFamily: string
  behaviors: Record<string, string[]>
  contactedUrls: string[]
  contactedIps: string[]
  threatGroup?: string
  explanation: string
  uploadTime: string
}

export type RiskPredictionResult = {
  malwareProbability: number
  ransomwareProbability: number
  phishingProbability: number
  overallRisk: number
  threatTypes: { type: string; probability: number; explanation: string }[]
}

export type ThreatGraphNode = {
  id: string
  label: string
  type: 'malware' | 'url' | 'ip' | 'behavior' | 'threat_group' | 'hash'
  color: string
}

export type ThreatGraphEdge = {
  id: string
  source: string
  target: string
  label: string
  animated?: boolean
}

export type NotificationCenterItem = {
  id: string
  title: string
  message: string
  tone: 'success' | 'warning' | 'error' | 'info'
  createdAt: string
  read: boolean
  href?: string
}

export type URLClassification = 'safe' | 'suspicious' | 'malicious' | 'phishing'

export type URLScan = {
  id: string
  url: string
  scannedAt: string
  riskScore: number
  classification: URLClassification
}

export type URLScanResult = {
  id: string
  url: string
  scannedAt: string
  riskScore: number
  classification: URLClassification
  confidence: number
  phishingScore: number
  malwareScore: number
  domainAgeDays?: number
  sslValid: boolean
  isWhitelisted?: boolean
  reason?: string
  phishingIndicators?: string[]
  virustotal?: {
    detections: number
    vendors: number
    lastAnalysis?: string
    threatType?: string
  }
  urlhaus?: {
    status: string
  }
  ssl?: {
    isValid: boolean
    issuer: string
    expiryDate: string
    protocol: string
    selfSigned: boolean
  }
  network?: {
    ipAddress: string
    country: string
    city: string
    asn: string
    organization: string
    domainRegistered?: string
    daysUntilExpiry?: number
    registrar?: string
  }
  content?: {
    hasScripts: boolean
    hasForms: boolean
    embeddedUrlsCount: number
    detectedTechnologies: string[]
  }
}

export type PDFAnalysisData = {
  basicInfo: {
    pages: number
    author?: string
    creator?: string
    createdDate: string
    modifiedDate: string
    encrypted: boolean
    encryptionType?: string
    fileSize: number
    isSuspicious: boolean
    riskScore: number
  }
  content: {
    extractedText: string
    imagesCount: number
    embeddedFiles: string[]
  }
  metadata: {
    title?: string
    subject?: string
    keywords?: string[]
    producer?: string
    anomalies: string[]
  }
  security: {
    hasJavaScript: boolean
    hasEmbeddedExecutables: boolean
    hasSuspiciousLinks: boolean
    suspiciousLinkCount: number
    hasForms: boolean
    encryptionType?: string
  }
  threats: {
    maliciousLinks: string[]
    suspiciousPatterns: string[]
    embeddedFilesRisk: { name: string; risk: 'LOW' | 'MEDIUM' | 'HIGH' }[]
    riskScore: number
  }
}

