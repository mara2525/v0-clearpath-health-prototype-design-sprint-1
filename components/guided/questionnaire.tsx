"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { ScoringProfile } from "@/lib/utils/scoring"

interface QuestionnaireProps {
  onComplete: (profile: ScoringProfile) => void
}

export function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<Partial<ScoringProfile>>({})

  const questions = [
    {
      id: "ageRange",
      title: "What is your age range?",
      options: [
        { value: "18-25", label: "18-25" },
        { value: "26-35", label: "26-35" },
        { value: "36-45", label: "36-45" },
        { value: "46-55", label: "46-55" },
        { value: "56-65", label: "56-65" },
        { value: "65+", label: "65+" },
      ],
    },
    {
      id: "householdSize",
      title: "What is your household size?",
      options: [
        { value: "1", label: "Individual" },
        { value: "2", label: "2 People" },
        { value: "3", label: "3 People" },
        { value: "4", label: "4 People" },
        { value: "5+", label: "5+ People" },
      ],
    },
    {
      id: "utilizationLevel",
      title: "How often do you typically use healthcare services?",
      options: [
        { value: "low", label: "Rarely - just checkups" },
        { value: "medium", label: "Occasionally - a few visits per year" },
        { value: "high", label: "Frequently - monthly or more" },
      ],
    },
    {
      id: "prescriptionNeeds",
      title: "What are your prescription medication needs?",
      options: [
        { value: "none", label: "None" },
        { value: "occasional", label: "Occasional - as needed" },
        { value: "regular", label: "Regular - daily" },
        { value: "heavy", label: "Heavy - multiple daily medications" },
      ],
    },
  ]

  const currentQuestion = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  const handleSelect = (value: string) => {
    setProfile((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      // All questions answered
      onComplete(profile as ScoringProfile)
    }
  }

  const isAnswered = !!(profile as any)[currentQuestion.id]

  return (
    <Card className="w-full max-w-2xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">
            Question {step + 1} of {questions.length}
          </h3>
          <span style={{ color: "var(--color-gray-text)" }}>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--color-gray-light)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--color-accent)",
            }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">{currentQuestion.title}</h2>

      <RadioGroup value={(profile as any)[currentQuestion.id] || ""}>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <div key={option.value} className="flex items-center">
              <RadioGroupItem value={option.value} id={option.value} onClick={() => handleSelect(option.value)} />
              <Label htmlFor={option.value} className="ml-3 cursor-pointer text-base">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          style={{
            backgroundColor: isAnswered ? "var(--color-accent)" : "var(--color-gray-base)",
            color: "var(--color-white)",
          }}
        >
          {step === questions.length - 1 ? "Get Recommendations" : "Next"}
        </Button>
      </div>
    </Card>
  )
}
