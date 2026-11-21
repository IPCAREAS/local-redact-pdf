import RedactApp from '@/components/RedactApp'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Er Sladd.app virkelig 100 % offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Sladd.app kjører helt i nettleseren din via WebAssembly og JavaScript. Ingen data sendes til noen server — filene dine forblir på enheten din til enhver tid.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hvordan fungerer PDF-sladding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sladd.app rendrer hver PDF-side til et høyoppløselig bilde, brenner sladde-boksene direkte inn i bildet, og setter deretter sammen en ny, flat PDF. Det underliggende tekstlaget fjernes fullstendig — sladdingen er permanent og kan ikke reverseres.',
      },
    },
    {
      '@type': 'Question',
      name: "Hva er forskjellen på 'Sladd' og 'Sløre'?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Sladd erstatter det valgte området med en solid svart boks — dette er standarden som brukes i juridiske og offentlige dokumenter. Sløre bruker en pikselerings-effekt der du ønsker å skjule uten å fjerne helt (f.eks. skjermbilder). For sensitive dokumenter — alltid bruk Sladd.",
      },
    },
    {
      '@type': 'Question',
      name: 'Hva er «Finn persondata automatisk»?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Finn persondata skanner tekstlaget i PDF-en din og fremhever automatisk norske personidentifikatorer: e-postadresser, telefonnumre, fødselsnumre (11 siffer), kontonumre og beløp i kr/NOK.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hvilke filformater støttes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sladd.app støtter PDF (.pdf), PNG (.png) og JPEG (.jpg, .jpeg) opp til 100 MB.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hva er grensen for gratis-planen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gratis-planen gir 2 nedlastinger per dag. Oppgrader til Pro for ubegrenset nedlasting, automatisk persondata-deteksjon og Søk og sladd.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hvordan fjerner jeg tekst permanent fra en PDF?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Tegn en sladde-boks over teksten med Sladd-verktøyet, og klikk deretter 'Last ned sladdet fil'. Den eksporterte filen er en flat, bildebasert PDF — originalteksten er borte og kan ikke gjenopprettes eller søkes opp.",
      },
    },
    {
      '@type': 'Question',
      name: 'Er Sladd.app GDPR-kompatibelt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Siden Sladd.app aldri laster opp filene dine, elimineres dataoverføringsrisikoen som de fleste compliance-rammeverk handler om. GDPR-samsvar avhenger likevel av egne lagrings- og behandlingsrutiner.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kan Sladd.app brukes i kommune, offentlig sektor og bedrift?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Fordi Sladd.app behandler alle PDF-er og bilder 100 % lokalt i nettleseren på din egen datamaskin, lastes aldri dokumenter opp til en ekstern sky eller tredjepartsserver. Det gjør verktøyet trygt å bruke for saksbehandlere i kommune og offentlig sektor, advokater, regnskapsførere og helsepersonell som må sladde sensitiv informasjon før innsyn eller utsending.',
      },
    },
    {
      '@type': 'Question',
      name: 'Hvilke norske personopplysninger kan Sladd.app finne automatisk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Funksjonen for automatisk gjenkjenning skanner dokumentet lokalt og finner norske 11-sifrede fødselsnumre, norske kontonumre (xxxx.xx.xxxxx), telefonnumre, e-postadresser og beløp, slik at du kan sladde alt med ett klikk.',
      },
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <RedactApp />
    </>
  )
}
