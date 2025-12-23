"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageSquare, Stethoscope, BarChart3, Phone, X } from "lucide-react"
import { PlanColumn } from "@/components/comparison/plan-column"
import { plans, planOrder } from "@/lib/utils/data"
import { PremiumDisplay } from "@/components/premiums/premium-display"
import { useState, useEffect } from "react"
import { featureFlags } from "@/lib/config/feature-flags"

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showAdvisorModal, setShowAdvisorModal] = useState(false)

  const orderedPlans = planOrder.map((id) => plans.find((p) => p.planId === id)).filter(Boolean) as any[]

  const openSplitScreen = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("aiMode", "split")
    const newUrl = `${pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)
    window.dispatchEvent(new Event("urlchange"))
  }

  useEffect(() => {
    if (showAdvisorModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showAdvisorModal])

  return (
    <main className="min-h-screen bg-[var(--bg-page)]">
      {showAdvisorModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ position: "fixed", zIndex: 9999 }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAdvisorModal(false)}
            style={{ position: "absolute" }}
          />

          {/* Modal Content */}
          <div
            className="relative z-[10000] bg-white rounded-lg shadow-2xl p-6 max-w-lg w-[calc(100%-2rem)] mx-4"
            style={{ position: "relative", zIndex: 10000 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAdvisorModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <h2 className="text-2xl md:text-5xl font-bold mb-2 text-[var(--color-primary-dark)] tracking-tight leading-tight">
                Find Your Perfect Health Plan
              </h2>
              <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Compare all ClearPath plans side-by-side and see pricing upfront
              </p>
            </div>
          </div>
        </div>
      )}

      <section
        className={`relative bg-gradient-to-br from-[var(--color-primary-dark)] to-[#002a4f] text-white ${featureFlags.showHomePageCTAButtons ? "py-16" : "py-12"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
            Find Your Perfect Health Plan
          </h1>
          <p
            className={`text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed ${featureFlags.showHomePageCTAButtons ? "mb-8" : "mb-4"}`}
          >
            Good care is in the details. Learn about which plan is best for you.
          </p>

          {featureFlags.showHomePageCTAButtons && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <Button
                size="lg"
                onClick={openSplitScreen}
                className="btn-primary text-lg px-8 py-6 w-full sm:w-auto shadow-xl hover:shadow-2xl"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Talk to AI Assistant
              </Button>
              <Button
                size="lg"
                onClick={() => setShowAdvisorModal(true)}
                className="btn-primary text-lg px-8 py-6 w-full sm:w-auto shadow-xl hover:shadow-2xl"
              >
                <Phone className="mr-2 h-5 w-5" />
                Connect with an Advisor
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <PremiumDisplay />

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-primary-dark)] mb-2">Compare All Plans</h2>
              <p className="text-[var(--color-gray-text)]">
                All pricing shown is for individual coverage. Scroll to see family rates and full details.
              </p>
            </div>
          </div>

          {/* Mobile: Stack vertically */}
          <div className="lg:hidden space-y-4">
            {orderedPlans.map((plan) => (
              <PlanColumn key={plan.planId} plan={plan} />
            ))}
          </div>

          {/* Desktop: 5-column grid */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4">
            {orderedPlans.map((plan) => (
              <PlanColumn key={plan.planId} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-[var(--color-gray-light)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-3 text-[var(--color-primary-dark)]">Additional Resources</h3>
            <p className="text-lg text-[var(--color-gray-text)]">Explore providers and detailed benefit comparisons</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card
              className="clearpath-card cursor-pointer group border border-[var(--color-gray-base)] hover:border-[var(--color-accent)] transition-all"
              onClick={() => router.push("/providers")}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-[var(--color-gray-light)] text-[var(--color-primary-dark)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-1 text-[var(--color-primary-dark)]">Find a Provider</h4>
                  <p className="text-sm text-[var(--color-gray-text)]">Search doctors and specialists in our network</p>
                </div>
              </div>
            </Card>

            <Card
              className="clearpath-card cursor-pointer group border border-[var(--color-gray-base)] hover:border-[var(--color-accent)] transition-all"
              onClick={() => router.push("/compare")}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-[var(--color-gray-light)] text-[var(--color-primary-dark)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-1 text-[var(--color-primary-dark)]">Detailed Comparison</h4>
                  <p className="text-sm text-[var(--color-gray-text)]">See full coverage table with all benefits</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
