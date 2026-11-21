import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://sladd.app'),
  title: 'Sladd.app — Sladd PDF og bilder 100 % privat i nettleseren',
  description: 'Gratis verktøy for å sladde PDF-er og bilder. Tegn sladde-bokser, finn persondata automatisk, søk og sladd. Filene dine forlater aldri enheten din.',
  keywords: 'sladde PDF, sladd PDF norsk, sladd persondata, sladde kontoutskrift, sladde pass, fjerne personopplysninger PDF, gratis sladdeprogram, offline sladding',
  authors: [{ name: 'Sladd.app' }],
  openGraph: {
    title: 'Sladd.app — Sladd PDF og bilder 100 % privat i nettleseren',
    description: 'Gratis, offline PDF-sladding i nettleseren. Ingen opplasting — filene dine forblir på din enhet.',
    type: 'website',
    url: 'https://sladd.app',
    siteName: 'Sladd.app',
    locale: 'nb_NO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sladd.app — Sladd PDF og bilder 100 % privat',
    description: 'Gratis, offline PDF-sladding. Ingen opplasting nødvendig.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://sladd.app',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
