import type { Personal, LinkItem, LinkKind } from '@/types/resume'
import { useI18n } from '@/i18n/I18nContext'

interface Props {
  data: Personal
  onChange: (patch: Partial<Personal>) => void
  onNext: () => void
}

export default function StepPersonalForm({ data, onChange, onNext }: Props) {
  const { t } = useI18n()
  const addLink = () => {
    const links = [...(data.links ?? []), { url: '', kind: 'link' as LinkKind }]
    onChange({ links })
  }
  const updateLink = (i: number, patch: Partial<LinkItem>) => {
    const links = [...(data.links ?? [])]
    links[i] = { ...links[i], ...patch }
    onChange({ links })
  }
  const removeLink = (i: number) => {
    const links = (data.links ?? []).filter((_, idx) => idx !== i)
    onChange({ links })
  }

  const linkKindOptions: { value: LinkKind; label: string }[] = [
    { value: 'link', label: t('personal.linkType.link') },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'github', label: 'GitHub' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'x', label: 'X / Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'spotify', label: 'Spotify' },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{t('personal.heading')}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t('personal.legalName')}</label>
          <input
            type="text"
            value={data.legalName}
            onChange={(e) => onChange({ legalName: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder={t('personal.placeholderFullName')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t('personal.preferredName')}</label>
          <input
            type="text"
            value={data.preferredName ?? ''}
            onChange={(e) => onChange({ preferredName: e.target.value || undefined })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder={t('personal.placeholderPreferred')}
          />
          {(data.preferredName ?? '').trim() && (
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.showPreferredName !== false}
                onChange={(e) => onChange({ showPreferredName: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
              />
              <span className="text-sm text-slate-600">{t('personal.showPreferredName')}</span>
            </label>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t('personal.email')}</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder={t('personal.placeholderEmail')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t('personal.phone')}</label>
          <input
            type="tel"
            value={data.phone ?? ''}
            onChange={(e) => onChange({ phone: e.target.value || undefined })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder={t('personal.placeholderPhone')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">{t('personal.address')}</label>
          <input
            type="text"
            value={data.address ?? ''}
            onChange={(e) => onChange({ address: e.target.value || undefined })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder={t('personal.placeholderAddress')}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-600">{t('personal.links')}</label>
            <button
              type="button"
              onClick={addLink}
              className="text-sm text-slate-600 hover:text-slate-800 underline"
            >
              {t('personal.addLink')}
            </button>
          </div>
          <label className="flex items-center gap-2 mt-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!data.showFullUrls}
              onChange={(e) => onChange({ showFullUrls: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500"
            />
            <span className="text-sm text-slate-600">{t('personal.showFullUrls')}</span>
          </label>
          {(data.links ?? []).map((link, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <select
                value={link.kind ?? 'link'}
                onChange={(e) => updateLink(i, { kind: e.target.value as LinkKind })}
                className="border border-slate-300 rounded px-2 py-2 text-sm bg-white"
              >
                {linkKindOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(i, { url: e.target.value })}
                className="flex-1 border border-slate-300 rounded px-3 py-2"
                placeholder={t('personal.placeholderLinkUrl')}
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="text-red-600 hover:text-red-800 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!data.legalName.trim() || !data.email.trim()}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}
