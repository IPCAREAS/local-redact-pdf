import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LocalRedact — Redact PDFs & Images 100% Offline',
  description: 'Free, browser-based PDF and image redaction tool. Draw redaction boxes, blur sensitive content, auto-detect PII. Your files never leave your device.',
  keywords: 'PDF redaction, redact PDF online, free PDF redactor, offline PDF editor, remove sensitive information PDF, image redaction',
  openGraph: {
    title: 'LocalRedact — Redact PDFs & Images 100% Offline',
    description: 'Free PDF and image redaction. 100% offline, no uploads, completely private.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
