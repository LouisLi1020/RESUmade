import { useState, useRef, useEffect } from 'react'
import { useI18n, LOCALES } from '@/i18n/I18nContext'

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false)
  const { locale, setLocale } = useI18n()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const currentLabel = LOCALES.find((l) => l.value === locale)?.label ?? 'Language'

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800"
        title={currentLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={currentLabel}
      >
        <GlobeIcon className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 py-1 min-w-[10rem] bg-white rounded-lg shadow-lg border border-slate-200 text-slate-800 z-50"
          role="listbox"
          aria-label="Select language"
        >
          {LOCALES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={locale === value}
              onClick={() => {
                setLocale(value)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition flex items-center gap-2 ${
                locale === value
                  ? 'bg-slate-100 text-slate-900 font-medium'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="w-4 flex-shrink-0" aria-hidden>
                {locale === value ? '✓' : ''}
              </span>
              <span className="flex-1">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
