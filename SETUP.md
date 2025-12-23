# ClearPath Health Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   # .env.local
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.strategic-corp.com/webhook/clearpath-agent
   
   # Set to "true" for webhook mode, "false" for demo mode
   NEXT_PUBLIC_USE_WEBHOOK=false
   \`\`\`

## Configuration Options

### Demo Mode (Recommended for Testing)

For local development without n8n:
\`\`\`bash
NEXT_PUBLIC_USE_WEBHOOK=false
\`\`\`

The AI Assistant will use pre-configured Q&A from `lib/data/qa.json` with:
- Fuzzy question matching
- 10 sample healthcare questions
- Transparent "Demo Mode" indicator
- No external dependencies

### Webhook Mode (Production)

For production with n8n integration:
\`\`\`bash
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.strategic-corp.com/webhook/clearpath-agent
NEXT_PUBLIC_USE_WEBHOOK=true
\`\`\`

If webhook fails, automatically falls back to demo mode.

## Running Locally

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

## Building for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

## Deployment to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables: `NEXT_PUBLIC_N8N_WEBHOOK_URL` and `NEXT_PUBLIC_USE_WEBHOOK`
4. Deploy

## n8n Webhook Setup

1. In n8n, create a new workflow
2. Add "Webhook" trigger node
3. Set to POST method
4. Copy webhook URL
5. Paste into `NEXT_PUBLIC_N8N_WEBHOOK_URL`

Example workflow structure:
\`\`\`
Webhook → Extract Message → Call LLM → Return Response
\`\`\`

## Testing Paths

### AI Assistant - Demo Mode
- Set `NEXT_PUBLIC_USE_WEBHOOK=false`
- Navigate to `http://localhost:3000/ai`
- Ask: "Which plan has the highest deductible?"
- Verify "Demo Mode" badge appears
- Verify answer matches expected response

### AI Assistant - Webhook Mode
- Set `NEXT_PUBLIC_USE_WEBHOOK=true`
- Configure `NEXT_PUBLIC_N8N_WEBHOOK_URL`
- Navigate to `http://localhost:3000/ai`
- Send message and verify webhook receives request
- Test fallback by stopping n8n (should switch to demo mode)

### Guided Flow
- Navigate to `http://localhost:3000/guided`
- Complete questionnaire
- Verify recommendations display

### Provider Search
- Navigate to `http://localhost:3000/providers`
- Search for "Melissa Reed" - should return 1 result in Hutchinson, KS

### Plan Comparison
- Navigate to `http://localhost:3000/compare`
- Verify all 5 plans display in correct order

### Sessions
- Complete questionnaire
- Navigate away and back
- Verify state persists
- Click "Restart Session" to reset

## Troubleshooting

### Chat not working
- Verify environment variables are set correctly
- If using webhook mode, check `NEXT_PUBLIC_N8N_WEBHOOK_URL` is accessible
- Check browser console for errors
- Try demo mode: set `NEXT_PUBLIC_USE_WEBHOOK=false`

### Demo mode not matching questions
- Questions use fuzzy matching (similarity threshold: 0.3)
- Try questions from `lib/data/qa.json`
- Check browser console for matching scores
- Customize Q&A by editing `lib/data/qa.json`

### Styling issues
- Clear browser cache
- Verify CSS variables in `globals.css`
- Check Tailwind CSS is compiled

### State not persisting
- Verify sessionStorage is enabled in browser
- Clear sessionStorage and restart
- Check browser console for errors

## Customizing Demo Mode

To add more Q&A pairs for demo mode:

1. Edit `lib/data/qa.json`
2. Add new entries with:
   \`\`\`json
   {
     "id": 11,
     "question": "Your question here",
     "answer": "Your answer here",
     "plans": ["CP-ADVANCE-01"],
     "providers": ["prov-001"]
   }
   \`\`\`
3. Save and restart dev server
4. Test with similar phrasings

The fuzzy matching algorithm will find questions even if users don't use exact wording.

## File Structure Overview

Key files for customization:
- `lib/data/plans.json` - Add/modify plans
- `lib/data/providers.json` - Add/modify providers
- `app/globals.css` - Update colors/typography
- `lib/utils/scoring.ts` - Adjust recommendation algorithm
- `lib/utils/highlights.ts` - Modify highlight generation
