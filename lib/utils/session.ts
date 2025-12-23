import { v4 as uuidv4 } from "uuid"

const SESSION_ID_KEY = "clearpath_session_id"
const AI_MODE_KEY = "clearpath_ai_mode"
const GUIDED_STATE_KEY = "clearpath_guided_state"
const AI_CHAT_HISTORY_KEY = "clearpath_chat_history"

export type AIMode = "takeover" | "split" | "chat"

export function getSessionId(): string {
  if (typeof window === "undefined") return ""

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY)
  if (!sessionId) {
    sessionId = uuidv4()
    sessionStorage.setItem(SESSION_ID_KEY, sessionId)
  }
  return sessionId
}

export function getAIMode(): AIMode {
  if (typeof window === "undefined") return "chat"
  return (sessionStorage.getItem(AI_MODE_KEY) as AIMode) || "chat"
}

export function setAIMode(mode: AIMode): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(AI_MODE_KEY, mode)
}

export function getGuidedState(): any {
  if (typeof window === "undefined") return null
  const state = sessionStorage.getItem(GUIDED_STATE_KEY)
  return state ? JSON.parse(state) : null
}

export function setGuidedState(state: any): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(GUIDED_STATE_KEY, JSON.stringify(state))
}

export function getChatHistory(): any[] {
  if (typeof window === "undefined") return []
  const history = sessionStorage.getItem(AI_CHAT_HISTORY_KEY)
  return history ? JSON.parse(history) : []
}

export function setChatHistory(history: any[]): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(AI_CHAT_HISTORY_KEY, JSON.stringify(history))
}

export function restartSession(): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(SESSION_ID_KEY)
  sessionStorage.removeItem(AI_MODE_KEY)
  sessionStorage.removeItem(GUIDED_STATE_KEY)
  sessionStorage.removeItem(AI_CHAT_HISTORY_KEY)
}
