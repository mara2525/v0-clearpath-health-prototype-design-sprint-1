"use client"

import { useParams } from "next/navigation"
import { PlanDetail } from "@/components/plans/plan-detail"
import { getPlanById } from "@/lib/utils/data"

export default function PlanDetailPage() {
  const params = useParams()
  const planId = params.id as string
  const plan = getPlanById(planId)

  if (!plan) {
    return (
      <main className="min-h-screen py-12" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Plan Not Found</h1>
          <p style={{ color: "var(--color-gray-text)" }}>The plan you're looking for doesn't exist.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <PlanDetail plan={plan} />
      </div>
    </main>
  )
}
