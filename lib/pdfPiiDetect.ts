import { PII_PATTERNS, groupItemsByLine, mergeLineItems, type LineItem } from './piiDetect'

export interface PdfPiiBox {
  x: number
  y: number
  width: number
  height: number
  page: number
}

/** Sjekk om PDF-side 1 har et meningsfullt tekstlag */
export async function hasPdfTextLayer(url: string): Promise<boolean> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdf = await pdfjsLib.getDocument({ url } as any).promise
  const page = await pdf.getPage(1)
  const tc = await page.getTextContent()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const count = (tc.items as any[]).filter(
    (i) => 'str' in i && i.str?.trim().length > 0
  ).length
  return count > 5
}

/**
 * Finn PII i PDF-ens tekstlag.
 * Slår sammen tekstelementer per linje og beregner presise bounding-boxes.
 */
export async function detectPiiInPdf(
  url: string,
  renderScale = 2
): Promise<PdfPiiBox[]> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdf = await pdfjsLib.getDocument({ url } as any).promise
  const boxes: PdfPiiBox[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: renderScale })
    const baseVP = page.getViewport({ scale: 1 })
    const scaleRatio = viewport.width / baseVP.width

    const tc = await page.getTextContent()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: LineItem[] = (tc.items as any[])
      .filter((i) => 'str' in i && i.str?.trim().length > 0)
      .map((i) => ({ str: i.str as string, transform: i.transform as number[], width: (i.width as number) || 0, height: i.height as number | undefined }))

    const lines = groupItemsByLine(items)

    for (const line of lines) {
      const { merged, charPositions } = mergeLineItems(line)
      if (!merged.trim()) continue

      for (const pattern of Object.values(PII_PATTERNS)) {
        const regex = new RegExp(pattern.source, 'gi')
        let m: RegExpExecArray | null
        while ((m = regex.exec(merged)) !== null) {
          const start = charPositions[m.index]
          const end =
            charPositions[Math.min(m.index + m[0].length - 1, charPositions.length - 1)]
          if (!start || !end) continue

          const x = start.x * scaleRatio - 2
          const y =
            viewport.height -
            start.y * scaleRatio -
            Math.max(start.height, end.height) * scaleRatio * 1.1
          const w = (end.x + end.charWidth - start.x) * scaleRatio + 4
          const h = Math.max(start.height, end.height) * scaleRatio * 1.5

          if (w > 4 && h > 4) {
            boxes.push({ x: Math.max(x, 0), y: Math.max(y, 0), width: w, height: h, page: pageNum })
          }
        }
      }
    }
  }

  return boxes
}
