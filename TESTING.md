# ClearPath Health - Testing Guide

## Quick Start Testing

### 1. Home Page
- Navigate to `http://localhost:3000`
- Verify 4 entry cards display
- Test clicking each card navigates correctly

### 2. AI Assistant Path

#### Takeover Mode (`?aiMode=takeover`)
\`\`\`
http://localhost:3000/ai?aiMode=takeover
\`\`\`
- Chat box should fill most of screen
- Starter prompts visible on first load
- Send a test message (requires n8n webhook configured)
- Type: "What's the best plan for frequent doctor visits?"

#### Split Mode (`?aiMode=split`)
\`\`\`
http://localhost:3000/ai?aiMode=split
\`\`\`
- Left side: Chat interface
- Right side: "Start Guided Flow" button
- Click "Start Guided Flow" to show questionnaire in right panel
- Chat history persists when switching

#### Chat Bubble Mode (`?aiMode=chat`)
\`\`\`
http://localhost:3000/ai?aiMode=chat
\`\`\`
- Page displays informational content
- Chat bubble appears in bottom right
- Click bubble to expand/collapse
- Chat persists when collapsed

#### Mode Switching
- Click dropdown in header to change modes
- URL should update automatically
- No state loss during mode switch

### 3. Guided Questionnaire Path
\`\`\`
http://localhost:3000/guided
\`\`\`
- Step through 4 questions (age, household, utilization, prescriptions)
- Progress bar updates
- Back/Next buttons work
- Next button disabled until selection made
- After final step, recommendations display with rankings

#### Verify Scoring
- Select "low" utilization → plan with lower deductible should rank higher
- Select "regular" prescriptions → plan with good Rx coverage should rank higher
- Change selections → recommendations should update

### 4. Provider Search
\`\`\`
http://localhost:3000/providers
\`\`\`

#### Test Cases
- Search "Melissa Reed" → should find 1 provider in Hutchinson, KS
- Search "Hutchinson" → multiple results
- Search "Family Practice" → multiple results
- Search "nonexistent" → no results message
- Click provider card → navigate to detail page

#### Provider Detail
- Shows full contact information
- Displays rating and review count
- Lists all accepted plans
- "View Network Providers" button functional

### 5. Plan Comparison
\`\`\`
http://localhost:3000/compare
\`\`\`

#### Verify Fixed Order
Plans should appear in this exact order:
1. ClearPath Advance
2. ClearPath HDHP
3. ClearPath Standard
4. ClearPath Advance Plus
5. ClearPath High

#### Verify Highlights
- Each plan shows top 3 highlights
- Examples: "Low Deductible", "Free Preventive Care", "Free Telehealth"
- Highlighting logic consistent

#### Coverage Table
- All 5 plans display side-by-side
- Rows: Preventive Care, ER, Urgent Care, Mental Health, Generic Rx
- Data matches JSON files

#### Plan Details
- Click "View Details" on any plan
- Shows full plan information
- Network providers count displays
- Navigation buttons work

### 6. Session Management

#### Test State Persistence
1. Navigate to `/guided`
2. Complete questionnaire
3. Note the recommendations displayed
4. Navigate to `/compare`
5. Navigate back to `/guided`
6. **Verify**: Same recommendations display (state persisted)

#### Test Restart Session
1. Complete questionnaire or start chat
2. Click "Restart Session" in header
3. **Verify**: 
   - Chat history cleared
   - Questionnaire reset
   - Session UUID regenerated
   - Returned to home page

#### Test Session UUID
- Open browser DevTools → Application → Session Storage
- On first visit, should see `clearpath_session_id` key
- UUID should persist across navigation
- After "Restart Session", UUID should be deleted then recreated on reload

### 7. Navigation Testing

#### Global Header
- All nav links functional
- Active page styling works
- Mode dropdown persists across navigation
- Restart Session button accessible everywhere

#### Cross-Flow Navigation
- From AI → click "Guided Flow" → questionnaire loads
- From Guided → click "Restart Session" → home page
- From Compare → click provider link → works correctly
- Ensure no dead links

### 8. Design & Styling

#### Color Consistency
- Primary dark (#00172F): Header background
- Accent (#4C728A): Buttons, highlights, links
- Gray palette: Text hierarchy, borders
- All colors from CSS variables

#### Typography
- Headings: Bold, large
- Body text: Clear, readable
- Form labels: Consistent sizing

#### Responsive Behavior
- Desktop (1200px+): All features visible
- Tablet/Mobile: Note that app is desktop-only per spec
- Chat bubble on mobile: Should still work

### 9. Form Validation

#### Questionnaire
- Cannot proceed without answering question
- Back button disabled on first question
- Progress bar accurate

#### Chat Input
- Cannot send empty message
- Send button disabled with empty input
- Loading state shows during request

### 10. Error Handling

#### Missing n8n Webhook
- Chat submits but shows error after timeout
- Error message clear and actionable
- App doesn't crash

#### Invalid Plan ID
- Navigate to `/plan-detail/invalid-id`
- Shows "Plan Not Found" message
- Navigation options provided

#### Invalid Provider ID
- Navigate to `/provider/invalid-id`
- Shows "Provider Not Found" message
- Navigation options provided

## Automated Testing Checklist

- [ ] All routes accessible
- [ ] No console errors
- [ ] Session storage working
- [ ] Mode switching smooth
- [ ] Questionnaire scoring correct
- [ ] Provider search accurate (Melissa Reed returns 1 result)
- [ ] Plan order fixed in comparisons
- [ ] Highlights generate properly
- [ ] n8n webhook contract met
- [ ] All navigation links work
- [ ] Restart Session works
- [ ] State persists across navigation
- [ ] All three AI modes render correctly
- [ ] Metadata renders correctly
- [ ] No missing dependencies

## Manual Testing Scenarios

### Scenario 1: First-Time User (AI Path)
1. Visit home
2. Click "AI Assistant"
3. Select Split mode from dropdown
4. Ask "What plan is best for me?"
5. Click "Start Guided Flow" on right
6. Complete questionnaire
7. Verify recommendations appear
8. Ask AI follow-up questions

### Scenario 2: Provider-Focused User
1. Visit home
2. Click "Find Providers"
3. Search "Melissa Reed"
4. Click result
5. Scroll plan list
6. Click plan → detail page
7. Back to provider → detail page preserved

### Scenario 3: Plan Comparison Focus
1. Visit home
2. Click "Compare Plans"
3. Scroll through all 5 plans
4. Click plan detail
5. Verify fixed order maintained
6. Navigate back

### Scenario 4: Mode Testing
1. Start in Chat Bubble mode
2. Send message
3. Switch to Split
4. Verify chat history present
5. Switch to Takeover
6. Verify chat history present
7. Switch back to Chat Bubble

## Performance Checks

- Initial page load < 2s
- Navigation smooth (no lag)
- Chat responsive to input
- Search results instant (static data)
- Mode switching immediate
