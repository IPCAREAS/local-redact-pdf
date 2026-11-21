import { PII_PATTERNS } from './piiDetect'

export interface OcrPiiBox {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Kjør Tesseract OCR lokalt i nettleseren og finn PII i bildet.
 * Returnerer bounding-boxes for alle treff (norsk + engelsk).
 */
export async function detectPiiInImage(canvas: HTMLCanvasElement): Promise<OcrPiiBox[]> {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker(['nor', 'eng'])

  let data: Awaited<ReturnType<typeof worker.recognize>>['data']
  try {
    ;({ data } = await worker.recognize(canvas))
  } finally {
    await worker.terminate()
  }

  const boxes: OcrPiiBox[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lines = ((data as any).lines ?? []) as Array<{
    words: Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }>
  }>

  for (const line of lines) {
    if (!line.words.length) continue

    // Bygg sammenslått streng med per-tegn bounding-box
    let merged = ''
    const charBoxes: { x0: number; y0: number; x1: number; y1: number }[] = []

    for (let wi = 0; wi < line.words.length; wi++) {
      const word = line.words[wi]
      const charW = (word.bbox.x1 - word.bbox.x0) / Math.max(word.text.length, 1)

      for (let ci = 0; ci < word.text.length; ci++) {
        charBoxes.push({
          x0: word.bbox.x0 + ci * charW,
          y0: word.bbox.y0,
          x1: word.bbox.x0 + (ci + 1) * charW,
          y1: word.bbox.y1,
        })
        merged += word.text[ci]
      }

      // Mellomrom mellom ord
      if (wi < line.words.length - 1) {
        charBoxes.push({
          x0: word.bbox.x1,
          y0: word.bbox.y0,
          x1: word.bbox.x1 + 4,
          y1: word.bbox.y1,
        })
        merged += ' '
      }
    }

    for (const pattern of Object.values(PII_PATTERNS)) {
      const regex = new RegExp(pattern.source, 'gi')
      let m: RegExpExecArray | null
      while ((m = regex.exec(merged)) !== null) {
        const start = charBoxes[m.index]
        const end = charBoxes[Math.min(m.index + m[0].length - 1, charBoxes.length - 1)]
        if (!start || !end) continue
        boxes.push({
          x: Math.max(start.x0 - 2, 0),
          y: Math.max(start.y0 - 2, 0),
          width: end.x1 - start.x0 + 4,
          height: end.y1 - start.y0 + 4,
        })
      }
    }
  }

  return boxes
}
