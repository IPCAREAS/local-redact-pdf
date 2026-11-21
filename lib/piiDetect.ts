// Norske PII-mønstre — utvidet
export const PII_PATTERNS = {
  // E-postadresser
  epost: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,

  // Norske telefonnumre: +47/0047 + 8 siffer, eller 8-sifret mobilnummer
  telefon:
    /(?:\+47|0047)[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}|\b(?:4|9)\d{7}\b|\b[2358]\d{7}\b/g,

  // Norsk fødselsnummer: 11 siffer (DDMMYY + 5), med/uten mellomrom
  fodselsnummer: /\b\d{6}[ ]?\d{5}\b/g,

  // Norsk kontonummer: XXXX.XX.XXXXX eller XXXX XX XXXXX
  kontonummer: /\b\d{4}[.\s]\d{2}[.\s]\d{5}\b/g,

  // Organisasjonsnummer: 9 siffer / NO ... MVA
  orgnummer: /\b(?:NO\s*)?\d{3}[\s]?\d{3}[\s]?\d{3}(?:\s*MVA)?\b/g,

  // Kortnumre: 13-19 siffer (VISA, MC, Amex) — med eller uten mellomrom/bindestrek
  kortnummer: /\b(?:\d{4}[\s-]){3}\d{4}\b|\b\d{13,16}\b/g,

  // Datoer: DD.MM.YYYY, DD/MM/YYYY, DD-MM-YYYY
  dato: /\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/g,

  // Beløp i kr/NOK
  belop: /\b\d{1,3}(?:[\s.]\d{3})*(?:,\d{1,2})?\s*(?:kr\.?|NOK|,-)|\bNOK\s+\d[\d\s.]*/gi,
}

// --- Hjelpefunksjoner for linje-merging (PDF-tekstlag) ---

export interface CharPos {
  x: number
  y: number
  charWidth: number
  height: number
}

export interface LineItem {
  str: string
  transform: number[]
  width: number
  height?: number
}

/** Grupper tekstelementer etter Y-koordinat (± 3 enheter = samme linje) */
export function groupItemsByLine(items: LineItem[]): LineItem[][] {
  const lines: LineItem[][] = []
  for (const item of items) {
    const y = item.transform[5]
    const existing = lines.find((l) => Math.abs(l[0].transform[5] - y) < 3)
    if (existing) {
      existing.push(item)
    } else {
      lines.push([item])
    }
  }
  // Sorter hvert linje-array etter X-posisjon (venstre til høyre)
  for (const line of lines) {
    line.sort((a, b) => a.transform[4] - b.transform[4])
  }
  return lines
}

/** Slå sammen linjeelementer til én streng med per-tegn posisjonsinfo */
export function mergeLineItems(items: LineItem[]): {
  merged: string
  charPositions: CharPos[]
} {
  let merged = ''
  const charPositions: CharPos[] = []

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx]
    const x0 = item.transform[4]
    const y = item.transform[5]
    const totalWidth = item.width || 0
    const charCount = Math.max(item.str.length, 1)
    const charWidth = totalWidth / charCount
    const height = Math.abs(item.transform[3]) || item.height || 12

    for (let i = 0; i < item.str.length; i++) {
      charPositions.push({ x: x0 + i * charWidth, y, charWidth, height })
      merged += item.str[i]
    }

    // Mellomrom mellom elementer
    if (idx < items.length - 1) {
      const nextX = items[idx + 1].transform[4]
      const spaceW = Math.max(nextX - (x0 + totalWidth), 2)
      charPositions.push({ x: x0 + totalWidth, y, charWidth: spaceW, height })
      merged += ' '
    }
  }

  return { merged, charPositions }
}
