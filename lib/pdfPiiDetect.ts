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

          // viewport.convertToViewportRectangle tar uspesifiserte PDF-koordinater
          // (Y oppover) og returnerer canvas-koordinater (Y nedover, skalert).
          const PAD = 4
          const h = Math.max(start.height, end.height)
          const pdfRect = [
            start.x,              // venstre
            start.y - h,          // bunn i PDF-koordinater
            end.x + end.charWidth,// høyre
            start.y + 2,          // topp i PDF-koordinater (litt over baseline)
          ]
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const [vx1, vy1, vx2, vy2] = (viewport as any).convertToViewportRectangle(pdfRect) as number[]
          const bx = Math.min(vx1, vx2) - PAD
          const by = Math.min(vy1, vy2) - PAD
          const bw = Math.abs(vx2 - vx1) + PAD * 2
          const bh = Math.abs(vy2 - vy1) + PAD * 2

          if (bw > 4 && bh > 4) {
            boxes.push({ x: Math.max(bx, 0), y: Math.max(by, 0), width: bw, height: bh, page: pageNum })
          }
        }
      }
    }
  }

  return boxes
}
