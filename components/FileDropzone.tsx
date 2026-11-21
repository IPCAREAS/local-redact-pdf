'use client'

import { useCallback, useState } from 'react'

interface Props {
  onFileLoad: (file: File) => void
}

export default function FileDropzone({ onFileLoad }: Props) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      setError(null)
      const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
      if (!allowed.includes(file.type)) {
        setError('Kun PDF, PNG og JPG-filer støttes.')
        return
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('Filen må være under 100 MB.')
        return
      }
      onFileLoad(file)
    },
    [onFileLoad]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all cursor-pointer
        ${
          dragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-700/50'
        }`}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-indigo-500' : 'bg-slate-100 dark:bg-slate-700'}`}
        >
          <svg
            className={`w-8 h-8 ${dragging ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <div>
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-200">
            {dragging ? 'Slipp filen her' : 'Slipp filen her, eller klikk for å velge'}
          </p>
          <p className="mt-1 text-sm text-slate-400">PDF, PNG, JPG opptil 100 MB</p>
        </div>
        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
