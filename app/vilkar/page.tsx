import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  metadataBase: new URL('https://sladd.app'),
  title: 'Vilkår og personvern – Sladd.app',
  description:
    'Les om hvordan Sladd.app håndterer personvern, behandler dokumenter lokalt i nettleseren, og hvilke vilkår som gjelder for bruk og betaling.',
  alternates: { canonical: 'https://sladd.app/vilkar' },
  robots: { index: true, follow: true },
}

export default function Vilkar() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">Sladd.app</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            ← Tilbake til editoren
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Vilkår og personvern
        </h1>
        <p className="text-sm text-slate-400 mb-10">Sist oppdatert: november 2026</p>

        <div className="space-y-10">

          {/* 1. Om tjenesten */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              1. Om tjenesten og kontakt
            </h2>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
              <p>
                Sladd.app er et nettbasert verktøy for sladding av PDF-er og bilder. Tjenesten
                lar deg tegne sladde-bokser, sløre innhold og eksportere et permanent sladdet
                dokument, utelukkende ved hjelp av nettleseren din.
              </p>
              <p>
                Spørsmål, feil eller henvendelser kan sendes til{' '}
                <a
                  href="mailto:post@sladd.app"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  post@sladd.app
                </a>
                .
              </p>
            </div>
          </section>

          {/* 2. Personvern */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              2. Personvern og 100 % lokal behandling
            </h2>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
              <p>
                Sladd.app behandler alle dokumenter og bilder utelukkende lokalt i din egen
                nettleser. Ingen filer lastes opp til, lagres på eller deles med våre servere
                eller tredjeparter. Filene forlater aldri enheten din.
              </p>
              <p>
                Nettsiden bruker ikke sporingskapsler (cookies) til markedsføring eller
                analyse. Det eneste som lagres lokalt i nettleseren (via{' '}
                <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono">
                  localStorage
                </code>
                ) er:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Antall gratis nedlastinger brukt denne uken</li>
                <li>Eventuell Pro-lisensnøkkel ved aktivering</li>
              </ul>
              <p>
                Disse dataene forlater ikke nettleseren din og kan når som helst slettes ved å
                tømme nettleserens lokale lagring.
              </p>
            </div>
          </section>

          {/* 3. Ansvarsfraskrivelse */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              3. Brukerens ansvar og ansvarsfraskrivelse
            </h2>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
              <p>
                Tjenesten leveres «som den er» uten garantier av noe slag. Selv om Sladd.app
                brenner sladde-boksene permanent inn i pikslene på den eksporterte filen og
                fjerner det underliggende tekstlaget, er det alltid brukerens eget ansvar å
                kontrollere det ferdige dokumentet nøye før det sendes videre eller publiseres.
              </p>
              <p>
                Dette gjelder særlig ved bruk av automatiske hjelpefunksjoner merket{' '}
                <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-medium px-1.5 py-0.5 rounded">
                  Beta
                </span>
                , der treffpresisjon og dekning ikke kan garanteres for alle dokumenttyper.
              </p>
              <p>
                Sladd.app er ikke ansvarlig for eventuelle følger av mangelfull sladding
                utført av brukeren, herunder utilsiktet deling av personopplysninger eller
                konfidensielt innhold.
              </p>
            </div>
          </section>

          {/* 4. Betaling */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              4. Betaling, angrerett og oppsigelse
            </h2>
            <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
              <p>
                Betaling håndteres trygt gjennom{' '}
                <a
                  href="https://stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Stripe
                </a>
                . Sladd.app lagrer ingen betalingsinformasjon.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-slate-700 dark:text-slate-300">
                    Månedlig abonnement (39 kr/mnd):
                  </strong>{' '}
                  Ingen bindingstid. Kan sies opp når som helst med ett klikk via{' '}
                  <a
                    href="https://billing.stripe.com/p/login/cNieVcalLehQ6ZMek75wI00"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    kundeportalen
                  </a>
                  . Abonnementet løper til slutten av gjeldende faktureringsperiode.
                </li>
                <li>
                  <strong className="text-slate-700 dark:text-slate-300">
                    Livstidstilgang (799 kr):
                  </strong>{' '}
                  Et engangskjøp som gir varig tilgang til Pro-funksjoner i nettleseren, knyttet
                  til lisensnøkkelen som utstedes ved kjøp.
                </li>
              </ul>
              <p>
                Ved digitalt innhold som tas i bruk umiddelbart etter kjøp, bortfaller ordinær
                14-dagers angrerett (jf. angrerettloven § 22 bokstav b) fra det tidspunktet
                leveringen har startet og du har bekreftet at du er klar over dette.
              </p>
            </div>
          </section>

        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700 mt-16 py-8 text-center text-sm text-slate-400">
        <p>Sladd.app &copy; {new Date().getFullYear()}</p>
        <div className="mt-2 flex justify-center gap-4 text-xs">
          <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            Tilbake til editoren
          </Link>
          <a
            href="mailto:post@sladd.app"
            className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            post@sladd.app
          </a>
        </div>
      </footer>
    </div>
  )
}
