"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getAIMode } from "@/lib/utils/session"

interface ModeWrapperProps {
  children: React.ReactNode
}

export function ModeWrapper({ children }: ModeWrapperProps) {
  const [mode, setMode] = useState("chat")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const modeParam = urlParams.get("aiMode") || getAIMode()
    setMode(modeParam)
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <>{children}</>
}
