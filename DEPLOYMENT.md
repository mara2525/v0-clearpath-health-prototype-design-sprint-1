# ClearPath Health - Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] n8n webhook configured and tested
- [ ] Plans and providers JSON verified
- [ ] Session storage keys not conflicting
- [ ] No console errors in development
- [ ] Mobile fallback content added if needed

## Vercel Deployment

### 1. Connect GitHub Repository
\`\`\`bash
# Push code to GitHub
git push origin main
\`\`\`

### 2. Connect to Vercel
1. Go to vercel.com
2. Click "Add New Project"
3. Select your GitHub repository
4. Framework: Next.js (auto-detected)

### 3. Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

\`\`\`
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.strategic-corp.com/webhook/clearpath-agent
\`\`\`

### 4. Deploy
1. Click "Deploy"
2. Wait for build to complete (typically 2-3 minutes)
3. Verify deployment successful

### 5. Post-Deploy Testing
- Visit production URL
- Test all routes
- Verify n8n webhook working
- Check session storage
- Test mode switching

## Environment Setup

### Development
\`\`\`bash
npm install
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:3000/api/mock npm run dev
\`\`\`

### Production
Ensure `NEXT_PUBLIC_N8N_WEBHOOK_URL` points to live n8n instance.

## n8n Webhook Configuration

### Create Webhook
1. n8n Dashboard → New Workflow
2. Add "Webhook" trigger
3. Method: POST
4. Path: `/clearpath` (or your chosen path)
5. Response mode: "When last node finishes"

### Example Workflow
\`\`\`
Webhook Input
  ↓
Extract clearpath_session_id from body
  ↓
Extract message from body
  ↓
Call OpenAI/LLM with message + context
  ↓
Format response
  ↓
Return response as JSON
\`\`\`

### Response Format
Must return JSON:
\`\`\`json
{
  "response": "Your message here"
}
\`\`\`

## Monitoring

### Key Metrics to Track
- Page load time
- Chat response latency
- Session error rate
- Provider search performance
- n8n webhook uptime

### Error Logging
Consider adding error tracking:
- Sentry
- LogRocket
- Custom analytics

## Scaling Considerations

### Current Limitations
- Static JSON data (20 providers, 5 plans)
- Client-side only (no backend database)
- Session storage limited to browser

### Future Enhancements
- Add provider API integration
- Implement database for user saves
- Add authentication
- Mobile responsiveness
- Server-side rendering optimization

## DNS Setup

If using custom domain:
1. Add CNAME record to DNS provider
2. Point to vercel.net
3. Verify in Vercel Dashboard
4. SSL auto-generated

## Rollback Procedure

### If Deployment Issues
1. Vercel Dashboard → Deployments
2. Find previous stable deployment
3. Click "Redeploy"
4. System auto-reverts to previous version

## Security

### Best Practices Implemented
- No authentication required (per spec)
- Client-side data only
- Session storage (no cookies sent to server)
- HTTPS enforced by Vercel

### Considerations
- n8n webhook should validate requests
- Consider rate limiting on webhook
- Monitor for unusual usage patterns

## Troubleshooting Deployment

### Build Failures
- Check Node version (18+)
- Verify all dependencies installed
- Check for TypeScript errors

### Runtime Errors
- Check environment variables
- Verify JSON files valid
- Check browser console
- Verify n8n webhook accessible

### Performance Issues
- Enable Vercel Analytics
- Check waterfall chart
- Optimize images if added
- Consider caching strategies
