export const ACCEPTED_EXTENSIONS = [
  'exe',
  'dll',
  'bin',
  'elf',
  'apk',
  'zip',
  'rar',
  'pdf',
] as const

export const ACCEPTED_MIME_TYPES = [
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/octet-stream',
  'application/x-elf',
  'application/x-executable',
  'application/zip',
  'application/x-rar-compressed',
  'application/pdf',
  'application/x-pdf',
] as const

export function isValidHttpUrl(value: string) {
  try {
    const u = new URL(value.trim())
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function parseUrlsFromText(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const valid: string[] = []
  const invalid: string[] = []
  for (const line of lines) {
    if (isValidHttpUrl(line)) valid.push(line)
    else invalid.push(line)
  }
  return { valid, invalid }
}

export function isAcceptedFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  return (ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)
}

export function maxSizeOk(file: File, maxBytes = 100 * 1024 * 1024) {
  return file.size <= maxBytes
}

