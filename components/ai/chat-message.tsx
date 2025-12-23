"use client"

import type { Message } from "@/lib/utils/ai"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  const renderContent = () => {
    if (isUser) {
      return <p className="text-sm">{message.content}</p>
    }

    // Split content by links and render with proper formatting
    const linkRegex = /<a href="([^"]+)">([^<]+)<\/a>/g
    const parts: Array<string | JSX.Element> = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(message.content)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(message.content.substring(lastIndex, match.index))
      }

      // Add the link
      parts.push(
        <a
          key={match.index}
          href={match[1]}
          className="underline hover:opacity-80 transition-opacity"
          style={{ color: "inherit" }}
        >
          {match[2]}
        </a>,
      )

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < message.content.length) {
      parts.push(message.content.substring(lastIndex))
    }

    // If no links found, return plain text
    if (parts.length === 0) {
      return <p className="text-sm whitespace-pre-line">{message.content}</p>
    }

    return (
      <p className="text-sm whitespace-pre-line">
        {parts.map((part, index) => (typeof part === "string" ? <span key={index}>{part}</span> : part))}
      </p>
    )
  }

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg"
        style={{
          backgroundColor: isUser ? "var(--color-accent)" : "var(--color-gray-light)",
          color: isUser ? "var(--color-white)" : "var(--color-gray-dark)",
          wordWrap: "break-word",
        }}
      >
        {renderContent()}
      </div>
    </div>
  )
}
