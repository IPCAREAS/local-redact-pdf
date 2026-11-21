'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { LoadedFile } from './RedactApp'
import UpgradeModal from './UpgradeModal'
import { canDownload, incrementDownloadCount, remainingDownloads, isPro } from '@/lib/freemium'
import { exportRedactedPdf, exportRedactedImage, type RedactionBox } from '@/lib/exportPdf'

type Tool = 'redact' | 'blur' | 'select'

interface Props {
  loadedFile: LoadedFile
  onReset: () => void
}

let boxIdCounter = 0

export default function PdfEditor({ loadedFile, onReset }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [tool, setTool] = useState<Tool>('redact')
  const [zoom, setZoom] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [boxes, setBoxes] = useState<RedactionBox[]>([])
  const [selectedBox, setSelectedBox] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState({ x: 0, y: 0 })
  const [drawCurrent, setDrawCurrent] = useState({ x: 0, y: 0 })
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [pdfPages, setPdfPages] = useState<ImageData[]>([])
  const [pageWidth, setPageWidth] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [proActive, setProActive] = useState(isPro())

  // Lytt etter global Pro-aktivering (URL-redirect eller modal)
  useEffect(() => {
    const onProActivated = () => setProActive(true)
    window.addEventListener('sladd:pro-activated', onProActivated)
    return () => window.removeEventListener('sladd:pro-activated', onProActivated)
  }, [])

  useEffect(() => {
    if (loadedFile.type === 'pdf') {
      loadPdf()
    } else {
      loadImage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedFile])

  const loadPdf = async () => {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

    const pdf = await pdfjsLib.getDocument({ url: loadedFile.url } as Parameters<typeof pdfjsLib.getDocument>[0]).promise
    setTotalPages(pdf.numPages)

    const pages: ImageData[] = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 2 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const ctx = canvas.getContext('2d')!
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise
      pages.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
      if (i === 1) {
        setPageWidth(viewport.width)
        setPageHeight(viewport.height)
      }
    }
    setPdfPages(pages)
  }

  const loadImage = () => {
    const img = new Image()
    img.onload = () => {
      setPageWidth(img.width)
      setPageHeight(img.height)
      setTotalPages(1)
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      setPdfPages([ctx.getImageData(0, 0, img.width, img.height)])
    }
    img.src = loadedFile.url
  }

  useEffect(() => {
    if (!canvasRef.current || pdfPages.length === 0) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const pageData = pdfPages[currentPage - 1]
    if (!pageData) return

    canvas.width = pageData.width
    canvas.height = pageData.height
    ctx.putImageData(pageData, 0, 0)

    const pageBoxes = boxes.filter((b) => b.page === currentPage)
    for (const box of pageBoxes) {
      if (box.type === 'redact') {
        ctx.fillStyle = '#000000'
        ctx.fillRect(box.x, box.y, box.width, box.height)
      } else {
        applyBlur(ctx, box)
      }
      if (box.id === selectedBox) {
        ctx.strokeStyle = '#6366f1'
        ctx.lineWidth = 3
        ctx.setLineDash([6, 3])
        ctx.strokeRect(box.x, box.y, box.width, box.height)
        ctx.setLineDash([])
      }
    }
  }, [pdfPages, currentPage, boxes, selectedBox])

  useEffect(() => {
    const overlay = overlayRef.current
    const canvas = canvasRef.current
    if (!overlay || !canvas) return
    overlay.width = canvas.width
    overlay.height = canvas.height

    if (!isDrawing) return
    const ctx = overlay.getContext('2d')!
    ctx.clearRect(0, 0, overlay.width, overlay.height)
    const x = Math.min(drawStart.x, drawCurrent.x)
    const y = Math.min(drawStart.y, drawCurrent.y)
    const w = Math.abs(drawCurrent.x - drawStart.x)
    const h = Math.abs(drawCurrent.y - drawStart.y)
    ctx.fillStyle = tool === 'redact' ? 'rgba(0,0,0,0.6)' : 'rgba(100,116,139,0.4)'
    ctx.fillRect(x, y, w, h)
    ctx.strokeStyle = tool === 'redact' ? '#000' : '#64748b'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, w, h)
  }, [isDrawing, drawStart, drawCurrent, tool])

  function applyBlur(ctx: CanvasRenderingContext2D, box: RedactionBox) {
    const pixelSize = 12
    const { x, y, width: w, height: h } = box
    for (let py = y; py < y + h; py += pixelSize) {
      for (let px = x; px < x + w; px += pixelSize) {
        const data = ctx.getImageData(px, py, 1, 1).data
        ctx.fillStyle = `rgba(${data[0]},${data[1]},${data[2]},${data[3] / 255})`
        ctx.fillRect(px, py, Math.min(pixelSize, x + w - px), Math.min(pixelSize, y + h - py))
      }
    }
  }

  function getCanvasCoords(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX ?? (e as React.TouchEvent).changedTouches[0]?.clientX ?? 0
      clientY = e.touches[0]?.clientY ?? (e as React.TouchEvent).changedTouches[0]?.clientY ?? 0
    } else {
      clientX = (e as React.MouseEvent).clientX
      clientY = (e as React.MouseEvent).clientY
    }
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY }
  }

  function handlePointerDown(e: React.MouseEvent | React.TouchEvent) {
    const coords = getCanvasCoords(e)
    if (tool === 'select') {
      const clicked = boxes.find(
        (b) =>
          b.page === currentPage &&
          coords.x >= b.x &&
          coords.x <= b.x + b.width &&
          coords.y >= b.y &&
          coords.y <= b.y + b.height
      )
      setSelectedBox(clicked?.id ?? null)
      return
    }
    setIsDrawing(true)
    setDrawStart(coords)
    setDrawCurrent(coords)
  }

  function handlePointerMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return
    setDrawCurrent(getCanvasCoords(e))
  }

  function handlePointerUp() {
    if (!isDrawing) return
    setIsDrawing(false)

    const x = Math.min(drawStart.x, drawCurrent.x)
    const y = Math.min(drawStart.y, drawCurrent.y)
    const w = Math.abs(drawCurrent.x - drawStart.x)
    const h = Math.abs(drawCurrent.y - drawStart.y)
    if (w < 5 || h < 5) return

    setBoxes((prev) => [
      ...prev,
      {
        id: `box-${++boxIdCounter}`,
        x, y, width: w, height: h,
        type: tool as 'redact' | 'blur',
        page: currentPage,
      },
    ])

    const overlay = overlayRef.current
    if (overlay) {
      overlay.getContext('2d')!.clearRect(0, 0, overlay.width, overlay.height)
    }
  }

  const handleUndo = useCallback(() => {
    setBoxes((prev) => {
      const pageBoxes = prev.filter((b) => b.page === currentPage)
      if (pageBoxes.length === 0) return prev
      const lastId = pageBoxes[pageBoxes.length - 1].id
      return prev.filter((b) => b.id !== lastId)
    })
    setSelectedBox(null)
  }, [currentPage])

  const handleDeleteSelected = useCallback(() => {
    if (!selectedBox) return
    setBoxes((prev) => prev.filter((b) => b.id !== selectedBox))
    setSelectedBox(null)
  }, [selectedBox])

  const handleAutoDetect = useCallback(async () => {
    if (!proActive) { setShowUpgrade(true); return }

    setIsExporting(true)
    try {
      if (loadedFile.type === 'image') {
        // OCR på bilde via Tesseract
        const pageData = pdfPages[0]
        if (!pageData) return
        const c = document.createElement('canvas')
        c.width = pageData.width
        c.height = pageData.height
        c.getContext('2d')!.putImageData(pageData, 0, 0)
        const { detectPiiInImage } = await import('@/lib/imagePiiDetect')
        const found = await detectPiiInImage(c)
        if (found.length === 0) {
          alert('Ingen persondata funnet i bildet (OCR).')
          return
        }
        setBoxes(prev => [...prev, ...found.map(b => ({
          ...b, id: `pii-${++boxIdCounter}`, type: 'redact' as const, page: 1,
        }))])
        alert(`OCR fant og markerte ${found.length} mulig persondata-felt.`)
        return
      }

      // PDF — prøv tekstlag først, fall back til OCR
      const { detectPiiInPdf, hasPdfTextLayer } = await import('@/lib/pdfPiiDetect')
      const hasText = await hasPdfTextLayer(loadedFile.url)

      if (hasText) {
        const found = await detectPiiInPdf(loadedFile.url, 2)
        if (found.length === 0) {
          alert('Ingen persondata funnet i dokumentet.')
          return
        }
        setBoxes(prev => [...prev, ...found.map(b => ({
          ...b, id: `pii-${++boxIdCounter}`, type: 'redact' as const,
        }))])
        alert(`Fant og markerte ${found.length} mulig persondata-felt.`)
      } else {
        // Ingen tekstlag — kjør OCR side for side
        const { detectPiiInImage } = await import('@/lib/imagePiiDetect')
        const newBoxes: RedactionBox[] = []
        for (let p = 0; p < pdfPages.length; p++) {
          const pageData = pdfPages[p]
          const c = document.createElement('canvas')
          c.width = pageData.width
          c.height = pageData.height
          c.getContext('2d')!.putImageData(pageData, 0, 0)
          const found = await detectPiiInImage(c)
          newBoxes.push(...found.map(b => ({
            ...b, id: `pii-${++boxIdCounter}`, type: 'redact' as const, page: p + 1,
          })))
        }
        if (newBoxes.length === 0) {
          alert('Ingen persondata funnet (OCR — PDF uten tekstlag).')
          return
        }
        setBoxes(prev => [...prev, ...newBoxes])
        alert(`OCR fant og markerte ${newBoxes.length} mulig persondata-felt.`)
      }
    } finally {
      setIsExporting(false)
    }
  }, [loadedFile, proActive, pdfPages])

  const handleSearchRedact = useCallback(async () => {
    if (!proActive) { setShowUpgrade(true); return }
    if (!searchQuery.trim()) return
    if (loadedFile.type !== 'pdf') {
      alert('Søk og sladd er kun tilgjengelig for PDF-filer.')
      return
    }

    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
    const pdf = await pdfjsLib.getDocument({ url: loadedFile.url } as Parameters<typeof pdfjsLib.getDocument>[0]).promise

    const newBoxes: RedactionBox[] = []
    const query = searchQuery.toLowerCase()

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 2 })
      const baseViewport = page.getViewport({ scale: 1 })
      const scaleRatio = viewport.width / baseViewport.width
      const textContent = await page.getTextContent()

      for (const item of textContent.items) {
        if (!('str' in item)) continue
        const str = (item as { str: string }).str
        if (!str.toLowerCase().includes(query)) continue
        const transform = (item as { transform: number[] }).transform

        newBoxes.push({
          id: `search-${++boxIdCounter}`,
          x: transform[4] * scaleRatio,
          y: viewport.height - transform[5] - 20,
          width: Math.max(query.length * 8 * scaleRatio, 60),
          height: 36,
          type: 'redact',
          page: pageNum,
        })
      }
    }

    if (newBoxes.length === 0) {
      alert(`«${searchQuery}» ble ikke funnet i dokumentet.`)
    } else {
      setBoxes((prev) => [...prev, ...newBoxes])
      alert(`Fant og markerte ${newBoxes.length} forekomst(er).`)
    }
  }, [loadedFile, searchQuery, proActive])

  const handleExport = useCallback(async () => {
    if (!canDownload()) { setShowUpgrade(true); return }

    setIsExporting(true)
    try {
      if (loadedFile.type === 'image') {
        const blob = await exportRedactedImage(canvasRef.current!)
        downloadBlob(blob, 'sladdet.png')
      } else {
        const canvases: HTMLCanvasElement[] = []
        for (let p = 1; p <= totalPages; p++) {
          const c = document.createElement('canvas')
          const pageData = pdfPages[p - 1]
          c.width = pageData.width
          c.height = pageData.height
          const ctx = c.getContext('2d')!
          ctx.putImageData(pageData, 0, 0)
          for (const box of boxes.filter((b) => b.page === p)) {
            if (box.type === 'redact') {
              ctx.fillStyle = '#000000'
              ctx.fillRect(box.x, box.y, box.width, box.height)
            } else {
              applyBlur(ctx, box)
            }
          }
          canvases.push(c)
        }
        const bytes = await exportRedactedPdf(canvases)
        downloadBlob(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }), 'sladdet.pdf')
      }
      incrementDownloadCount()
    } finally {
      setIsExporting(false)
    }
  }, [loadedFile, totalPages, pdfPages, boxes])

  function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  void pageWidth
  void pageHeight

  const remaining = remainingDownloads()
  const pageBoxCount = boxes.filter((b) => b.page === currentPage).length

  return (
    <>
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} onActivated={() => setProActive(true)} />
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Verktøylinje */}
        <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[180px]">
              {loadedFile.file.name}
            </span>
            <button
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded"
            >
              ✕ Lukk
            </button>
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          {(['redact', 'blur', 'select'] as Tool[]).map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                tool === t
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {t === 'redact' ? '⬛ Sladd' : t === 'blur' ? '🔲 Sløre' : '↖ Velg'}
            </button>
          ))}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          <button
            onClick={handleUndo}
            disabled={pageBoxCount === 0}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
          >
            ↩ Angre
          </button>
          {selectedBox && (
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              🗑 Slett
            </button>
          )}

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
              className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              −
            </button>
            <span className="text-xs text-slate-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              +
            </button>
          </div>

          <div className="flex-1" />

          {proActive ? (
            <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full font-medium">
              ✦ Pro
            </span>
          ) : (
            <button
              onClick={() => setShowUpgrade(true)}
              className="text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Oppgrader til Pro
            </button>
          )}

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-1.5 rounded-lg text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-100 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Eksporterer...
              </>
            ) : (
              <>↓ Last ned {!proActive && remaining < 2 ? `(${remaining} igjen)` : ''}</>
            )}
          </button>
        </div>

        {/* PII / Søk-rad */}
        <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex flex-wrap items-center gap-2">
          <button
            onClick={handleAutoDetect}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              proActive
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                : 'text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-600'
            }`}
          >
            🔍 Finn persondata automatisk
            {!proActive && (
              <span className="text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">Pro</span>
            )}
          </button>

          <div className="flex items-center gap-1 flex-1 max-w-xs">
            <input
              type="text"
              placeholder={proActive ? 'Søk og sladd...' : 'Søk og sladd (Pro)'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchRedact()}
              disabled={!proActive}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
            />
            <button
              onClick={proActive ? handleSearchRedact : () => setShowUpgrade(true)}
              className="px-3 py-1.5 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
            >
              Søk
            </button>
          </div>

          <div className="flex-1" />

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
              >
                ‹
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Side {currentPage} av {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Canvas-område */}
        <div
          ref={containerRef}
          className="relative overflow-auto bg-slate-100 dark:bg-slate-900 p-4"
          style={{ maxHeight: '70vh' }}
        >
          {pdfPages.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-slate-500">Laster dokumentet...</p>
              </div>
            </div>
          ) : (
            <div
              className="relative inline-block mx-auto"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
            >
              <canvas
                ref={canvasRef}
                className="shadow-2xl rounded"
                style={{ cursor: tool === 'select' ? 'default' : 'crosshair', display: 'block' }}
              />
              <canvas
                ref={overlayRef}
                className="absolute inset-0 rounded"
                style={{ cursor: tool === 'select' ? 'pointer' : 'crosshair', opacity: 0.9 }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
              />
            </div>
          )}
        </div>

        {/* Statuslinje */}
        <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
          <span>
            {pageBoxCount} sladding{pageBoxCount !== 1 ? 'er' : ''} på denne siden · {boxes.length} totalt
          </span>
          <span className="flex items-center gap-1 text-emerald-500">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Filen din forlater aldri denne enheten
          </span>
        </div>
      </div>
    </>
  )
}
