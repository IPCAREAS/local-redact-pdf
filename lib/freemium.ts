const KEY = 'localredact_downloads'
const PRO_KEY = 'localredact_pro_license'
const WEEKLY_LIMIT = 1
export const FREE_MAX_PAGES = 2

/** Returnerer ISO-uke-nøkkel, f.eks. "2026-W47" */
function getWeekKey(): string {
  const d = new Date()
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${week}`
}

interface DownloadRecord {
  week: string
  count: number
}

export function getDownloadCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return 0
    const record: DownloadRecord = JSON.parse(raw)
    if (record.week !== getWeekKey()) return 0
    return record.count
  } catch {
    return 0
  }
}

export function incrementDownloadCount(): void {
  if (typeof window === 'undefined') return
  const count = getDownloadCount() + 1
  localStorage.setItem(KEY, JSON.stringify({ week: getWeekKey(), count }))
}

export function canDownload(): boolean {
  if (isPro()) return true
  return getDownloadCount() < WEEKLY_LIMIT
}

export function remainingDownloads(): number {
  if (isPro()) return Infinity
  return Math.max(0, WEEKLY_LIMIT - getDownloadCount())
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
