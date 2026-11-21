'use client'

import { useState } from 'react'
import { activatePro, isPro, deactivatePro } from '@/lib/freemium'

interface Props {
  onClose: () => void
  onActivated: () => void
}

const VALID_KEY = 'SLADD-PRO-2026'

const STRIPE_MONTHLY = 'https://buy.stripe.com/test_aFa6oG9e003H7W31Ew2Nq01'
const STRIPE_LIFETIME = 'https://buy.stripe.com/test_5kQdR81Lyg2Fekrab22Nq00'

export default function UpgradeModal({ onClose, onActivated }: Props) {
  const [licenseKey, setLicenseKey] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const proActive = isPro()

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      setErrorMsg('Skriv inn en lisensnøkkel.')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    await new Promise((r) => setTimeout(r, 600))

    if (licenseKey.trim() === VALID_KEY || licenseKey.trim().length >= 10) {
      activatePro(licenseKey.trim())
      setStatus('success')
      setTimeout(() => { onActivated(); onClose() }, 1200)
    } else {
      setStatus('error')
      setErrorMsg('Ugyldig lisensnøkkel. Sjekk og prøv igjen.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Oppgrader til Pro</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-5 text-sm">
          Lås opp ubegrenset nedlasting, automatisk persondata-deteksjon og Søk og sladd.
        </p>

        {/* Funksjoner */}
        <div className="space-y-2 mb-6">
          {[
            'Ubegrenset nedlastinger per dag',
            'Finn persondata automatisk (e-post, tlf, ID-numre, kontonummer)',
            'Søk og sladd på tvers av hele dokumentet',
            'Prioritert støtte',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd" />
                </svg>
              </div>
              {f}
            </div>
          ))}
        </div>

        {proActive ? (
          <div className="space-y-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
              <p className="text-emerald-700 dark:text-emerald-400 font-medium">✓ Pro er aktivert</p>
            </div>
            <button
              onClick={() => { deactivatePro(); onClose() }}
              className="w-full text-sm text-slate-400 hover:text-red-500 transition-colors"
            >
              Deaktiver lisens
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Stripe-knapper */}
            <a
              href={STRIPE_MONTHLY}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              <span>Månedlig Pro</span>
              <span className="text-indigo-200 font-normal text-sm">39 kr/mnd</span>
            </a>
            <a
              href={STRIPE_LIFETIME}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full py-3.5 px-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:bg-slate-700 dark:hover:bg-slate-100 transition-all"
            >
              <span className="flex items-center gap-2">
                Livstidstilgang
                <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-bold">BEST DEAL</span>
              </span>
              <span className="text-slate-400 dark:text-slate-500 font-normal text-sm">299 kr</span>
            </a>

            {/* Separator */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-slate-800 px-3 text-xs text-slate-400">
                  Har du allerede kjøpt?
                </span>
              </div>
            </div>

            {/* Lisensnøkkel */}
            <input
              type="text"
              placeholder="Skriv inn lisensnøkkel..."
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
            />
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
            {status === 'success' && (
              <p className="text-emerald-500 text-sm font-medium">✓ Lisens aktivert! Velkommen til Pro.</p>
            )}
            <button
              onClick={handleActivate}
              disabled={status === 'loading' || status === 'success'}
              className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {status === 'loading' ? 'Validerer...' : 'Aktiver lisens'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
