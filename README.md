# ClearPath Health Prototype — AI Assistant Chat

A healthcare plan shopping prototype with a persistent AI chat sidebar, plan comparison, provider search, and premium display. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Layout

The app uses a fixed split-screen layout. The AI chat panel occupies the left 25% of the screen, and the main content fills the remaining 75%. This layout persists across all pages — the chat is always visible.

A global header provides navigation (Home, Find Providers, Compare Plans) and a Restart Session button that clears all session state and returns to the home page.

## Pages

| Route | Description |
|---|---|
| `/` | Home page — hero section, 5-plan comparison grid, premium display, and links to providers/comparison |
| `/ai` | Standalone AI page with three layout modes (takeover, split, chat bubble) and optional guided questionnaire flow |
| `/providers` | Provider search — full-text search by name, specialty, or location |
| `/provider/[id]` | Individual provider detail page |
| `/compare` | Side-by-side plan comparison table |
| `/plan-detail/[id]` | Individual plan detail page |
| `/guided` | Guided questionnaire flow |
| `/certificate` | Certificate page |

## AI Chat

The chat panel (`ChatBox`) appears in the persistent left sidebar. Before any messages are sent, it displays **topic buttons** that let the user pick a conversation topic (e.g. "Who Needs Coverage?", "Budgeting", "Recommendation"). Each button sends a pre-written prompt to the AI.

The chat supports two modes:

### Webhook Mode (`NEXT_PUBLIC_USE_WEBHOOK=true`)
Sends a POST request to the n8n webhook at `NEXT_PUBLIC_N8N_WEBHOOK_URL` with an `X-App-Auth` header. Falls back to demo mode if the webhook fails.

**Example request:**
```json
{
  "clearpath_session_id": "7772c3d4-e5f6-4789-a012-b3c4d5e6f789",
  "message": "Give me the deductible on the Advance Plan"
}
```

**Example response:**
```json
{
  "question": "Give me the deductible on the Advance Plan",
  "answer": "The ClearPath Advance Plan has a $750 single and $1500 family deductible.",
  "plans": ["CP-ADVANCE-01"],
  "providers": [],
  "plan_matches": [
    {
      "planId": "CP-ADVANCE-01",
      "match_score": 100
    }
  ]
}
```

### Demo Mode (`NEXT_PUBLIC_USE_WEBHOOK=false`)
Matches user questions against pre-configured Q&A pairs in `lib/data/qa.json` using a word-overlap similarity algorithm. Suggests sample questions when no match is found. Shows a "Demo Mode" indicator in the chat.

### Private Mode
A toggle at the bottom of the chat panel. When enabled, displays a notice that no information will be stored. This is a client-side UI-only toggle stored in `localStorage`.

## Data

All data is static JSON — there is no database.

- **`lib/data/plans.json`** — 5 ClearPath plans with deductibles, copays, out-of-pocket maximums, Rx benefits, and coverage details
- **`lib/data/providers.json`** — 20 in-network providers with contact info, specialties, ratings, virtual care availability, and accepted plan IDs
- **`lib/data/premiums.json`** — 2026 premium rates (biweekly employed / monthly retired) for Self Only, Self Plus One, and Self and Family tiers
- **`lib/data/qa.json`** — 11 pre-configured Q&A pairs for demo mode, each with related plan and provider IDs
- **`lib/data/topics.json`** — 8 conversation topics shown as buttons in the chat panel before any messages

## Plans

| ID | Name |
|---|---|
| CP-ADVANCE-01 | ClearPath Advance |
| CP-HDHP-02 | ClearPath HDHP |
| CP-STANDARD-03 | ClearPath Standard |
| CP-ADVANCE-PLUS-04 | ClearPath Advance Plus |
| CP-HIGH-05 | ClearPath High |

Plan display order is fixed in the comparison views.

## Session Management

Session state is stored in `sessionStorage` (per-tab, cleared on tab close):
- Session UUID (sent with webhook requests)
- AI chat history
- Guided questionnaire state

The Restart Session button in the header clears all session state and reloads the page.

## Feature Flags

Two feature flag configs control UI visibility:

- **`lib/config/feature-flags.ts`** — `showHomePageCTAButtons` (default: `false`) — controls the "Talk to AI Assistant" and "Connect with an Advisor" buttons on the home hero
- **`lib/config/features.ts`** — `SHOW_DEMO_MODE_TOGGLE` (default: `false`) — controls the AI/Demo mode toggle in the header

## Environment Variables

```
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.strategic-corp.com/webhook/clearpath-agent
NEXT_PUBLIC_USE_WEBHOOK=true
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4, Radix UI primitives, Lucide icons
- **State**: Zustand (highlight state), sessionStorage (session data), localStorage (private mode, AI mode override)
- **Fonts**: Geist, Geist Mono
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`. Desktop browsers only — mobile responsiveness is out of scope.
