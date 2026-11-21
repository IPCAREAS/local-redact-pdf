import type { Metadata } from 'next'
import RedactApp from '@/components/RedactApp'

export const metadata: Metadata = {
  metadataBase: new URL('https://sladd.app'),
  title: 'Sladd kontoutskrift til bank eller NAV – 100 % privat | Sladd.app',
  description:
    'Last opp kontoutskriften din og sladd kontonummer, beløp og navn – helt uten opplasting til server. Trygt, gratis og klar for bank, NAV og det offentlige.',
  keywords:
    'sladd kontoutskrift, sladde kontoutskrift NAV, skjule kontonummer, anonymisere bankutskrift, sladd PDF bank, fjerne beløp fra kontoutskrift',
  openGraph: {
    title: 'Sladd kontoutskrift til bank eller NAV – 100 % privat i nettleseren',
    description:
      'Sladd kontonummer, beløp og navn fra kontoutskriften din uten å laste den opp noe sted. Fungerer helt offline.',
    url: 'https://sladd.app/sladd-kontoutskrift',
    siteName: 'Sladd.app',
    locale: 'nb_NO',
    type: 'website',
  },
  alternates: {
    canonical: 'https://sladd.app/sladd-kontoutskrift',
  },
}

const FAQS = [
  {
    q: 'Hvilke opplysninger bør jeg sladde på en kontoutskrift?',
    a: 'Sladd kontonummer, navn på motparter, adresser og beløp du ikke ønsker å dele. Mange velger også å sladde fremtidige transaksjoner dersom utskriften skal brukes som dokumentasjon for en bestemt periode.',
  },
  {
    q: 'Trenger NAV eller banken full tilgang til alle transaksjoner?',
    a: 'Nei — du har rett til å sladde informasjon som ikke er relevant for søknaden. Sjekk alltid med den aktuelle instansen hva som faktisk kreves.',
  },
  {
    q: 'Er det trygt å bruke Sladd.app for kontoutskrifter med sensitiv finansdata?',
    a: 'Ja. Sladd.app kjører 100 % i nettleseren — kontoutskriften lastes aldri opp til noen server. All behandling skjer lokalt på din enhet.',
  },
  {
    q: 'Kan jeg sladde kun deler av en kontoutskrift?',
    a: 'Ja, du velger selv nøyaktig hvilke rader og felt du vil sladde. Bruk Sladd-verktøyet til å tegne bokser over de delene du vil fjerne.',
  },
  {
    q: 'Fungerer Sladd.app med kontoutskrifter fra alle norske banker?',
    a: 'Ja, så lenge kontoutskriften er i PDF-format støttes den fullt ut — uavhengig av hvilken bank du bruker.',
  },
]

export default function SladdKontoutskrift() {
  return (
    <RedactApp
      heroTitle="Sladd kontoutskrift til bank eller NAV"
      heroDescription="Last opp kontoutskriften og sladd kontonummer, beløp og navn — uten å laste den opp noe sted. Filene dine forblir <strong>100 % på din enhet</strong>."
      customFaqs={FAQS}
    />
  )
}
