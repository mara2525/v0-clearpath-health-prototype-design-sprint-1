"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ChatBox } from "@/components/ai/chat-box"

export function GlobalAIWrapper({ children }: { children: React.ReactNode }) {
  const [aiMode, setAiMode] = useState<string>("split")
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)

    setAiMode("split")
  }, [])

  if (!mounted) {
    return <div className="pt-20 min-h-screen">{children}</div>
  }

  return (
    <div className="fixed inset-0 flex pt-20">
      <div className="w-1/4 border-r h-full relative" style={{ borderColor: "var(--color-border)" }}>
        <div className="h-full p-4 overflow-y-auto">
          <ChatBox />
        </div>
      </div>

      <div className="w-3/4 overflow-y-auto">{children}</div>
    </div>
  )
}
