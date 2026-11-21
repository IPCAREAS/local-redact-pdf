'use client'

import { useState } from 'react'

const DEFAULT_FAQS = [
  {
    q: 'Er Sladd.app virkelig 100 % offline?',
    a: 'Ja. Sladd.app kjører helt i nettleseren din via WebAssembly og JavaScript. Ingen data sendes til noen server — filene dine forblir på enheten din til enhver tid.',
  },
  {
    q: 'Hvordan fungerer PDF-sladding?',
    a: 'Sladd.app rendrer hver PDF-side til et høyoppløselig bilde, brenner sladde-boksene direkte inn i bildet, og setter deretter sammen en ny, flat PDF. Det underliggende tekstlaget fjernes fullstendig — sladdingen er permanent og kan ikke reverseres.',
  },
  {
    q: "Hva er forskjellen på 'Sladd' og 'Sløre'?",
    a: "Sladd erstatter det valgte området med en solid svart boks — dette er standarden som brukes i juridiske og offentlige dokumenter. Sløre bruker en pikselerings-effekt der du ønsker å skjule uten å fjerne helt (f.eks. skjermbilder). For sensitive dokumenter — alltid bruk Sladd.",
  },
  {
    q: 'Hva er «Finn persondata automatisk»?',
    a: 'Finn persondata skanner tekstlaget i PDF-en din og fremhever automatisk norske personidentifikatorer: e-postadresser, telefonnumre, fødselsnumre (11 siffer), kontonumre og beløp i kr/NOK.',
  },
  {
    q: 'Hvilke filformater støttes?',
    a: 'Sladd.app støtter PDF (.pdf), PNG (.png) og JPEG (.jpg, .jpeg) opp til 100 MB.',
  },
  {
    q: 'Hva er grensen for gratis-planen?',
    a: 'Gratis-planen gir 2 nedlastinger per dag. Oppgrader til Pro for ubegrenset nedlasting, automatisk persondata-deteksjon og Søk og sladd.',
  },
  {
    q: 'Hvordan fjerner jeg tekst permanent fra en PDF?',
    a: "Tegn en sladde-boks over teksten med Sladd-verktøyet, og klikk deretter 'Last ned sladdet fil'. Den eksporterte filen er en flat, bildebasert PDF — originalteksten er borte og kan ikke gjenopprettes eller søkes opp.",
  },
  {
    q: 'Er Sladd.app GDPR-kompatibelt?',
    a: 'Siden Sladd.app aldri laster opp filene dine, elimineres dataoverføringsrisikoen som de fleste compliance-rammeverk handler om. GDPR-samsvar avhenger likevel av egne lagrings- og behandlingsrutiner.',
  },
]

interface Props {
  faqs?: { q: string; a: string }[]
}

export default function FAQSection({ faqs = DEFAULT_FAQS }: Props) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="mt-20" aria-label="Ofte stilte spørsmål">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
        Ofte stilte spørsmål
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-10">
        Alt du trenger å vite om Sladd.app
      </p>
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="font-medium text-slate-900 dark:text-white text-sm">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-6 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
