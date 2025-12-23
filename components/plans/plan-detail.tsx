"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Plan, getProvidersByPlan } from "@/lib/utils/data"
import { computeHighlights } from "@/lib/utils/highlights"
import { getMetalTier } from "@/lib/utils/scoring"
import { ChevronLeft } from "lucide-react"

interface PlanDetailProps {
  plan: Plan
}

export function PlanDetail({ plan }: PlanDetailProps) {
  const router = useRouter()
  const highlights = computeHighlights(plan)
  const metalTier = getMetalTier(plan.planId)
  const providers = getProvidersByPlan(plan.planId)

  const deductible = (plan.deductible as any) || {}
  const oopMax = (plan.outOfPocketMax as any) || {}
  const rxBenefits = (plan.rxBenefits as any) || {}

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{plan.planName}</h1>
            <Badge
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-white)",
              }}
            >
              {metalTier}
            </Badge>
          </div>
        </div>

        {highlights.length > 0 && (
          <Card className="p-4 mb-6" style={{ backgroundColor: "var(--color-gray-light)" }}>
            <p className="font-semibold mb-2">Why Choose This Plan:</p>
            <div className="space-y-1">
              {highlights.map((highlight, idx) => (
                <p key={idx} style={{ color: "var(--color-accent)" }}>
                  ✓ {highlight}
                </p>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6" style={{ backgroundColor: "var(--color-white)" }}>
          <h2 className="text-2xl font-bold mb-4">Costs</h2>
          <div className="space-y-4">
            <div>
              <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Deductible - Individual</p>
              <p className="text-2xl font-bold">${deductible.single || 0}</p>
            </div>
            {deductible.family && (
              <div>
                <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Deductible - Family</p>
                <p className="text-2xl font-bold">${deductible.family}</p>
              </div>
            )}
            <div>
              <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Out-of-Pocket Max - Individual</p>
              <p className="text-2xl font-bold">${oopMax.single || 0}</p>
            </div>
            {oopMax.family && (
              <div>
                <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Out-of-Pocket Max - Family</p>
                <p className="text-2xl font-bold">${oopMax.family}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6" style={{ backgroundColor: "var(--color-white)" }}>
          <h2 className="text-2xl font-bold mb-4">Office Visits</h2>
          <div className="space-y-4">
            <div>
              <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>PCP Office Visit</p>
              <p className="text-2xl font-bold">
                {typeof plan.pcpOfficeVisit === "number" ? `$${plan.pcpOfficeVisit}` : plan.pcpOfficeVisit}
              </p>
            </div>
            <div>
              <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Specialist Visit</p>
              <p className="text-2xl font-bold">
                {typeof plan.specialistOfficeVisit === "number"
                  ? `$${plan.specialistOfficeVisit}`
                  : plan.specialistOfficeVisit}
              </p>
            </div>
            <div>
              <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Mental Health Visit</p>
              <p className="text-2xl font-bold">
                {typeof plan.mentalHealthOfficeVisit === "number"
                  ? `$${plan.mentalHealthOfficeVisit}`
                  : plan.mentalHealthOfficeVisit}
              </p>
            </div>
            <div>
              <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Telehealth</p>
              <p className="text-2xl font-bold">{plan.telehealth === 0 ? "Free" : `$${plan.telehealth}`}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-8" style={{ backgroundColor: "var(--color-white)" }}>
        <h2 className="text-2xl font-bold mb-4">Prescription Benefits</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Generic</p>
            <p className="font-bold">
              {typeof rxBenefits.generic === "number" ? `$${rxBenefits.generic}` : rxBenefits.generic}
            </p>
          </div>
          <div>
            <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Preferred Brand</p>
            <p className="font-bold">{rxBenefits.preferredBrand}</p>
          </div>
          <div>
            <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Non-Preferred Brand</p>
            <p className="font-bold">{rxBenefits.nonPreferredBrand}</p>
          </div>
          <div>
            <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>Specialty</p>
            <p className="font-bold">{rxBenefits.specialty}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-8" style={{ backgroundColor: "var(--color-white)" }}>
        <h2 className="text-2xl font-bold mb-4">Network Providers</h2>
        <p style={{ color: "var(--color-gray-text)" }} className="mb-4">
          {providers.length} providers accept this plan
        </p>
        {providers.length > 0 ? (
          <Button
            variant="outline"
            onClick={() => router.push("/providers")}
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
            }}
          >
            View Network Providers
          </Button>
        ) : (
          <p style={{ color: "var(--color-gray-text)" }}>No providers in the list accept this plan.</p>
        )}
      </Card>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push("/compare")}>
          Compare Plans
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
