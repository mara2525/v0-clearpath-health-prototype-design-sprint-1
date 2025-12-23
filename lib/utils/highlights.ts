import type { Plan } from "@/lib/utils/data"

export interface PlanHighlight {
  planId: string
  highlights: string[]
  lowDeductible: boolean
  lowPremium: boolean
  coverageBreadth: boolean
  prescriptionValue: boolean
}

export function computeHighlights(plan: Plan): string[] {
  const highlights: string[] = []
  const deductible = (plan.deductible as any)?.single || 0
  const oopMax = (plan.outOfPocketMax as any)?.single || 0

  // Low deductible highlight
  if (deductible <= 500) {
    highlights.push("Low Deductible")
  }

  // Zero cost preventive care
  if (plan.preventiveCare === "$0") {
    highlights.push("Free Preventive Care")
  }

  // Good telehealth coverage
  if (plan.telehealth === 0) {
    highlights.push("Free Telehealth")
  }

  // Good prescription coverage
  const rxBenefits = (plan.rxBenefits as any) || {}
  if (typeof rxBenefits.generic === "number" && rxBenefits.generic <= 10) {
    highlights.push("Affordable Generics")
  }

  // Low PCP visit
  const pcpVisit = plan.pcpOfficeVisit as any
  if (typeof pcpVisit === "number" && pcpVisit <= 20) {
    highlights.push("Low PCP Copay")
  }

  // HSA eligibility
  if ((plan as any).hsaContribution) {
    highlights.push("HSA-Eligible")
  }

  // High out-of-pocket max (good for healthy)
  if (oopMax <= 6000) {
    highlights.push("Controlled Out-of-Pocket")
  }

  return highlights.slice(0, 3) // Return top 3
}

export function getPlanHighlights(plan: Plan): PlanHighlight {
  const highlights = computeHighlights(plan)
  const deductible = (plan.deductible as any)?.single || 0
  const oopMax = (plan.outOfPocketMax as any)?.single || 0

  return {
    planId: plan.planId,
    highlights,
    lowDeductible: deductible <= 500,
    lowPremium: false, // Would need premium data
    coverageBreadth: oopMax <= 8000,
    prescriptionValue: (plan.rxBenefits as any)?.generic <= 10,
  }
}
