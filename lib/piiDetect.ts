export interface PiiMatch {
  text: string
  type: 'email' | 'phone' | 'number'
  page: number
  bounds: { x: number; y: number; width: number; height: number }
}

export const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g,
  number: /\b\d{8,19}\b/g,
}

export function findPiiInText(text: string): { type: 'email' | 'phone' | 'number'; match: string; index: number }[] {
  const results: { type: 'email' | 'phone' | 'number'; match: string; index: number }[] = []

  for (const [type, pattern] of Object.entries(PII_PATTERNS) as [keyof typeof PII_PATTERNS, RegExp][]) {
    const regex = new RegExp(pattern.source, 'g')
    let m: RegExpExecArray | null
    while ((m = regex.exec(text)) !== null) {
      results.push({ type, match: m[0], index: m.index })
    }
  }

  return results
}
