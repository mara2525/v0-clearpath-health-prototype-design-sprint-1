"use client"

import { useEffect, useState } from "react"
import { ChatBox } from "@/components/ai/chat-box"
import { Questionnaire } from "@/components/guided/questionnaire"
import { Recommendations } from "@/components/guided/recommendations"
import { scorePlans, type ScoringProfile, type ScoringResult } from "@/lib/utils/scoring"
import { plans } from "@/lib/utils/data"
import { setGuidedState, getAIMode } from "@/lib/utils/session"

export default function AIPage() {
  const [mode, setMode] = useState("chat")
  const [mounted, setMounted] = useState(false)
  const [showGuidedFlow, setShowGuidedFlow] = useState(false)
  const [guidedProfile, setGuidedProfile] = useState<ScoringProfile | null>(null)
  const [guidedRecommendations, setGuidedRecommendations] = useState<ScoringResult[]>([])

  useEffect(() => {
    setMounted(true)
    const urlParams = new URLSearchParams(window.location.search)
    const modeParam = urlParams.get("aiMode") || getAIMode()
    setMode(modeParam)
  }, [])

  const handleStartGuided = () => {
    setShowGuidedFlow(true)
  }

  const handleCompleteQuestionnaire = (profile: ScoringProfile) => {
    const scored = scorePlans(profile, plans)
    setGuidedProfile(profile)
    setGuidedRecommendations(scored)
    setGuidedState({ profile, recommendations: scored })
  }

  if (!mounted) {
    return (
      <main className="h-screen overflow-hidden" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-center">
          <div className="animate-pulse w-full">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    )
  }

  // Takeover Mode: AI occupies full screen
  if (mode === "takeover") {
    return (
      <main className="h-screen overflow-hidden" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="max-w-7xl mx-auto px-6 h-full py-6">
          <ChatBox />
        </div>
      </main>
    )
  }

  // Split Mode: AI on left, guided flow or comparison on right
  if (mode === "split") {
    return (
      <main className="h-screen overflow-hidden" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="max-w-7xl mx-auto px-6 h-full py-6">
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="overflow-hidden">
              <ChatBox />
            </div>
            <div className="overflow-y-auto pr-2">
              {showGuidedFlow ? (
                guidedProfile ? (
                  <Recommendations
                    recommendations={guidedRecommendations}
                    profile={guidedProfile}
                    onRestart={() => {
                      setShowGuidedFlow(false)
                      setGuidedProfile(null)
                      setGuidedRecommendations([])
                    }}
                  />
                ) : (
                  <Questionnaire onComplete={handleCompleteQuestionnaire} />
                )
              ) : (
                <div className="flex items-center justify-center h-full">
                  <button
                    onClick={handleStartGuided}
                    className="px-6 py-3 rounded-lg font-semibold"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-white)",
                    }}
                  >
                    Start Guided Flow
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Chat Bubble Mode: Chat in lower right corner
  return (
    <main className="min-h-screen py-12" style={{ backgroundColor: "var(--color-gray-light)" }}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ClearPath Health</h1>
          <p style={{ color: "var(--color-gray-text)" }}>
            Use the chat bubble in the bottom right to get personalized recommendations.
          </p>
        </div>

        <div className="space-y-8 mb-12">
          <div className="p-8 rounded-lg" style={{ backgroundColor: "var(--color-white)" }}>
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ul className="space-y-2" style={{ color: "var(--color-gray-text)" }}>
              <li>• Ask the AI assistant about plan recommendations</li>
              <li>• Search for doctors and specialists in our network</li>
              <li>• Compare plans side-by-side</li>
              <li>• Get answers to your health insurance questions</li>
            </ul>
          </div>
        </div>

        {/* Fixed chat bubble in bottom right */}
        <div
          className="fixed bottom-6 right-6 w-96 h-96 rounded-lg shadow-2xl z-40"
          style={{ backgroundColor: "var(--color-white)" }}
        >
          <ChatBox />
        </div>
      </div>
    </main>
  )
}
