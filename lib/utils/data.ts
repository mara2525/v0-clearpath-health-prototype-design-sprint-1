import plansData from "@/lib/data/plans.json"
import providersData from "@/lib/data/providers.json"

export interface Plan {
  planId: string
  planName: string
  [key: string]: any
}

export interface Provider {
  providerId: string
  fullName: string
  specialty: string
  address: {
    line1: string
    city: string
    state: string
    zip: string
  }
  phone: string
  acceptingPatients: boolean
  inNetwork: boolean
  rating: number | null
  ratingCount: number
  virtualCareOffered: boolean
  plansAccepted: string[]
}

export const plans: Plan[] = plansData.plans
export const providers: Provider[] = providersData.providers

// Fixed plan order for comparisons
export const planOrder = ["CP-ADVANCE-01", "CP-HDHP-02", "CP-STANDARD-03", "CP-ADVANCE-PLUS-04", "CP-HIGH-05"]

export function getPlanById(planId: string): Plan | undefined {
  return plans.find((p) => p.planId === planId)
}

export function getProviderById(providerId: string): Provider | undefined {
  return providers.find((p) => p.providerId === providerId)
}

export function searchProviders(query: string): Provider[] {
  const lowerQuery = query.toLowerCase()
  return providers.filter(
    (p) =>
      p.fullName.toLowerCase().includes(lowerQuery) ||
      p.specialty.toLowerCase().includes(lowerQuery) ||
      p.address.city.toLowerCase().includes(lowerQuery),
  )
}

export function getProvidersByPlan(planId: string): Provider[] {
  return providers.filter((p) => p.plansAccepted.includes(planId))
}

export function getPlansForProvider(providerId: string): Plan[] {
  const provider = getProviderById(providerId)
  if (!provider) return []
  return provider.plansAccepted.map((id) => getPlanById(id)).filter(Boolean) as Plan[]
}

export function getDisplayName(planName: string): string {
  return planName.replace(/^ClearPath\s+/, "")
}
