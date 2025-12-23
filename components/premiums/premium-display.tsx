"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { premiums, getPremiumForPlan, type CoverageType, type EmploymentStatus } from "@/lib/utils/premiums"
import { planOrder, getPlanById, getDisplayName } from "@/lib/utils/data"
import { useHighlight } from "@/hooks/use-highlight"

export function PremiumDisplay() {
  const [coverageType, setCoverageType] = useState<CoverageType>("selfOnly")
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>("employed")
  const highlightedPlans = useHighlight((state) => state.highlightedPlans)

  const coverageLabels: Record<CoverageType, string> = {
    selfOnly: "Self Only",
    selfPlusOne: "Self + One",
    selfAndFamily: "Self + Family",
  }

  const employmentLabels: Record<EmploymentStatus, string> = {
    employed: "Employed",
    retired: "Retired",
  }

  return (
    <Card className="p-6 mb-8 bg-[var(--color-gray-light)] border border-[var(--color-gray-base)]">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[var(--color-primary-dark)] inline">{premiums.year} Premium Rates</h3>
        <span className="text-[var(--color-gray-text)] ml-2">— Select your coverage type and employment status</span>
      </div>

      {/* Selection Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2 text-[var(--color-primary-dark)]">Coverage Type</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(coverageLabels) as CoverageType[]).map((type) => (
              <Button
                key={type}
                onClick={() => setCoverageType(type)}
                variant={coverageType === type ? "default" : "outline"}
                className={coverageType === type ? "btn-primary" : ""}
                size="sm"
              >
                {coverageLabels[type]}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2 text-[var(--color-primary-dark)]">Employment Status</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(employmentLabels) as EmploymentStatus[]).map((status) => (
              <Button
                key={status}
                onClick={() => setEmploymentStatus(status)}
                variant={employmentStatus === status ? "default" : "outline"}
                className={employmentStatus === status ? "btn-primary" : ""}
                size="sm"
              >
                {employmentLabels[status]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Grid - Mobile: Stack, Desktop: Grid */}
      <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-4">
        {planOrder.map((planId) => {
          const plan = getPlanById(planId)
          const premium = getPremiumForPlan(planId, coverageType, employmentStatus)
          const isHighlighted = highlightedPlans.includes(planId)

          if (!plan || premium === null) return null

          return (
            <div
              key={planId}
              className={`p-4 rounded-lg border transition-all ${isHighlighted ? "animate-pulse-highlight" : ""}`}
              style={{
                borderColor: isHighlighted ? "var(--color-accent)" : "var(--color-gray-base)",
                borderWidth: isHighlighted ? "3px" : "1px",
                backgroundColor: isHighlighted ? "rgba(76, 114, 138, 0.08)" : "white",
                boxShadow: isHighlighted ? "0 0 0 2px rgba(76, 114, 138, 0.2)" : undefined,
              }}
            >
              <div className="text-sm font-semibold text-[var(--color-gray-text)] mb-1">
                {getDisplayName(plan.planName)}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-[var(--color-primary-dark)]">${premium.toFixed(2)}</span>
                <span className="text-xs text-[var(--color-gray-text)]">
                  {employmentStatus === "employed" ? "per pay period" : "per month"}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
