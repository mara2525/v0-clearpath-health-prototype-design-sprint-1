"use client"

import { create } from "zustand"

interface HighlightState {
  highlightedProviders: string[]
  highlightedPlans: string[]
  setHighlights: (providers: string[], plans: string[]) => void
  clearHighlights: () => void
  isProviderHighlighted: (providerId: string) => boolean
  isPlanHighlighted: (planId: string) => boolean
}

export const useHighlight = create<HighlightState>((set, get) => ({
  highlightedProviders: [],
  highlightedPlans: [],
  setHighlights: (providers: string[], plans: string[]) => {
    console.log("[v0] Setting highlights - Providers:", providers, "Plans:", plans)
    set({ highlightedProviders: providers, highlightedPlans: plans })
  },
  clearHighlights: () => {
    console.log("[v0] Clearing all highlights")
    set({ highlightedProviders: [], highlightedPlans: [] })
  },
  isProviderHighlighted: (providerId: string) => {
    return get().highlightedProviders.includes(providerId)
  },
  isPlanHighlighted: (planId: string) => {
    return get().highlightedPlans.includes(planId)
  },
}))
