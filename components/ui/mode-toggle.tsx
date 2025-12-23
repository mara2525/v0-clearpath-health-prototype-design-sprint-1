"use client"

import { cn } from "@/lib/utils"

interface ModeToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export function ModeToggle({ checked, onChange, className }: ModeToggleProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("text-sm font-medium transition-colors", !checked ? "text-emerald-600" : "text-gray-400")}>
        AI
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          checked ? "bg-amber-500 focus:ring-amber-500" : "bg-emerald-500 focus:ring-emerald-500",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
      <span className={cn("text-sm font-medium transition-colors", checked ? "text-amber-600" : "text-gray-400")}>
        Demo
      </span>
    </div>
  )
}
