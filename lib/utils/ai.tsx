import { getSessionId, getChatHistory, setChatHistory } from "@/lib/utils/session"
import { getProviderById, getPlanById } from "@/lib/utils/data"
import qaData from "@/lib/data/qa.json"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export interface AIMode {
  isDemo: boolean
  useWebhook: boolean
}

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || ""

function shouldUseWebhook(): boolean {
  // Check if we're in browser
  if (typeof window === "undefined") {
    // Server-side: use env variable
    const value = (process.env.NEXT_PUBLIC_USE_WEBHOOK || "").toLowerCase()
    return value === "true" || value === "yes" || value === "1"
  }

  // Client-side: check localStorage override first
  const localMode = localStorage.getItem("clearpath_ai_mode")
  if (localMode === "demo") {
    return false // Force demo mode
  } else if (localMode === "ai") {
    return true // Force AI mode
  }

  // Fall back to environment variable
  const value = (process.env.NEXT_PUBLIC_USE_WEBHOOK || "").toLowerCase()
  return value === "true" || value === "yes" || value === "1"
}

export function getCurrentMode(): boolean {
  return !shouldUseWebhook()
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()

  // Exact match
  if (s1 === s2) return 1.0

  // Contains match
  if (s1.includes(s2) || s2.includes(s1)) return 0.8

  // Word overlap scoring
  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)
  const commonWords = words1.filter((w) => words2.includes(w) && w.length > 3)

  if (commonWords.length === 0) return 0

  const overlapRatio = (2 * commonWords.length) / (words1.length + words2.length)
  return overlapRatio
}

function findBestMatch(
  userQuestion: string,
): { answer: string; confidence: number; providers: string[]; plans: string[] } | null {
  let bestMatch = null
  let bestScore = 0

  console.log("[v0] Searching for match in", qaData.testQuestions.length, "questions")
  console.log("[v0] User question:", userQuestion)

  for (const qa of qaData.testQuestions) {
    const score = calculateSimilarity(userQuestion, qa.question)
    console.log("[v0] Comparing with:", qa.question, "- Score:", score)

    if (score > bestScore && score > 0.3) {
      bestScore = score
      bestMatch = qa
    }
  }

  if (bestMatch) {
    console.log("[v0] Best match found:", bestMatch.question, "- Score:", bestScore)
    return {
      answer: bestMatch.answer,
      confidence: bestScore,
      providers: bestMatch.providers || [],
      plans: bestMatch.plans || [],
    }
  }

  console.log("[v0] No match found")
  return null
}

function formatResponseWithDetails(answer: string, providerIds: string[], planIds: string[]): string {
  let formattedResponse = answer

  if (providerIds && providerIds.length > 0) {
    const providerDetails = providerIds
      .map((id) => {
        const provider = getProviderById(id)
        if (provider) {
          return `• <a href="/provider/${id}">${provider.fullName}</a> - ${provider.specialty} (${provider.address.city}, ${provider.address.state})`
        }
        return null
      })
      .filter(Boolean)

    if (providerDetails.length > 0) {
      formattedResponse += "\n\nProviders:\n" + providerDetails.join("\n")
    }
  }

  if (planIds && planIds.length > 0) {
    const planDetails = planIds
      .map((id) => {
        const plan = getPlanById(id)
        if (plan) {
          return `• <a href="/plan-detail/${id}">${plan.planName}</a>`
        }
        return null
      })
      .filter(Boolean)

    if (planDetails.length > 0) {
      formattedResponse += "\n\nRelated Plans:\n" + planDetails.join("\n")
    }
  }

  return formattedResponse
}

function getNoMatchResponse(): string {
  const sampleQuestions = qaData.testQuestions.slice(0, 3).map((qa) => qa.question)
  return `I don't have information on that specific question yet. Here are some questions I can help with:\n\n${sampleQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
}

function extractResponseMetadata(data: any): { providers: string[]; plans: string[]; premiums?: boolean } {
  const providers = data.providers || []
  const plans = data.plans || []
  // Check if response mentions premiums/pricing
  const premiums = data.premiums || (data.answer && data.answer.toLowerCase().includes("premium"))

  console.log("[v0] Extracted metadata - Providers:", providers, "Plans:", plans, "Premiums:", premiums)

  return { providers, plans, premiums }
}

export async function sendMessageToAI(userMessage: string): Promise<{ response: string; isDemo: boolean }> {
  const sessionId = getSessionId()
  const USE_WEBHOOK = shouldUseWebhook()

  console.log("[v0] sendMessageToAI called with:", userMessage)
  console.log("[v0] USE_WEBHOOK:", USE_WEBHOOK, "N8N_WEBHOOK_URL:", N8N_WEBHOOK_URL)

  // If webhook is disabled, go straight to demo mode
  if (!USE_WEBHOOK || !N8N_WEBHOOK_URL) {
    console.log("[v0] Using demo mode (webhook disabled)")
    const match = findBestMatch(userMessage)
    if (match) {
      const formattedResponse = formatResponseWithDetails(match.answer, match.providers, match.plans)
      if (typeof window !== "undefined") {
        const { useHighlight } = await import("@/hooks/use-highlight")
        useHighlight.getState().setHighlights(match.providers, match.plans)
      }
      return {
        response: formattedResponse,
        isDemo: true,
      }
    } else {
      if (typeof window !== "undefined") {
        const { useHighlight } = await import("@/hooks/use-highlight")
        useHighlight.getState().clearHighlights()
      }
      return {
        response: getNoMatchResponse(),
        isDemo: true,
      }
    }
  }

  // Try webhook first
  try {
    console.log("[v0] Attempting webhook call to:", N8N_WEBHOOK_URL)
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Auth": "4a8f92d0c13b4e28a2e7d9c8f1b3a7d4",
      },
      body: JSON.stringify({
        clearpath_session_id: sessionId,
        message: userMessage,
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook error: ${response.statusText}`)
    }

    const data = await response.json()

    const answer = data.answer || data.response || "I could not process that request. Please try again."
    const plans = data.plans || []
    const providers = data.providers || []

    if (typeof window !== "undefined") {
      const { useHighlight } = await import("@/hooks/use-highlight")
      useHighlight.getState().setHighlights(providers, plans)
    }

    // Format response with provider and plan details
    const formattedResponse = formatResponseWithDetails(answer, providers, plans)

    return {
      response: formattedResponse,
      isDemo: false,
    }
  } catch (error) {
    console.error("[v0] AI webhook error, falling back to demo mode:", error)

    // Fallback to demo mode
    const match = findBestMatch(userMessage)
    if (match) {
      const formattedResponse = formatResponseWithDetails(match.answer, match.providers, match.plans)
      if (typeof window !== "undefined") {
        const { useHighlight } = await import("@/hooks/use-highlight")
        useHighlight.getState().setHighlights(match.providers, match.plans)
      }
      return {
        response: formattedResponse,
        isDemo: true,
      }
    } else {
      if (typeof window !== "undefined") {
        const { useHighlight } = await import("@/hooks/use-highlight")
        useHighlight.getState().clearHighlights()
      }
      return {
        response: getNoMatchResponse(),
        isDemo: true,
      }
    }
  }
}

export function addMessage(role: "user" | "assistant", content: string): Message {
  const message: Message = {
    id: Math.random().toString(36).substr(2, 9),
    role,
    content,
    timestamp: Date.now(),
  }

  const history = getChatHistory()
  history.push(message)
  setChatHistory(history)

  return message
}

export function getMessages(): Message[] {
  return getChatHistory()
}

export function clearMessages(): void {
  setChatHistory([])
}
