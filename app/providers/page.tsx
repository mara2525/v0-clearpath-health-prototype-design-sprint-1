"use client"

import { ProviderSearch } from "@/components/providers/provider-search"

export default function ProvidersPage() {
  return (
    <main className="min-h-screen py-12" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <ProviderSearch />
      </div>
    </main>
  )
}
