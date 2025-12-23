import type { Plan } from "@/lib/utils/data"

export interface ScoringProfile {
  ageRange: string
  householdSize: string
  utilizationLevel: string // low, medium, high
  preferredProviders: string[] // provider IDs
  prescriptionNeeds: string // none, occasional, regular, heavy
}

export interface ScoringResult {
  planId: string
  score: number
  rank: "Good" | "Better" | "Best"
  metalTier: string
}

export function scorePlans(profile: ScoringProfile, plans: Plan[]): ScoringResult[] {
  const scored = plans.map((plan) => {
    let score = 100

    // Deductible scoring (lower is better for less frequent users)
    const deductible = (plan.deductible as any)?.single || 0
    if (profile.utilizationLevel === "low") {
      score += 30 - Math.min(deductible / 100, 30)
    } else if (profile.utilizationLevel === "medium") {
      score += 20 - Math.min(deductible / 100, 20)
    } else {
      score -= Math.min(deductible / 100, 15)
    }

    // OOP Max scoring (impacts high utilization)
    const oopMax = (plan.outOfPocketMax as any)?.single || 0
    if (profile.utilizationLevel === "high") {
      score += 25 - Math.min(oopMax / 500, 25)
    }

    // PCP visit copay
    const pcpVisit = plan.pcpOfficeVisit as any
    if (typeof pcpVisit === "number") {
      score += Math.max(30 - pcpVisit * 2, 0)
    }

    // Prescription benefits
    if (profile.prescriptionNeeds === "regular" || profile.prescriptionNeeds === "heavy") {
      const rxBenefits = (plan.rxBenefits as any) || {}
      if (rxBenefits.generic && typeof rxBenefits.generic === "number" && rxBenefits.generic < 15) {
        score += 20
      }
    }

    // Telehealth bonus (increasingly valued)
    if (plan.telehealth === 0) {
      score += 10
    }

    return { planId: plan.planId, score }
  })

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)

  // Assign ranks
  return scored.map((item, index) => {
    let rank: "Good" | "Better" | "Best"
    if (index === 0) {
      rank = "Best"
    } else if (index === 1) {
      rank = "Better"
    } else {
      rank = "Good"
    }

    return {
      ...item,
      rank,
      metalTier: getMetalTier(item.planId),
    }
  })
}

export function getMetalTier(planId: string): string {
  // Simplified metal tier assignment
  switch (planId) {
    case "CP-HDHP-02":
      return "Catastrophic"
    case "CP-STANDARD-03":
      return "Bronze"
    case "CP-ADVANCE-01":
    case "CP-ADVANCE-PLUS-04":
      return "Silver"
    case "CP-HIGH-05":
      return "Gold"
    default:
      return "Silver"
  }
}
