"use client"

interface StarterPromptsProps {
  onSelect: (prompt: string) => void
}

export function StarterPrompts({ onSelect }: StarterPromptsProps) {
  const prompts = [
    "Which ClearPath plan has the highest deductible?",
    "Which plans have zero-cost telehealth?",
    "Which plan is best for someone who wants an HSA?",
    "Which plans have the lowest individual deductible?",
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(prompt)}
          className="p-3 rounded-lg border-2 text-sm font-medium hover:shadow transition-shadow"
          style={{
            borderColor: "var(--color-accent)",
            color: "var(--color-accent)",
            backgroundColor: "var(--color-white)",
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
