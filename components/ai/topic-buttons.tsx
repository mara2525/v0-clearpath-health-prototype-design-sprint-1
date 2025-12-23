"use client"

import type React from "react"

import topicsData from "@/lib/data/topics.json"
import { Button } from "@/components/ui/button"
import { Users, FileText, Shield, Clipboard, Network, Heart, DollarSign, Star } from "lucide-react"

interface TopicButtonsProps {
  onSelect: (prompt: string) => void
}

const topicIcons: Record<string, React.ReactNode> = {
  "who-needs-coverage": <Users className="w-4 h-4 text-white" />,
  "type-of-coverage": <FileText className="w-4 h-4 text-white" />,
  "risk-premium-tolerance": <Shield className="w-4 h-4 text-white" />,
  "anticipated-care-needs": <Clipboard className="w-4 h-4 text-white" />,
  "provider-network": <Network className="w-4 h-4 text-white" />,
  "lifestyle-wellness": <Heart className="w-4 h-4 text-white" />,
  budgeting: <DollarSign className="w-4 h-4 text-white" />,
  recommendation: <Star className="w-4 h-4 text-white" />,
}

export function TopicButtons({ onSelect }: TopicButtonsProps) {
  const topics = topicsData.topics

  return (
    <div className="flex flex-col items-end gap-2 w-full">
      {topics.map((topic) => (
        <Button
          key={topic.topicId}
          onClick={() => onSelect(topic.prompt)}
          variant="default"
          size="sm"
          className="btn-primary"
        >
          {topicIcons[topic.topicId]}
          {topic.label}
        </Button>
      ))}
    </div>
  )
}
