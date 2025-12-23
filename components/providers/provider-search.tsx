"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ProviderCard } from "@/components/providers/provider-card"
import { searchProviders } from "@/lib/utils/data"
import { Search } from "lucide-react"

export function ProviderSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)

  const results = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchProviders(searchQuery)
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
  }

  const displayResults = searchQuery.trim() && results.length > 0
  const showEmpty = searchQuery.trim() && results.length === 0 && hasSearched

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Find a Provider</h2>
        <p style={{ color: "var(--color-gray-text)" }}>
          Search by name, specialty, or location. Try: Melissa Reed in Hutchinson, KS
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <Input
          type="text"
          placeholder="Search by provider name, specialty, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          type="submit"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-white)",
          }}
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>

      {showEmpty && (
        <Card className="p-6 text-center" style={{ backgroundColor: "var(--color-gray-light)" }}>
          <p style={{ color: "var(--color-gray-text)" }}>
            No providers found matching "{searchQuery}". Try a different search.
          </p>
        </Card>
      )}

      {displayResults && (
        <div className="space-y-4">
          <p className="font-semibold">
            Found {results.length} provider{results.length !== 1 ? "s" : ""}
          </p>
          {results.map((provider) => (
            <ProviderCard key={provider.providerId} provider={provider} />
          ))}
        </div>
      )}

      {!searchQuery.trim() && !hasSearched && (
        <Card className="p-12 text-center" style={{ backgroundColor: "var(--color-gray-light)" }}>
          <h3 className="text-xl font-bold mb-2">Search for a Provider</h3>
          <p style={{ color: "var(--color-gray-text)" }}>
            Enter a provider name, specialty, or location to get started.
          </p>
        </Card>
      )}
    </div>
  )
}
