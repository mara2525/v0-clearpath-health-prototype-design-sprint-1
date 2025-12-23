import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--color-white)" }}>
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-primary-dark)" }}>
          404 - Page Not Found
        </h1>
        <p className="mb-6" style={{ color: "var(--color-gray-text)" }}>
          The page you're looking for doesn't exist.
        </p>
        <Button
          asChild
          style={{
            backgroundColor: "var(--color-accent)",
            color: "var(--color-white)",
          }}
        >
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </main>
  )
}
