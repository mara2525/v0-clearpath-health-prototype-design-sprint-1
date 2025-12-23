"use client"

import { useState, useEffect, useRef } from "react"
import { ChatMessage } from "@/components/ai/chat-message"
import { ChatInput } from "@/components/ai/chat-input"
import { TopicButtons } from "@/components/ai/topic-buttons"
import { type Message, sendMessageToAI, addMessage, getMessages, getCurrentMode } from "@/lib/utils/ai"
import { cn } from "@/lib/utils"

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(getCurrentMode())
  const [isPrivateMode, setIsPrivateMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(getMessages())
    const savedPrivateMode = localStorage.getItem("clearpath_private_mode")
    setIsPrivateMode(savedPrivateMode === "true")
  }, [])

  useEffect(() => {
    const checkMode = () => {
      setIsDemoMode(getCurrentMode())
    }

    checkMode()

    const interval = setInterval(checkMode, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (text: string) => {
    const userMessage = addMessage("user", text)
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    const { response, isDemo } = await sendMessageToAI(text)
    setIsDemoMode(isDemo)
    const assistantMessage = addMessage("assistant", response)
    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handlePrivateModeToggle = (checked: boolean) => {
    setIsPrivateMode(checked)
    localStorage.setItem("clearpath_private_mode", checked.toString())
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="flex-shrink-0 p-4 pb-0">
        {isPrivateMode && (
          <div
            className="mb-3 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
            style={{
              backgroundColor: "var(--color-gray-light)",
              color: "var(--color-gray-text)",
              border: "1px solid var(--color-accent)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 2C5.79086 2 4 3.79086 4 6V7H3C2.44772 7 2 7.44772 2 8V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V8C14 7.44772 13.5523 7 13 7H12V6C12 3.79086 10.2091 2 8 2ZM10.5 7V6C10.5 4.61929 9.38071 3.5 8 3.5C6.61929 3.5 5.5 4.61929 5.5 6V7H10.5Z"
                fill="currentColor"
              />
            </svg>
            You are in private mode: No information in this chat will be stored
          </div>
        )}

        {isDemoMode && (
          <div
            className="mb-3 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2"
            style={{
              backgroundColor: "var(--color-gray-light)",
              color: "var(--color-gray-text)",
              border: "1px solid var(--color-accent)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M8 4.5v4M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Demo Mode
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 min-h-0 pb-[5%]">
        {!hasMessages ? (
          <div className="flex flex-col py-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-3">ClearPath Health Assistant</h2>
              <p className="max-w-sm mx-auto text-sm" style={{ color: "var(--color-gray-text)" }}>
                I can help you find the right plan, search for providers, compare options, and answer questions.
              </p>
            </div>
            <TopicButtons onSelect={handleSendMessage} />
          </div>
        ) : (
          <div>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: "var(--color-gray-light)" }}>
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        animationDelay: "0.1s",
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        animationDelay: "0.2s",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="flex-shrink-0 p-4 pt-0">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />

        <div className="flex items-center justify-center gap-2 mt-3">
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              !isPrivateMode ? "text-gray-400" : "text-[var(--color-accent)]",
            )}
          >
            Private Mode
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isPrivateMode}
            onClick={() => handlePrivateModeToggle(!isPrivateMode)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
              isPrivateMode
                ? "bg-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                : "bg-gray-300 focus:ring-gray-300",
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform",
                isPrivateMode ? "translate-x-6" : "translate-x-1",
              )}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
