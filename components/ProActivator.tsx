'use client'

import { useEffect, useState } from 'react'
import { activatePro, isPro } from '@/lib/freemium'

export const PRO_KEY = 'SLADD-PRO-2026'

export default function ProActivator() {
  const [banner, setBanner] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const proKey = params.get('pro_key')
    if (proKey && proKey.toUpperCase() === PRO_KEY) {
      if (!isPro()) {
        activatePro(PRO_KEY)
      }
      // Varsle alle komponenter umiddelbart via custom event
      window.dispatchEvent(new CustomEvent('sladd:pro-activated'))
      setBanner(true)
      // Fjern query-parameteren fra adressefeltet
      params.delete('pro_key')
      const newUrl =
        window.location.pathname +
        (params.toString() ? '?' + params.toString() : '')
      window.history.replaceState({}, '', newUrl)
      // Skjul banner etter 6 sekunder
      setTimeout(() => setBanner(false), 6000)
    }
  }, [])

  if (!banner) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-emerald-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold whitespace-nowrap"
    >
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      Sladd.app Pro er nå aktivert! 🎉
    </div>
  )
}
