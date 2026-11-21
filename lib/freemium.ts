const KEY = 'localredact_downloads'
const PRO_KEY = 'localredact_pro_license'
const DAILY_LIMIT = 2

interface DownloadRecord {
  date: string
  count: number
}

export function getDownloadCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return 0
    const record: DownloadRecord = JSON.parse(raw)
    const today = new Date().toISOString().split('T')[0]
    if (record.date !== today) return 0
    return record.count
  } catch {
    return 0
  }
}

export function incrementDownloadCount(): void {
  if (typeof window === 'undefined') return
  const today = new Date().toISOString().split('T')[0]
  const count = getDownloadCount() + 1
  localStorage.setItem(KEY, JSON.stringify({ date: today, count }))
}

export function canDownload(): boolean {
  if (isPro()) return true
  return getDownloadCount() < DAILY_LIMIT
}

export function remainingDownloads(): number {
  if (isPro()) return Infinity
  return Math.max(0, DAILY_LIMIT - getDownloadCount())
}

export function isPro(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem(PRO_KEY)
}

export function activatePro(licenseKey: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PRO_KEY, licenseKey)
}

export function deactivatePro(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PRO_KEY)
}
