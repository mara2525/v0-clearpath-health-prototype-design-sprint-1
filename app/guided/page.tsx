"use client"

import { useState, useEffect } from "react"
import { Questionnaire } from "@/components/guided/questionnaire"
import { Recommendations } from "@/components/guided/recommendations"
import { scorePlans, type ScoringProfile, type ScoringResult } from "@/lib/utils/scoring"
import { plans } from "@/lib/utils/data"
import { getGuidedState, setGuidedState } from "@/lib/utils/session"

export default function GuidedPage() {
  const [step, setStep] = useState<"questionnaire" | "recommendations">("questionnaire")
  const [profile, setProfile] = useState<ScoringProfile | null>(null)
  const [recommendations, setRecommendations] = useState<ScoringResult[]>([])

  useEffect(() => {
    const savedState = getGuidedState()
    if (savedState) {
      setProfile(savedState.profile)
      setRecommendations(savedState.recommendations)
      setStep("recommendations")
    }
  }, [])

  const handleQuestionnaireComplete = (newProfile: ScoringProfile) => {
    const scored = scorePlans(newProfile, plans)
    setProfile(newProfile)
    setRecommendations(scored)
    setStep("recommendations")
    setGuidedState({ profile: newProfile, recommendations: scored })
  }

  const handleRestart = () => {
    setProfile(null)
    setRecommendations([])
    setStep("questionnaire")
    setGuidedState(null)
  }

  return (
    <main className="min-h-screen py-12" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="max-w-7xl mx-auto px-6">
        {step === "questionnaire" ? (
          <Questionnaire onComplete={handleQuestionnaireComplete} />
        ) : profile && recommendations.length > 0 ? (
          <Recommendations recommendations={recommendations} profile={profile} onRestart={handleRestart} />
        ) : null}
      </div>
    </main>
  )
}
