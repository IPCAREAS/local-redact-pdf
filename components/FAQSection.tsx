'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'Is LocalRedact really 100% offline?',
    a: 'Yes. LocalRedact runs entirely in your browser using WebAssembly and JavaScript. No data is ever sent to any server. Your files stay on your device at all times.',
  },
  {
    q: 'How does PDF redaction work?',
    a: 'LocalRedact renders each PDF page to a high-resolution image, bakes your redaction boxes directly onto the image, then assembles a new flat PDF. The underlying text layer is completely removed, making redaction permanent and impossible to reverse.',
  },
  {
    q: 'What is "True Redaction" vs "Blur"?',
    a: 'True Redaction replaces the selected area with a solid black box — this is the standard used in legal and government documents. Blur applies a pixelation effect for cases where you want to obscure but not fully hide content (e.g., screenshots). For sensitive documents, always use True Redaction.',
  },
  {
    q: 'What is Auto-Detect PII?',
    a: 'Auto-Detect PII scans the text layer of your PDF and automatically highlights common personal identifiers: email addresses, phone numbers, and long number sequences like credit card numbers, bank account numbers, or national ID numbers.',
  },
  {
    q: 'What file types are supported?',
    a: 'LocalRedact supports PDF (.pdf), PNG (.png), and JPEG (.jpg, .jpeg) files up to 100 MB.',
  },
  {
    q: 'What is the free plan limit?',
    a: 'The free plan allows 2 downloads per day. Upgrade to Pro for unlimited downloads, Auto-Detect PII, and Search & Redact.',
  },
  {
    q: 'How do I permanently delete text from a PDF?',
    a: 'Draw a redaction box over the text using the Redact tool, then click "Download Redacted PDF". The exported file is a flat image-based PDF — the original text is gone and cannot be recovered or searched.',
  },
  {
    q: 'Is LocalRedact GDPR/HIPAA compliant?',
    a: 'Because LocalRedact never uploads your files, it eliminates the data-transfer risks that most compliance frameworks address. That said, compliance also depends on your own storage and handling practices.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="mt-20" aria-label="Frequently Asked Questions">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">Frequently Asked Questions</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-10">Everything you need to know about LocalRedact</p>
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
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
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
