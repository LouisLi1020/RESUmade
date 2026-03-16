interface StepperProps {
  steps: string[]
  currentIndex: number
  onStepClick: (index: number) => void
}

export default function Stepper({ steps, currentIndex, onStepClick }: StepperProps) {
  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto">
      <ol className="flex items-center gap-1 min-w-max">
        {steps.map((label, i) => (
          <li key={i} className="flex items-center">
            <button
              type="button"
              onClick={() => onStepClick(i)}
              className={`
                px-3 py-1.5 rounded text-sm font-medium transition
                ${i === currentIndex
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-600 hover:bg-slate-200'}
              `}
            >
              {label}
            </button>
            {i < steps.length - 1 && (
              <span className="mx-1 text-slate-300">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
