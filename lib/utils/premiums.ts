import premiumsData from "@/lib/data/premiums.json"

export interface PremiumRates {
  biweeklyEmployed: number
  monthlyRetired: number
}

export interface PremiumData {
  year: number
  premiums: {
    selfOnly: Record<string, PremiumRates>
    selfPlusOne: Record<string, PremiumRates>
    selfAndFamily: Record<string, PremiumRates>
  }
}

export const premiums: PremiumData = premiumsData

export type CoverageType = "selfOnly" | "selfPlusOne" | "selfAndFamily"
export type EmploymentStatus = "employed" | "retired"

export function getPremiumForPlan(
  planId: string,
  coverageType: CoverageType,
  employmentStatus: EmploymentStatus,
): number | null {
  const planPremiums = premiums.premiums[coverageType]?.[planId]
  if (!planPremiums) return null

  return employmentStatus === "employed" ? planPremiums.biweeklyEmployed : planPremiums.monthlyRetired
}

export function formatPremium(amount: number, employmentStatus: EmploymentStatus): string {
  const frequency = employmentStatus === "employed" ? "biweekly" : "monthly"
  return `$${amount.toFixed(2)} ${frequency}`
}
