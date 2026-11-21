import type { Metadata } from 'next'
import RedactApp from '@/components/RedactApp'

export const metadata: Metadata = {
  metadataBase: new URL('https://sladd.app'),
  title: 'Sladd pass, førerkort og ID-kort trygt uten opplasting | Sladd.app',
  description:
    'Sladd fødselsnummer, foto eller adresse fra pass, førerkort eller ID-kort direkte i nettleseren. Ingen opplasting nødvendig — 100 % offline og privat.',
  keywords:
    'sladd pass, sladde ID-kort, skjule fødselsnummer pass, anonymisere ID, sladd førerkort, sladde MRZ-kode, sladd legitimasjon',
  openGraph: {
    title: 'Sladd pass, førerkort og ID-kort trygt uten opplasting',
    description:
      'Sladd fødselsnummer, foto eller MRZ-kode fra ID-dokumenter direkte i nettleseren. Filen forlater aldri enheten din.',
    url: 'https://sladd.app/sladd-pass-og-id',
    siteName: 'Sladd.app',
    locale: 'nb_NO',
    type: 'website',
  },
  alternates: {
    canonical: 'https://sladd.app/sladd-pass-og-id',
  },
}

const FAQS = [
  {
    q: 'Hvilke felt bør jeg sladde på passet mitt?',
    a: 'Avhengig av formålet: sladd fødselsnummer, MRZ-kode (maskinlesbar sone), adresse eller passnummer. Hvis du kun trenger å bekrefte identitet, kan du sladde alt unntatt navn og bilde.',
  },
  {
    q: 'Er det trygt å behandle pass og ID-bilder i nettleseren?',
    a: 'Ja. Sladd.app kjører offline og sender aldri filen til noen ekstern server. Passet ditt forblir på din enhet hele tiden.',
  },
  {
    q: 'Kan jeg sladde den maskinlesbare sonen (MRZ) på passet?',
    a: 'Ja. Bruk Sladd-verktøyet og tegn en boks over MRZ-stripen nederst på passet. Sladdingen er permanent i den eksporterte filen.',
  },
  {
    q: 'Hva gjør jeg om et selskap ber om kopi av passet for KYC?',
    a: 'Du kan sladde sensitiv informasjon du ikke trenger å dele (som fødselsnummer) og beholde det som er nødvendig for identifikasjonsformålet. Ta kontakt med selskapet for å avklare hva de faktisk trenger.',
  },
  {
    q: 'Kan jeg sladde bilder av ID-kort (ikke bare PDF)?',
    a: 'Ja — Sladd.app støtter også PNG og JPEG, slik at du kan sladde bilder av ID-kort, førerkort og andre dokumenter direkte.',
  },
]

export default function SladdPassOgId() {
  return (
    <RedactApp
      heroTitle="Sladd pass, førerkort og ID-kort"
      heroDescription="Sladd fødselsnummer, MRZ-kode eller bilde fra legitimasjonen din — uten å laste den opp noe sted. <strong>100 % offline og privat</strong>."
      customFaqs={FAQS}
    />
  )
}
