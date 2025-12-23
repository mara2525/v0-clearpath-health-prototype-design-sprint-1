"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { type Provider, getPlanById } from "@/lib/utils/data"
import { MapPin, Phone, Star, Clock, Video, ChevronLeft } from "lucide-react"

interface ProviderDetailsProps {
  provider: Provider
}

export function ProviderDetails({ provider }: ProviderDetailsProps) {
  const router = useRouter()

  const acceptedPlans = provider.plansAccepted.map((planId) => getPlanById(planId)).filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card className="p-8 mb-8" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{provider.fullName}</h1>
          <p className="text-xl" style={{ color: "var(--color-gray-text)" }}>
            {provider.specialty}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-1" style={{ color: "var(--color-accent)" }} />
              <div>
                <p className="font-semibold">{provider.address.line1}</p>
                <p>
                  {provider.address.city}, {provider.address.state} {provider.address.zip}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
              <a href={`tel:${provider.phone}`} className="underline">
                {provider.phone}
              </a>
            </div>

            {provider.rating && (
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 fill-yellow-400" style={{ color: "#FCD34D" }} />
                <span className="font-semibold">
                  {provider.rating} ({provider.ratingCount} reviews)
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: provider.acceptingPatients ? "#10B981" : "#EF4444" }}
              />
              <span>{provider.acceptingPatients ? "Currently Accepting Patients" : "Not Accepting Patients"}</span>
            </div>

            {provider.virtualCareOffered && (
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
                <span>Telehealth Available</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: "var(--color-accent)" }} />
              <span>In-Network</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Accepted Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {acceptedPlans.map((plan) => (
              <Button
                key={plan.planId}
                variant="outline"
                onClick={() => router.push(`/plan-detail/${plan.planId}`)}
                className="justify-start h-auto py-2"
                style={{
                  borderColor: "var(--color-accent)",
                  color: "var(--color-accent)",
                }}
              >
                {plan.planName}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push("/providers")}>
          Search Providers
        </Button>
        <Button
          onClick={() => router.push("/compare")}
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-white)",
          }}
        >
          Compare Plans
        </Button>
      </div>
    </div>
  )
}
