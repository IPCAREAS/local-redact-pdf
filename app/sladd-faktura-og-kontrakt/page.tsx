import type { Metadata } from 'next'
import RedactApp from '@/components/RedactApp'

export const metadata: Metadata = {
  metadataBase: new URL('https://sladd.app'),
  title: 'Sladd priser og personopplysninger i kontrakter og fakturaer | Sladd.app',
  description:
    'Sladd navn, priser, kontonummer og sensitiv forretningsinformasjon fra PDF-fakturaer og kontrakter. Gratis, 100 % klient-side og GDPR-vennlig.',
  keywords:
    'sladd kontrakt, sladde faktura, skjule priser PDF, anonymisere kontrakt, sladd personopplysninger kontrakt, GDPR sladde dokument, sladd forretningsavtale',
  openGraph: {
    title: 'Sladd priser og personopplysninger i kontrakter og fakturaer',
    description:
      'Sladd navn, priser, kontonummer og sensitiv info fra PDF-fakturaer og kontrakter. Gratis og 100 % offline.',
    url: 'https://sladd.app/sladd-faktura-og-kontrakt',
    siteName: 'Sladd.app',
    locale: 'nb_NO',
    type: 'website',
  },
  alternates: {
    canonical: 'https://sladd.app/sladd-faktura-og-kontrakt',
  },
}

const FAQS = [
  {
    q: 'Hva bør jeg sladde i en kontrakt før jeg deler den?',
    a: 'Sladd priser, honorar, betalingsbetingelser og andre kommersielt sensitive detaljer. Du bør også sladde navn og kontaktinfo på parter som ikke er relevante for mottakeren.',
  },
  {
    q: 'Kan jeg sladde priser og betalingsbetingelser i PDF-fakturaer?',
    a: 'Ja. Bruk Sladd-verktøyet til å tegne bokser over beløp, priser og betalingsbetingelser. Den eksporterte PDF-en vil ha permanent sladdede felt.',
  },
  {
    q: 'Er dette GDPR-kompatibelt for behandling av forretningsdokumenter?',
    a: 'Siden ingen data lastes opp til en ekstern server, elimineres hoveddatabehandlingsrisikoen. For intern compliance bør du sjekke dine egne retningslinjer for dokumenthåndtering.',
  },
  {
    q: 'Kan jeg bruke Sladd.app for konfidensielle forretningsavtaler?',
    a: 'Ja — faktisk er dette ideelt for konfidensielle dokumenter siden filen aldri forlater enheten din. Du trenger ikke stole på et eksternt verktøy med sensitive forretningsdata.',
  },
  {
    q: 'Fungerer Søk og sladd for å finne firma- og personnavn i lange kontrakter?',
    a: 'Ja. Med Pro-planen kan du bruke Søk og sladd til å skrive inn et navn og sladde alle forekomster i hele dokumentet med ett klikk.',
  },
]

export default function SladdFakturaOgKontrakt() {
  return (
    <RedactApp
      heroTitle="Sladd kontrakter og fakturaer"
      heroDescription="Sladd priser, navn, kontonummer og sensitiv forretningsinformasjon fra PDF-er — uten å laste dem opp noe sted. <strong>Gratis og 100 % privat</strong>."
      customFaqs={FAQS}
    />
  )
}
