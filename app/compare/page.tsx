"use client"

import { useState, useEffect } from "react"
import { getAIMode } from "@/lib/utils/session"
import { PlanComparison } from "@/components/comparison/plan-comparison"

export default function ComparePage() {
  const [aiMode, setAiMode] = useState<string>("chat")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const readMode = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const modeParam = urlParams.get("aiMode") || getAIMode()
      setAiMode(modeParam)
    }

    readMode()

    const handleUrlChange = () => {
      readMode()
    }

    window.addEventListener("popstate", handleUrlChange)
    window.addEventListener("urlchange", handleUrlChange)

    return () => {
      window.removeEventListener("popstate", handleUrlChange)
      window.removeEventListener("urlchange", handleUrlChange)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const urlParams = new URLSearchParams(window.location.search)
      const modeParam = urlParams.get("aiMode") || getAIMode()
      if (modeParam !== aiMode) {
        setAiMode(modeParam)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [aiMode])

  if (!mounted) {
    return (
      <main className="py-12" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <PlanComparison />
        </div>
      </main>
    )
  }

  // All modes now render the same content
  return (
    <main className="py-12" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <PlanComparison />
      </div>
    </main>
  )
}
