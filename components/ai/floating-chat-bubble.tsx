"use client"

import { MessageCircle } from "lucide-react"
import { setAIMode } from "@/lib/utils/session"
import { usePathname } from "next/navigation"

export function FloatingChatBubble() {
  const pathname = usePathname()

  const handleOpenSplitScreen = () => {
    setAIMode("split")
    const params = new URLSearchParams(window.location.search)
    params.set("aiMode", "split")
    const newUrl = `${pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)
    window.dispatchEvent(new Event("urlchange"))
  }

  return (
    <button
      onClick={handleOpenSplitScreen}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-shadow"
      style={{
        backgroundColor: "var(--color-accent)",
        color: "var(--color-white)",
      }}
      aria-label="Open AI assistant"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  )
}
