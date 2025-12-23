# ClearPath Health - Architecture Documentation

## System Overview

The ClearPath Health prototype is a client-side healthcare shopping assistant with support for dual decision paths and three distinct UI layouts. It operates entirely in the browser with optional integration to n8n for AI capabilities.

\`\`\`
┌─────────────────────────────────────────┐
│         ClearPath Health UI             │
├─────────────────────────────────────────┤
│  Global Header (Nav + Mode Selector)    │
├─────────────────────────────────────────┤
│                                         │
│  Mode: Takeover | Split | Chat Bubble  │
│  ├─ AI Assistant (ChatBox)             │
│  ├─ Guided Questionnaire               │
│  ├─ Provider Search                    │
│  ├─ Plan Comparison                    │
│  └─ Plan Details                       │
│                                         │
└─────────────────────────────────────────┘
        ↓ (state sync via URL)
┌─────────────────────────────────────────┐
│     Session Storage (Browser)           │
│  - Session UUID                         │
│  - AI Mode                              │
│  - Questionnaire State                  │
│  - Chat History                         │
└─────────────────────────────────────────┘
        ↓ (via webhook)
┌─────────────────────────────────────────┐
│         n8n Webhook                     │
│  - Receives messages + session ID       │
│  - Calls LLM with context               │
│  - Returns formatted response           │
└─────────────────────────────────────────┘
        ↓ (static JSON)
┌─────────────────────────────────────────┐
│    Plans & Providers Data               │
│  - 5 ClearPath Plans                    │
│  - 20 In-Network Providers              │
└─────────────────────────────────────────┘
\`\`\`

## Component Hierarchy

\`\`\`
RootLayout
├─ GlobalHeader
│  ├─ Navigation Links
│  ├─ Mode Dropdown
│  └─ Restart Button
└─ Page Routes
   ├─ Home (/)
   ├─ AI (/ai)
   │  ├─ ChatBox
   │  ├─ Questionnaire (Split/Split modes)
   │  └─ FloatingChatBubble (Chat mode)
   ├─ Guided (/guided)
   │  ├─ Questionnaire
   │  └─ Recommendations
   ├─ Providers (/providers)
   │  ├─ ProviderSearch
   │  └─ ProviderCard[]
   ├─ Provider Detail (/provider/[id])
   │  └─ ProviderDetails
   ├─ Compare (/compare)
   │  └─ PlanComparison
   │     └─ PlanColumn[]
   └─ Plan Detail (/plan-detail/[id])
      └─ PlanDetail
\`\`\`

## Data Flow

### Questionnaire to Recommendations
\`\`\`
User Input (Profile)
  ↓
scorePlans(profile, plans)
  ├─ Calculates score for each plan
  ├─ Sorts by score
  └─ Assigns rank (Best/Better/Good)
  ↓
Recommendations Display
  └─ Saved to sessionStorage
\`\`\`

### Provider Search Flow
\`\`\`
Search Query
  ↓
searchProviders(query)
  └─ Filters providers JSON
     ├─ Name match
     ├─ Specialty match
     └─ City match
  ↓
ProviderCard[] Display
  ↓
Click → ProviderDetails
  └─ Shows full info + accepted plans
\`\`\`

### Plan Highlights Flow
\`\`\`
Plan Object
  ↓
computeHighlights(plan)
  ├─ Checks deductible
  ├─ Checks preventive care
  ├─ Checks telehealth
  ├─ Checks prescriptions
  └─ Checks HSA eligibility
  ↓
Top 3 Highlights []
  └─ Used in cards + details
\`\`\`

### AI Chat Flow
\`\`\`
User Message
  ↓
addMessage('user', text)
  └─ Saved to sessionStorage
  ↓
sendMessageToAI(text)
  ├─ Fetches n8n webhook
  ├─ Sends: { session_id, message }
  └─ Receives: { response }
  ↓
addMessage('assistant', response)
  └─ Saved to sessionStorage
  ↓
ChatMessage Component
  └─ Rendered with formatting
\`\`\`

## State Management

### Session Storage Keys
\`\`\`javascript
// Session UUID (persists until restart)
clearpath_session_id: "uuid-v4-string"

// Current AI layout mode
clearpath_ai_mode: "takeover" | "split" | "chat"

// Questionnaire progress + results
clearpath_guided_state: {
  profile: ScoringProfile,
  recommendations: ScoringResult[]
}

// Chat message history
clearpath_chat_history: Message[]
\`\`\`

### State Persistence Strategy
\`\`\`
User Action → Update State
  ↓
  ├─ sessionStorage.setItem() for persistence
  ├─ URL query param update for mode
  └─ React state for UI updates
  ↓
User Navigates Away
  ↓
  ├─ sessionStorage persists
  ├─ URL preserved on back
  └─ State rehydrated on return
\`\`\`

## Type System

### Core Interfaces
\`\`\`typescript
// Plan with full benefit details
interface Plan {
  planId: string
  planName: string
  preventiveCare: string
  deductible: { single: number, family: number }
  outOfPocketMax: { single: number, family: number }
  // ... 20+ more benefit fields
}

// Provider with network info
interface Provider {
  providerId: string
  fullName: string
  specialty: string
  address: { line1, city, state, zip }
  phone: string
  acceptingPatients: boolean
  inNetwork: boolean
  rating: number | null
  plansAccepted: string[]
}

// User profile from questionnaire
interface ScoringProfile {
  ageRange: string
  householdSize: string
  utilizationLevel: string
  prescriptionNeeds: string
}

// Scored result
interface ScoringResult {
  planId: string
  score: number
  rank: 'Good' | 'Better' | 'Best'
  metalTier: string
}

// Chat message
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}
\`\`\`

## Utility Modules

### lib/utils/data.ts
- Plan and provider queries
- Search functions
- Data access helpers

### lib/utils/session.ts
- UUID generation and management
- Session storage operations
- Mode management

### lib/utils/ai.ts
- n8n webhook integration
- Chat message management
- Message persistence

### lib/utils/scoring.ts
- Plan scoring algorithm
- Rank assignment
- Metal tier classification

### lib/utils/highlights.ts
- Highlight computation
- Feature detection
- Presentation logic

## API Contract (n8n)

### Request
\`\`\`json
{
  "clearpath_session_id": "uuid-v4",
  "message": "user input text"
}
\`\`\`

### Response
\`\`\`json
{
  "response": "assistant message text"
}
\`\`\`

### Error Handling
- HTTP errors → "I encountered an error. Please try again later."
- Timeout → Same error message
- Invalid response → Same error message

## Query String Parameters

### URL: ?aiMode=value
- Valid values: `takeover`, `split`, `chat`
- Default: `chat`
- Invalid values → default
- Updates on dropdown change
- Preserved on navigation

## Performance Considerations

### Current Optimization
- Static JSON (no API calls except n8n)
- Client-side filtering (instant search)
- Session storage (no network for state)
- Component code splitting via Next.js

### Future Optimization Opportunities
- Image lazy loading (if added)
- Request memoization
- Infinite scroll for large datasets
- Service worker for offline support

## Testing Strategy

### Unit Testing
- Scoring algorithm edge cases
- Highlight computation
- Search filtering

### Integration Testing
- State persistence flows
- Navigation paths
- Mode switching

### E2E Testing
- Complete user journeys
- Form submissions
- Error scenarios

## Accessibility

### ARIA Considerations
- Buttons have proper roles
- Form labels associated
- Navigation semantic
- Color contrast sufficient

### Keyboard Navigation
- Tab order logical
- Focus visible
- Form submissions work
- Navigation accessible

## Browser Support

### Target
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Limitations
- sessionStorage required
- ES2020 JavaScript minimum
- No IE11 support

## Security Model

### Data Handling
- No personal data stored locally
- Session UUID for tracking only
- No authentication required
- Client-side validation only

### n8n Integration
- Webhook should validate origin
- Rate limiting recommended
- No sensitive data in logs

## Deployment Considerations

### Build Process
\`\`\`
npm install → TypeScript check → Next.js build
\`\`\`

### Environment Variables
- `NEXT_PUBLIC_N8N_WEBHOOK_URL` - public, sent from client

### Static Hosting
- Can deploy to any static host
- Requires Node.js runtime for Next.js
- Optimal: Vercel

## Future Architecture Enhancements

1. **Database Integration**
   - User accounts and saves
   - Recommendation history
   - Feedback collection

2. **API Layer**
   - Dynamic plan/provider data
   - Real-time availability
   - Eligibility calculations

3. **Real-time Updates**
   - WebSockets for multi-user
   - Live provider data
   - Dynamic pricing

4. **Mobile Support**
   - Responsive layout system
   - Touch-optimized components
   - Offline capabilities

5. **Analytics**
   - User journey tracking
   - A/B testing infrastructure
   - Recommendation effectiveness
