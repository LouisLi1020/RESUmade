import { useI18n } from '@/i18n/I18nContext'
import { inlineMarkdownToHtml } from '@/utils/markdown'

interface Props {
  value: string
  onChange: (intro: string) => void
  onPrev: () => void
  onNext: () => void
}

const MAX_WORDS = 200

export default function StepIntroductionForm({ value, onChange, onPrev, onNext }: Props) {
  const { t } = useI18n()
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
  const over = wordCount > MAX_WORDS

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{t('introduction.heading')}</h2>
      <p className="text-sm text-slate-600 mb-2">{t('introduction.wordHint', { max: MAX_WORDS })}</p>
      <p className="text-xs text-slate-500 mb-2">
        {t('introduction.richTextHint')}
      </p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className={`w-full border rounded px-3 py-2 resize-y ${
          over ? 'border-red-400' : 'border-slate-300'
        }`}
        placeholder={t('introduction.placeholder')}
      />
      <p className={`text-sm mt-1 ${over ? 'text-red-600' : 'text-slate-500'}`}>
        {wordCount} / {MAX_WORDS} {t('introduction.words')}
      </p>
      <div className="mt-2 border border-dashed border-slate-200 rounded px-3 py-2 bg-slate-50">
        <p className="text-xs font-medium text-slate-500 mb-1">Preview</p>
        <div
          className="text-sm text-slate-700"
          dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(value) }}
        />
      </div>
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
        >
          {t('common.back')}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
