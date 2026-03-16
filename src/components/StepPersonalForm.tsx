import type { Personal, LinkItem } from '@/types/resume'

interface Props {
  data: Personal
  onChange: (patch: Partial<Personal>) => void
  onNext: () => void
}

export default function StepPersonalForm({ data, onChange, onNext }: Props) {
  const addLink = () => {
    const links = [...(data.links ?? []), { label: '', url: '' }]
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Personal</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Legal name *</label>
          <input
            type="text"
            value={data.legalName}
            onChange={(e) => onChange({ legalName: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder="Full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Preferred name</label>
          <input
            type="text"
            value={data.preferredName ?? ''}
            onChange={(e) => onChange({ preferredName: e.target.value || undefined })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder="What you like to be called"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
          <input
            type="tel"
            value={data.phone ?? ''}
            onChange={(e) => onChange({ phone: e.target.value || undefined })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder="+61 ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
          <input
            type="text"
            value={data.address ?? ''}
            onChange={(e) => onChange({ address: e.target.value || undefined })}
            className="w-full border border-slate-300 rounded px-3 py-2"
            placeholder="City, State"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-600">Links (optional)</label>
            <button
              type="button"
              onClick={addLink}
              className="text-sm text-slate-600 hover:text-slate-800 underline"
            >
              + Add link
            </button>
          </div>
          {(data.links ?? []).map((link, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(i, { label: e.target.value })}
                className="flex-1 border border-slate-300 rounded px-3 py-2"
                placeholder="Label (e.g. LinkedIn)"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(i, { url: e.target.value })}
                className="flex-1 border border-slate-300 rounded px-3 py-2"
                placeholder="https://..."
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
          Next
        </button>
      </div>
    </div>
  )
}
