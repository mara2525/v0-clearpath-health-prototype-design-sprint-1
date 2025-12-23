"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => Promise<void>
  isLoading?: boolean
}

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus()
    }
  }, [isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    await onSend(message)
    setMessage("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="How can we help you?"
        disabled={isLoading}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={!message.trim() || isLoading}
        style={{
          backgroundColor: "var(--color-accent)",
          color: "var(--color-white)",
        }}
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  )
}
