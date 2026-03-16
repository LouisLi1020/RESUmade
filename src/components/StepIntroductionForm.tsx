interface Props {
  value: string
  onChange: (intro: string) => void
  onPrev: () => void
  onNext: () => void
}

const MAX_WORDS = 200

export default function StepIntroductionForm({ value, onChange, onPrev, onNext }: Props) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
  const over = wordCount > MAX_WORDS

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Introduction</h2>
      <p className="text-sm text-slate-600 mb-2">About ~{MAX_WORDS} words.</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className={`w-full border rounded px-3 py-2 resize-y ${
          over ? 'border-red-400' : 'border-slate-300'
        }`}
        placeholder="Write a short introduction about yourself..."
      />
      <p className={`text-sm mt-1 ${over ? 'text-red-600' : 'text-slate-500'}`}>
        {wordCount} / {MAX_WORDS} words
      </p>
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
        >
          Next
        </button>
      </div>
    </div>
  )
}
