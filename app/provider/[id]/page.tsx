"use client"

import { useParams } from "next/navigation"
import { ProviderDetails } from "@/components/providers/provider-details"
import { getProviderById } from "@/lib/utils/data"

export default function ProviderDetailPage() {
  const params = useParams()
  const providerId = params.id as string
  const provider = getProviderById(providerId)

  if (!provider) {
    return (
      <main className="min-h-screen py-12" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Provider Not Found</h1>
          <p style={{ color: "var(--color-gray-text)" }}>The provider you're looking for doesn't exist.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-12" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <ProviderDetails provider={provider} />
      </div>
    </main>
  )
}
