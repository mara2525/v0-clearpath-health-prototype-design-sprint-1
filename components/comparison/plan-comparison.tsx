"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { PlanColumn } from "@/components/comparison/plan-column"
import { plans, planOrder } from "@/lib/utils/data"
import { PremiumDisplay } from "@/components/premiums/premium-display"

export function PlanComparison() {
  const router = useRouter()

  const orderedPlans = planOrder.map((id) => plans.find((p) => p.planId === id)).filter(Boolean) as any[]

  return (
    <div className="w-full">
      <PremiumDisplay />

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Compare All Plans</h2>
        <p style={{ color: "var(--color-gray-text)" }}>Side-by-side comparison of all ClearPath Healthcare plans</p>
      </div>

      {/* Mobile and Tablet: Stack vertically */}
      <div className="lg:hidden space-y-4 mb-8">
        {orderedPlans.map((plan) => (
          <PlanColumn key={plan.planId} plan={plan} />
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:grid grid-cols-5 gap-4 mb-8">
        {orderedPlans.map((plan) => (
          <PlanColumn key={plan.planId} plan={plan} />
        ))}
      </div>

      <Card className="p-6 mb-8" style={{ backgroundColor: "var(--color-gray-light)" }}>
        <h3 className="text-xl font-bold mb-4">Coverage Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-gray-base)" }}>
                <th className="text-left py-2 px-2 font-bold">Coverage</th>
                {orderedPlans.map((plan) => (
                  <th key={plan.planId} className="text-center py-2 px-2 font-bold">
                    {plan.planName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--color-gray-base)" }}>
                <td className="py-3 px-2 font-semibold">Preventive Care</td>
                {orderedPlans.map((plan) => (
                  <td key={plan.planId} className="text-center py-3 px-2">
                    {plan.preventiveCare}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-gray-base)" }}>
                <td className="py-3 px-2 font-semibold">Emergency Room</td>
                {orderedPlans.map((plan) => (
                  <td key={plan.planId} className="text-center py-3 px-2">
                    {plan.emergencyRoom}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-gray-base)" }}>
                <td className="py-3 px-2 font-semibold">Urgent Care</td>
                {orderedPlans.map((plan) => (
                  <td key={plan.planId} className="text-center py-3 px-2">
                    {typeof plan.urgentCare === "number" ? `$${plan.urgentCare}` : plan.urgentCare}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-gray-base)" }}>
                <td className="py-3 px-2 font-semibold">Mental Health Visit</td>
                {orderedPlans.map((plan) => (
                  <td key={plan.planId} className="text-center py-3 px-2">
                    {typeof plan.mentalHealthOfficeVisit === "number"
                      ? `$${plan.mentalHealthOfficeVisit}`
                      : plan.mentalHealthOfficeVisit}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: "1px solid var(--color-gray-base)" }}>
                <td className="py-3 px-2 font-semibold">Generic Rx</td>
                {orderedPlans.map((plan) => {
                  const rx = (plan.rxBenefits as any)?.generic || "N/A"
                  return (
                    <td key={plan.planId} className="text-center py-3 px-2">
                      {typeof rx === "number" ? `$${rx}` : rx}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push("/guided")}>
          Get Personalized Recommendations
        </Button>
        <Button
          onClick={() => router.push("/ai")}
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-white)",
          }}
        >
          Ask AI Assistant
        </Button>
      </div> */}
    </div>
  )
}
