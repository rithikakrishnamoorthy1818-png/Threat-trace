import { analyzeFile } from './fileAnalysis'

function sleep(ms: number) {
  return new Promise((r) => window.setTimeout(r, ms))
}

export const fileService = {
  async uploadFile(
    file: File,
    onProgress: (pct: number, stage: 'uploading' | 'processing') => void,
  ) {
    for (let p = 0; p <= 100; p += 8) {
      onProgress(p, 'uploading')
      await sleep(80 + Math.random() * 60)
    }

        for (let p = 0; p <= 70; p += 14) {
      onProgress(p, 'processing')
      await sleep(100)
    }

    const analysisResult = await analyzeFile(file)

    for (let p = 70; p <= 100; p += 10) {
      onProgress(p, 'processing')
      await sleep(80)
    }

    return {
      scanId: analysisResult.scanId,
      fileName: file.name,
      riskScore: analysisResult.riskScore,
      classification: analysisResult.classification,
    }
  },
}

