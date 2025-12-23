# AI Response Highlighting System

## Overview

The ClearPath Health prototype now includes a dynamic highlighting system that visually emphasizes providers, plans, and premiums mentioned in AI chat responses. This helps users quickly identify relevant information across the application.

## How It Works

### 1. Global State Management

**File:** `hooks/use-highlight.ts`

Uses Zustand for lightweight, React-based state management:

\`\`\`typescript
- highlightedProviders: string[] // Array of provider IDs
- highlightedPlans: string[] // Array of plan IDs
- setHighlights(providers, plans) // Updates highlights
- clearHighlights() // Clears all highlights
- isProviderHighlighted(id) // Checks if provider is highlighted
- isPlanHighlighted(id) // Checks if plan is highlighted
\`\`\`

### 2. AI Response Processing

**File:** `lib/utils/ai.tsx`

When the AI responds (either via webhook or demo mode):
1. Extracts provider and plan IDs from the response JSON
2. Calls `useHighlight.getState().setHighlights(providers, plans)`
3. Previous highlights are automatically cleared when new ones are set

**Response Format Expected:**
\`\`\`json
{
  "question": "tell me which plans...",
  "answer": "Here are the plans...",
  "plans": ["CP-ADVANCE-01", "CP-STANDARD-03"],
  "providers": ["prov-009", "prov-014"]
}
\`\`\`

### 3. Component Integration

All components that display providers or plans now check the highlight state:

#### Provider Components
- **ProviderCard** (`components/providers/provider-card.tsx`)
  - Checks `isProviderHighlighted(provider.providerId)`
  - Applies visual highlighting styles

#### Plan Components
- **PlanColumn** (`components/comparison/plan-column.tsx`)
  - Used on home page and comparison page
  - Checks `isPlanHighlighted(plan.planId)`

- **PremiumDisplay** (`components/premiums/premium-display.tsx`)
  - Shows premium rates for all plans
  - Highlights plans mentioned in chat

- **Recommendations** (`components/guided/recommendations.tsx`)
  - Shows guided quiz results
  - Also respects chat highlights

### 4. Visual Styling

**File:** `app/globals.css`

Added a pulsing animation that runs 3 times when an item is highlighted:

\`\`\`css
@keyframes pulse-highlight {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.95;
  }
}

.animate-pulse-highlight {
  animation: pulse-highlight 2s ease-in-out 3;
}
\`\`\`

**Highlighted items receive:**
- Light blue background: `rgba(76, 114, 138, 0.08)`
- Thicker accent border: `3px solid var(--color-accent)`
- Outer glow: `box-shadow: 0 0 0 2px rgba(76, 114, 138, 0.2)`
- Pulse animation for 6 seconds (3 pulses × 2s each)

## Behavior

### Automatic Clearing
- Each new AI response automatically clears previous highlights
- Only the most recent response's providers/plans are highlighted
- Ensures users' attention is drawn to the latest relevant information

### Cross-Page Persistence
- Highlights persist as users navigate between pages
- If user asks "which plans cover these providers?" on the providers page, then navigates to the compare page, those plans remain highlighted
- Highlights only clear on the next AI response

### Response Types That Trigger Highlights

1. **Provider queries** - Returns provider IDs
2. **Plan queries** - Returns plan IDs  
3. **Combined queries** - Returns both
4. **Premium/pricing queries** - May include plan IDs

## Testing

### Demo Mode Testing

Try these test questions (from `lib/data/qa.json`):

1. "tell me which plans the previous providers are on"
   - Should highlight specific plans mentioned
   
2. "Find me cardiologists in Hutchinson, KS"
   - Should highlight returned providers

3. "Compare ClearPath Advance and ClearPath Standard"
   - Should highlight both plans

### Webhook Mode Testing

When connected to the n8n webhook, the system expects:
\`\`\`json
{
  "answer": "Response text...",
  "providers": ["prov-id-1", "prov-id-2"],
  "plans": ["CP-ADVANCE-01", "CP-HIGH-05"]
}
\`\`\`

## Files Modified

1. `hooks/use-highlight.ts` - NEW: Global state management
2. `lib/utils/ai.tsx` - Updated: Extract and set highlights from responses
3. `components/providers/provider-card.tsx` - Updated: Check and apply highlights
4. `components/comparison/plan-column.tsx` - Updated: Check and apply highlights
5. `components/premiums/premium-display.tsx` - Updated: Check and apply highlights
6. `components/guided/recommendations.tsx` - Updated: Check and apply highlights
7. `app/globals.css` - Updated: Added pulse-highlight animation

## Future Enhancements

Potential improvements:
- Add highlight duration setting (currently 3 pulses)
- Add manual highlight clearing button
- Add highlight history/replay
- Support highlighting specific premium tiers
- Add audio cue for accessibility
- Support highlighting plan features/benefits in detail views
