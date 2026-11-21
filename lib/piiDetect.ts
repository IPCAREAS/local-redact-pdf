export interface PiiMatch {
  text: string
  type: 'epost' | 'telefon' | 'fodselsnummer' | 'kontonummer' | 'belop'
  page: number
  bounds: { x: number; y: number; width: number; height: number }
}

// Norske PII-mønstre
export const PII_PATTERNS = {
  // E-postadresser
  epost: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,

  // Norske telefonnumre: +47 etter fulgt av 8 siffer, eller 8-sifret nummer (mobil starter med 4/9, fasttelefon med 2/3/5/6/7/8)
  telefon: /(?:\+47[\s-]?)\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}|\b[49]\d{7}\b|\b[2358]\d{7}\b/g,

  // Norsk fødselsnummer: 11 siffer (DDMMYY + 5 kontrollsiffer), evt. med mellomrom etter 6
  fodselsnummer: /\b\d{6}[ ]?\d{5}\b/g,

  // Norsk kontonummer: XXXX.XX.XXXXX (punktformat) eller 11 siffer på rad
  kontonummer: /\b\d{4}\.\d{2}\.\d{5}\b|\b\d{11}\b/g,

  // Beløp i kr/NOK: "1 234,56 kr", "kr 1 234", "NOK 12 000", "1234,-"
  belop: /\b\d{1,3}(?:[\s.]\d{3})*(?:,\d{1,2})?\s*(?:kr\.?|NOK|,-)|\bNOK\s+\d[\d\s.]*/gi,
}

export function findPiiInText(
  text: string
): { type: keyof typeof PII_PATTERNS; match: string; index: number }[] {
  const results: { type: keyof typeof PII_PATTERNS; match: string; index: number }[] = []

  for (const [type, pattern] of Object.entries(PII_PATTERNS) as [
    keyof typeof PII_PATTERNS,
    RegExp,
  ][]) {
    const regex = new RegExp(pattern.source, 'gi')
    let m: RegExpExecArray | null
    while ((m = regex.exec(text)) !== null) {
      results.push({ type, match: m[0], index: m.index })
    }
  }

  return results
}
