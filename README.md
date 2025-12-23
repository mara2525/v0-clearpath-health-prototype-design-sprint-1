# ClearPath Health AI Prototype

An intelligent healthcare shopping guidance prototype supporting dual-path decision-making with AI and guided questionnaire flows.

## Features

### Dual Decision Paths
- **AI Assistant**: Conversational guidance via n8n webhook integration
- **Guided Questionnaire**: Multi-step form with intelligent plan scoring
- Both paths always available simultaneously
- Session persistence across navigation

### Three AI Layout Modes
1. **AI Takeover**: Full-screen chat interface
2. **Split Screen**: AI chat + guided flow side-by-side
3. **Chat Bubble**: Floating chat in bottom right corner

Mode selection via:
- URL query parameter: `?aiMode=takeover|split|chat`
- Dropdown selector in global header
- Automatic sync between URL and UI

### Provider Search
- Full-text search by name, specialty, location
- Provider detail pages with plan compatibility
- Placeholder hint: "Melissa Reed in Hutchinson, KS"
- Network status and rating information

### Plan Comparison
- Fixed 5-plan order (enforced)
- Side-by-side comparison with highlights
- Coverage comparison table
- Individual plan detail pages
- Metallic tier classification

### Scoring & Highlights
- Non-financial questionnaire (age, household size, utilization, prescriptions)
- Intelligent plan scoring based on profile
- Automatic highlight generation (top 3 per plan)
- Good/Better/Best ranking system

### Session Management
- Session UUID per browser (stored in sessionStorage)
- Questionnaire progress persistence
- AI chat history persistence
- Global "Restart Session" button clears all state

## Project Structure

