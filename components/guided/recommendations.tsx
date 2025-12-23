"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ScoringResult, ScoringProfile } from "@/lib/utils/scoring"
import { getPlanById } from "@/lib/utils/data"
import { useHighlight } from "@/hooks/use-highlight"

interface RecommendationsProps {
  recommendations: ScoringResult[]
  profile: ScoringProfile
  onRestart: () => void
}

export function Recommendations({ recommendations, profile, onRestart }: RecommendationsProps) {
  const router = useRouter()
  const isPlanHighlighted = useHighlight((state) => state.isPlanHighlighted)

  const getRankColor = (rank: "Good" | "Better" | "Best"): string => {
    switch (rank) {
      case "Best":
        return "var(--color-accent)"
      case "Better":
        return "#7A868F"
      default:
        return "var(--color-gray-base)"
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Your Recommendations</h2>
        <p style={{ color: "var(--color-gray-text)" }}>
          Based on your profile: {profile.utilizationLevel} utilization, {profile.prescriptionNeeds} prescription needs
        </p>
      </div>

      <div className="space-y-6">
        {recommendations.map((rec, idx) => {
          const plan = getPlanById(rec.planId)
          if (!plan) return null

          const isHighlighted = isPlanHighlighted(rec.planId)

          return (
            <Card
              key={rec.planId}
              className={`p-6 border-2 hover:shadow-lg transition-all cursor-pointer ${isHighlighted ? "animate-pulse-highlight" : ""}`}
              onClick={() => router.push(`/plan-detail/${rec.planId}`)}
              style={{
                borderColor: isHighlighted ? "var(--color-accent)" : getRankColor(rec.rank),
                borderWidth: isHighlighted ? "3px" : "2px",
                backgroundColor:
                  rec.rank === "Best" || isHighlighted ? "rgba(76, 114, 138, 0.05)" : "var(--color-white)",
                boxShadow: isHighlighted ? "0 0 0 2px rgba(76, 114, 138, 0.2)" : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{plan.planName}</h3>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: getRankColor(rec.rank),
                        color: "var(--color-white)",
                      }}
                    >
                      {rec.rank}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: "var(--color-gray-light)",
                        color: "var(--color-gray-dark)",
                      }}
                    >
                      {rec.metalTier}
                    </span>
                  </div>
                  <p style={{ color: "var(--color-gray-text)" }}>Match Score: {rec.score}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Deductible</p>
                  <p className="text-lg font-semibold">${(plan.deductible as any)?.single || 0}</p>
                </div>
                <div>
                  <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>PCP Visit</p>
                  <p className="text-lg font-semibold">${plan.pcpOfficeVisit}</p>
                </div>
                <div>
                  <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Out-of-Pocket Max</p>
                  <p className="text-lg font-semibold">${(plan.outOfPocketMax as any)?.single || 0}</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                style={{
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent)",
                }}
              >
                View Details
              </Button>
            </Card>
          )
        })}
      </div>

      <div className="flex gap-4 justify-center mt-8">
        <Button variant="outline" onClick={onRestart}>
          Retake Questionnaire
        </Button>
        <Button
          onClick={() => router.push("/compare")}
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-white)",
          }}
        >
          Compare All Plans
        </Button>
      </div>
    </div>
  )
}
