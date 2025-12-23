"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { type AIMode, setAIMode, getAIMode, restartSession } from "@/lib/utils/session"
import { ModeToggle } from "@/components/ui/mode-toggle" // Import ModeToggle component
import { FEATURES } from "@/lib/config/features" // Import feature flags

export function GlobalHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentMode, setCurrentMode] = useState<AIMode>("chat")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Read mode from URL
    const params = new URLSearchParams(window.location.search)
    const modeParam = params.get("aiMode") as AIMode | null
    const validModes: AIMode[] = ["takeover", "split", "chat"]
    const mode = modeParam && validModes.includes(modeParam) ? modeParam : getAIMode()
    setCurrentMode(mode)

    if (mode) {
      setAIMode(mode)
    }

    const savedMode = localStorage.getItem("clearpath_ai_mode")
    setIsDemoMode(savedMode === "demo")
  }, [])

  const handleModeChange = (mode: AIMode) => {
    console.log("[v0] GlobalHeader: Changing mode to:", mode)
    setAIMode(mode)
    setCurrentMode(mode)
    const params = new URLSearchParams(window.location.search)
    params.set("aiMode", mode)

    const newUrl = `${pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)

    window.dispatchEvent(new Event("urlchange"))

    console.log("[v0] GlobalHeader: URL updated to:", newUrl)
  }

  const handleToggleDemoMode = (checked: boolean) => {
    setIsDemoMode(checked)
    localStorage.setItem("clearpath_ai_mode", checked ? "demo" : "ai")
    window.dispatchEvent(new Event("ai-mode-change"))
  }

  const handleRestart = () => {
    restartSession()
    router.push("/")
    window.location.reload()
  }

  const handleNavigation = (path: string) => {
    const params = new URLSearchParams(window.location.search)
    const queryString = params.toString()
    router.push(queryString ? `${path}?${queryString}` : path)
  }

  const modeLabels: Record<AIMode, string> = {
    takeover: "AI Takeover",
    split: "Split Screen",
    chat: "Chat Bubble",
  }

  if (!isClient) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b shadow-sm bg-[var(--header-bg)] border-[var(--border-default)]">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--header-text)] tracking-tight">ClearPath Health</h1>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b shadow-sm bg-[var(--header-bg)] border-[var(--border-default)]">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-[var(--header-text)] tracking-tight">ClearPath Health</h1>
          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation("/")}
              className="text-[var(--header-text)] hover:bg-white/10 font-medium"
            >
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation("/providers")}
              className="text-[var(--header-text)] hover:bg-white/10 font-medium"
            >
              Find Providers
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation("/compare")}
              className="text-[var(--header-text)] hover:bg-white/10 font-medium"
            >
              Compare Plans
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-[var(--color-primary-dark)] border-0 font-semibold hover:bg-gray-50 transition-all shadow-sm"
              >
                {modeLabels[currentMode]}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              <DropdownMenuItem
                onClick={() => handleModeChange("takeover")}
                className="cursor-pointer bg-white hover:bg-gray-100 text-gray-900"
              >
                AI Takeover
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleModeChange("split")}
                className="cursor-pointer bg-white hover:bg-gray-100 text-gray-900"
              >
                Split Screen
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleModeChange("chat")}
                className="cursor-pointer bg-white hover:bg-gray-100 text-gray-900"
              >
                Chat Bubble
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            className="bg-red-500 text-white border-0 hover:bg-red-600 font-semibold shadow-sm transition-all"
          >
            Restart Session
          </Button>

          {FEATURES.SHOW_DEMO_MODE_TOGGLE && <ModeToggle checked={isDemoMode} onChange={handleToggleDemoMode} />}
        </div>
      </div>
    </header>
  )
}
