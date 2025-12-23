/**
 * Feature flags for toggling application features on/off
 */
export const FEATURES = {
  // Show/hide the AI vs Demo Mode toggle in the header
  SHOW_DEMO_MODE_TOGGLE: false,
} as const

export type FeatureFlags = typeof FEATURES
