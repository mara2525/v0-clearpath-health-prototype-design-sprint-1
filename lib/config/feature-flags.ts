/**
 * Feature flags for controlling visibility of UI components
 */
export const featureFlags = {
  // Controls visibility of "Talk to AI Assistant" and "Connect with an Advisor" buttons on home page
  showHomePageCTAButtons: false,
} as const

export type FeatureFlags = typeof featureFlags
