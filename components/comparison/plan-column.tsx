"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Plan } from "@/lib/utils/data"
import { getMetalTier } from "@/lib/utils/scoring"
import { computeHighlights } from "@/lib/utils/highlights"
import { useHighlight } from "@/hooks/use-highlight"
import { getDisplayName } from "@/lib/utils/data"

interface PlanColumnProps {
  plan: Plan
  isRecommended?: boolean
}

export function PlanColumn({ plan, isRecommended }: PlanColumnProps) {
  const router = useRouter()
  const isHighlighted = useHighlight((state) => state.isPlanHighlighted(plan.planId))
  const highlights = computeHighlights(plan)
  const metalTier = getMetalTier(plan.planId)
  const deductible = (plan.deductible as any)?.single || 0
  const oopMax = (plan.outOfPocketMax as any)?.single || 0
  const pcpVisit = plan.pcpOfficeVisit as any
  const specialistVisit = plan.specialistOfficeVisit as any

  return (
    <div
      className={`rounded-lg p-6 flex flex-col h-full transition-all ${isHighlighted ? "animate-pulse-highlight" : ""}`}
      style={{
        backgroundColor: isRecommended
          ? "rgba(76, 114, 138, 0.05)"
          : isHighlighted
            ? "rgba(76, 114, 138, 0.08)"
            : "var(--color-gray-light)",
        border: isRecommended
          ? "2px solid var(--color-accent)"
          : isHighlighted
            ? "3px solid var(--color-accent)"
            : "1px solid var(--color-gray-base)",
        boxShadow: isHighlighted ? "0 0 0 2px rgba(76, 114, 138, 0.2)" : undefined,
      }}
    >
      {isRecommended && (
        <Badge className="mb-3 w-fit" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-white)" }}>
          Smart Match
        </Badge>
      )}

      <h3 className="text-xl font-bold mb-2">{getDisplayName(plan.planName)}</h3>

      <Badge
        variant="outline"
        className="mb-4 w-fit"
        style={{
          borderColor: "var(--color-accent)",
          color: "var(--color-accent)",
        }}
      >
        {metalTier}
      </Badge>

      {highlights.length > 0 && (
        <div className="mb-4 space-y-1">
          {highlights.map((highlight, idx) => (
            <p key={idx} className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
              ✓ {highlight}
            </p>
          ))}
        </div>
      )}

      <div className="space-y-3 mb-6 flex-1 border-t pt-4" style={{ borderColor: "var(--color-gray-base)" }}>
        <div>
          <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Deductible (Individual)</p>
          <p className="text-lg font-bold">${deductible}</p>
        </div>

        <div>
          <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Out-of-Pocket Max</p>
          <p className="text-lg font-bold">${oopMax}</p>
        </div>

        <div>
          <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>PCP Office Visit</p>
          <p className="text-lg font-bold">{typeof pcpVisit === "number" ? `$${pcpVisit}` : pcpVisit}</p>
        </div>

        <div>
          <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Specialist Visit</p>
          <p className="text-lg font-bold">
            {typeof specialistVisit === "number" ? `$${specialistVisit}` : specialistVisit}
          </p>
        </div>

        <div>
          <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Telehealth</p>
          <p className="text-lg font-bold">{plan.telehealth === 0 ? "Free" : `$${plan.telehealth}`}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => router.push(`/plan-detail/${plan.planId}`)}
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-white)",
          }}
        >
          View Details
        </Button>
        <Button
          onClick={() => router.push(`/certificate?planId=${plan.planId}`)}
          className="bg-emerald-500 text-white hover:bg-emerald-500"
        >
          Choose Plan
        </Button>
      </div>
    </div>
  )
}
