'use client'

import { useState, useCallback } from 'react'
import FileDropzone from './FileDropzone'
import PdfEditor from './PdfEditor'
import FAQSection from './FAQSection'
import TrustSection from './TrustSection'

export type FileType = 'pdf' | 'image' | null

export interface LoadedFile {
  type: FileType
  file: File
  url: string
}

interface Props {
  heroTitle?: string
  heroDescription?: string
  customFaqs?: { q: string; a: string }[]
}

export default function RedactApp({
  heroTitle = 'Sladd PDF og bilder',
  heroDescription = 'Tegn sladde-bokser, sløre sensitiv informasjon, finn persondata automatisk. Filene dine forlater <strong>aldri enheten din</strong> — 100 % privat.',
  customFaqs,
}: Props) {
  const [loadedFile, setLoadedFile] = useState<LoadedFile | null>(null)
  const [darkMode, setDarkMode] = useState(false)

  const handleFileLoad = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    const type: FileType = file.type === 'application/pdf' ? 'pdf' : 'image'
    setLoadedFile({ type, file, url })
  }, [])

  const handleReset = useCallback(() => {
    if (loadedFile?.url) URL.revokeObjectURL(loadedFile.url)
    setLoadedFile(null)
  }, [loadedFile])

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <a href="/" className="font-bold text-slate-900 dark:text-white text-lg hover:opacity-80 transition-opacity">
                  Sladd.app
                </a>
                <span className="ml-2 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                  GRATIS
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full font-medium border border-emerald-200 dark:border-emerald-800">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                100 % offline og privat
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Bytt mørk/lys modus"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero */}
          {!loadedFile && (
            <div className="text-center mb-10">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                {heroTitle}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  100 % i nettleseren
                </span>
              </h1>
              <p
                className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6"
                dangerouslySetInnerHTML={{ __html: heroDescription }}
              />
              <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-8">
                {['Ingen opplasting', 'Ingen konto', 'Ingen sporing', '100 % klient-side'].map((f) => (
                  <span key={f} className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Editor eller dropzone */}
          {loadedFile ? (
            <PdfEditor loadedFile={loadedFile} onReset={handleReset} />
          ) : (
            <FileDropzone onFileLoad={handleFileLoad} />
          )}

          {/* Tillitsseksjon + FAQ */}
          {!loadedFile && (
            <>
              <TrustSection />
              <FAQSection faqs={customFaqs} />
            </>
          )}
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-700 mt-16 py-8 text-center text-sm text-slate-400">
          <p>
            Sladd.app — Filene dine er trygge på din enhet. Alltid. &copy; {new Date().getFullYear()}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
            <a href="/sladd-kontoutskrift" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Sladd kontoutskrift</a>
            <a href="/sladd-pass-og-id" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Sladd pass og ID</a>
            <a href="/sladd-faktura-og-kontrakt" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Sladd faktura og kontrakt</a>
            <a href="https://billing.stripe.com/p/login/cNieVcalLehQ6ZMek75wI00" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Administrer abonnement</a>
            <a href="/vilkar" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Vilkår og personvern</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