\`\`\`
app/
  ├── page.tsx                 # Home screen with entry points
  ├── layout.tsx              # Root layout with global header
  ├── ai/page.tsx             # AI assistant with three-mode support
  ├── guided/page.tsx         # Guided questionnaire flow
  ├── providers/page.tsx      # Provider search
  ├── provider/[id]/page.tsx  # Provider detail
  ├── compare/page.tsx        # Plan comparison
  ├── plan-detail/[id]/page.tsx # Individual plan details

components/
  ├── layout/
  │   ├── global-header.tsx   # Navigation + mode selector + restart
  ├── ai/
  │   ├── chat-box.tsx        # Main chat interface
  │   ├── chat-message.tsx    # Message rendering
  │   ├── chat-input.tsx      # Input field
  │   └── starter-prompts.tsx # Initial suggestion chips
  ├── guided/
  │   ├── questionnaire.tsx   # Multi-step form
  │   └── recommendations.tsx # Results display
  ├── providers/
  │   ├── provider-search.tsx # Search interface
  │   ├── provider-card.tsx   # Result card
  │   └── provider-details.tsx # Detail view
  ├── comparison/
  │   ├── plan-comparison.tsx # Main comparison view
  │   └── plan-column.tsx     # Individual plan column
  └── plans/
      └── plan-detail.tsx     # Plan detail view

lib/
  ├── data/
  │   ├── plans.json          # Plan benefit data
  │   ├── providers.json      # Provider directory
  │   └── qa.json             # Pre-configured Q&A pairs for demo mode
  └── utils/
      ├── data.ts             # Data access functions
      ├── session.ts          # Session + UUID management
      ├── ai.ts               # Chat & n8n integration
      ├── scoring.ts          # Plan scoring logic
      └── highlights.ts       # Plan highlights engine
\`\`\`

## Environment Variables

Required for AI Assistant:
\`\`\`
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.strategic-corp.com/webhook/clearpath-agent
NEXT_PUBLIC_USE_WEBHOOK=false
\`\`\`

### AI Assistant Modes

The AI Assistant supports two operational modes:

1. **Webhook Mode** (`NEXT_PUBLIC_USE_WEBHOOK=true`)
   - Sends messages to n8n webhook
   - Requires `NEXT_PUBLIC_N8N_WEBHOOK_URL` to be configured
   - Falls back to demo mode automatically if webhook fails

2. **Demo Mode** (`NEXT_PUBLIC_USE_WEBHOOK=false`)
   - Uses pre-configured Q&A from `lib/data/qa.json`
   - Fuzzy matching algorithm finds best answers
   - Shows "Demo Mode" indicator in chat
   - No external dependencies required

When in demo mode or webhook fallback, the assistant:
- Matches user questions against 10 pre-configured Q&A pairs
- Uses similarity scoring for fuzzy matching
- Suggests available questions when no match is found
- Displays transparent "Demo Mode" badge

## Data Specifications

### Plans JSON
Contains 5 ClearPath plans:
- ClearPath Advance (CP-ADVANCE-01)
- ClearPath HDHP (CP-HDHP-02)
- ClearPath Standard (CP-STANDARD-03)
- ClearPath Advance Plus (CP-ADVANCE-PLUS-04)
- ClearPath High (CP-HIGH-05)

Fixed order enforced in comparisons.

### Providers JSON
20 in-network providers with:
- Contact information
- Specialty and ratings
- Virtual care availability
- Accepted plan IDs
- Patient acceptance status

### Q&A JSON
Contains 10 pre-configured question-answer pairs for demo mode:
- Plan deductible comparisons
- Coverage details (telehealth, maternity, dental)
- HSA eligibility
- Provider recommendations
- Cost optimization guidance

Each entry includes:
- Question text for matching
- Detailed answer
- Related plan IDs
- Related provider IDs

## n8n Webhook Contract

All requests to the webhook include:
\`\`\`json
{
  "clearpath_session_id": "<uuid_v4>",
  "message": "<user_input>"
}
\`\`\`

Expected response:
\`\`\`json
{
  "response": "<assistant_message>"
}
\`\`\`

## Questionnaire Scoring

Profile inputs:
- Age range (18-25 through 65+)
- Household size (1-5+ people)
- Utilization level (low, medium, high)
- Prescription needs (none, occasional, regular, heavy)

Scoring factors:
- Deductible (lower better for frequent users)
- OOP maximum (impacts high-utilization scenarios)
- PCP copay (accessibility)
- Prescription tier pricing
- Telehealth availability
- HSA eligibility

## Design System

Color Palette:
- Primary Dark: #00172F
- Accent: #4C728A
- White: #FFFFFF
- Gray (light): #F5F5F5
- Gray (text): #7A868F
- Gray (dark): #1F2832

All colors defined as CSS variables in `globals.css`.

## Desktop-Only

This prototype is designed for desktop browsers only. Mobile responsiveness is out of scope.

## Key Capabilities Tested

✓ Both decision paths operate independently and in parallel
✓ Mode switching via dropdown and URL without state loss
✓ Provider search with example working (Melissa Reed)
✓ Plan comparison with fixed 5-plan ordering
✓ Questionnaire scoring produces ranked recommendations
✓ Session state persists across navigation
✓ Restart Session clears all state
✓ n8n webhook integration ready
✓ Chat history maintained across sessions
✓ All three AI layout modes functional
✓ AI Assistant operates in both Webhook and Demo modes

## Notes for n8n Workflow

The n8n webhook should:
1. Receive the session ID and user message
2. Log interactions for A/B testing
3. Call the LLM with system prompt for healthcare guidance
4. Enforce data constraints (LLM cannot invent plans/providers)
5. Return structured responses for plan/provider recommendations
6. Support commands like "find providers", "compare plans", etc.

Example system prompt:
\`\`\`
You are a helpful healthcare insurance assistant for ClearPath Health.
- You help users find the right health insurance plan
- You can search and recommend providers
- You can compare plans based on cost, coverage, and user preferences
- You must ONLY reference plans and providers from the provided data
- You cannot invent or hallucinate plan names or provider information
- Tone: helpful, concierge-like, trustworthy

\`\`\`

## Demo Mode Testing

To test demo mode without n8n:
1. Set `NEXT_PUBLIC_USE_WEBHOOK=false`
2. Navigate to AI Assistant
3. Try these sample questions:
   - "Which plan has the highest deductible?"
   - "Which plans have zero-cost telehealth?"
   - "Which plan is best for someone who wants an HSA?"
   - "Which plans include dental benefits?"

The AI will match your question and return the pre-configured answer with "Demo Mode" indicator visible.
