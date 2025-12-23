"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Provider } from "@/lib/utils/data"
import { MapPin, Phone, Star } from "lucide-react"
import { useHighlight } from "@/hooks/use-highlight"

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const router = useRouter()
  const isHighlighted = useHighlight((state) => state.isProviderHighlighted(provider.providerId))

  const handleClick = () => {
    router.push(`/provider/${provider.providerId}`)
  }

  return (
    <Card
      className={`p-6 hover:shadow-lg transition-all cursor-pointer ${isHighlighted ? "animate-pulse-highlight" : ""}`}
      onClick={handleClick}
      style={{
        backgroundColor: isHighlighted ? "rgba(76, 114, 138, 0.08)" : "var(--color-white)",
        borderColor: isHighlighted ? "var(--color-accent)" : "var(--color-gray-base)",
        borderWidth: isHighlighted ? "3px" : "1px",
        boxShadow: isHighlighted ? "0 0 0 2px rgba(76, 114, 138, 0.2)" : undefined,
      }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-1">{provider.fullName}</h3>
        <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>{provider.specialty}</p>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          <span>
            {provider.address.city}, {provider.address.state} {provider.address.zip}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          <span>{provider.phone}</span>
        </div>
        {provider.rating && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400" style={{ color: "#FCD34D" }} />
            <span>
              {provider.rating} ({provider.ratingCount} reviews)
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {provider.acceptingPatients && (
          <Badge style={{ backgroundColor: "var(--color-accent)", color: "var(--color-white)" }}>
            Accepting Patients
          </Badge>
        )}
        {provider.virtualCareOffered && (
          <Badge variant="outline" style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}>
            Telehealth
          </Badge>
        )}
      </div>

      <p style={{ color: "var(--color-gray-text)", fontSize: "0.875rem" }}>
        {provider.plansAccepted.length} plans accepted
      </p>
    </Card>
  )
}
