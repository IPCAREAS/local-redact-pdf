import { PDFDocument } from 'pdf-lib'

export interface RedactionBox {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'redact' | 'blur'
  page: number
}

export async function exportRedactedPdf(
  canvases: HTMLCanvasElement[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()

  for (const canvas of canvases) {
    const imgData = canvas.toDataURL('image/png')
    const imgBytes = await fetch(imgData).then(r => r.arrayBuffer())
    const img = await pdfDoc.embedPng(imgBytes)
    const page = pdfDoc.addPage([canvas.width, canvas.height])
    page.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height })
  }

  return pdfDoc.save()
}

export async function exportRedactedImage(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0)
  })
}
