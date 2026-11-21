'use client'

export default function TrustSection() {
  return (
    <section className="mt-16 max-w-3xl mx-auto">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-4">
              Hvorfor vanlig sladding i Word og PDF ofte lekker informasjon
            </h2>
            <div className="space-y-3 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">✕</span>
                <p>
                  <strong>Svarte bokser i Word og Acrobat</strong> er ofte bare et fargelag oppå teksten. Teksten under er fortsatt intakt i dokumentet og kan enkelt hentes ut: kopier, lim inn i Notepad — og originalteksten dukker opp.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">✕</span>
                <p>
                  <strong>Halvgjennomsiktig markeringstusj</strong> (gult eller svart, 50 % opacity) kan avsløres ved å justere lysstyrke og kontrast i et bilderedigeringsprogram — teksten trer tydelig frem igjen.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">✕</span>
                <p>
                  <strong>PDF-lag og metadata</strong> kan inneholde teksten i klartekst selv om den ser sladdet ut på skjermen. Mange PDF-lesere lar deg søke i eller eksportere det skjulte innholdet.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-amber-200 dark:border-amber-700 flex items-start gap-3">
                <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                <p>
                  <strong>Sladd.app gjør det riktig:</strong> vi rendrer hver side til et høyoppløselig bilde og brenner sladde-boksene permanent inn i pikslene. Tekstlaget fjernes fullstendig fra den eksporterte filen — det finnes ingenting å kopiere, ingenting å lyse opp og ingenting å søke etter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
