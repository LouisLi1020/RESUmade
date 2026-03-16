import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type { Locale, Messages } from './types'
import { en } from './locales/en'
import { zhTW } from './locales/zh-TW'
import { zhCN } from './locales/zh-CN'

const MESSAGES: Record<Locale, Messages> = { en, 'zh-TW': zhTW, 'zh-CN': zhCN }

const STORAGE_KEY = 'resumade-locale'

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const s = localStorage.getItem(STORAGE_KEY) as Locale | null
  return s && (s === 'en' || s === 'zh-TW' || s === 'zh-CN') ? s : 'en'
}

function getMessage(messages: Messages, path: string): string | undefined {
  const parts = path.split('.')
  let cur: unknown = messages
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[p]
  }
  return typeof cur === 'string' ? cur : undefined
}

function interpolate(str: string, vars: Record<string, string | number>): string {
  return Object.entries(vars).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
    str
  )
}

type TFunction = (key: string, vars?: Record<string, string | number>) => string

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TFunction
  stepLabels: string[]
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const messages = MESSAGES[locale]

  const t: TFunction = useCallback(
    (key, vars) => {
      const raw = getMessage(messages, key)
      const str = raw ?? key
      return vars ? interpolate(str, vars) : str
    },
    [messages]
  )

  const stepLabels = useMemo(
    () => [
      messages.steps.personal,
      messages.steps.introduction,
      messages.steps.experience,
      messages.steps.education,
      messages.steps.skills,
      messages.steps.preview,
    ],
    [messages]
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, stepLabels }),
    [locale, setLocale, t, stepLabels]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'zh-CN', label: '简体中文' },
]
