"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getPlanById, getDisplayName } from "@/lib/utils/data"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Confetti from "react-confetti"

export default function CertificatePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const certificateRef = useRef<HTMLDivElement>(null)
  const planId = searchParams.get("planId")

  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  const plan = planId ? getPlanById(planId) : null

  useEffect(() => {
    if (!planId || !plan) {
      router.push("/compare")
    }
  }, [planId, plan, router])

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener("resize", handleResize)

    setShowConfetti(true)

    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    window.print()
  }

  if (!plan) {
    return null
  }

  const planName = getDisplayName(plan.planName)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="print:hidden sticky top-0 z-10" style={{ backgroundColor: "var(--color-white)" }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between border-b">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button
              onClick={handlePrint}
              className="gap-2"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-white)",
              }}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Card
          ref={certificateRef}
          className="max-w-3xl mx-auto p-8 print:shadow-none"
          style={{
            backgroundColor: "var(--color-white)",
          }}
        >
          <div className="text-center mb-6 border-b-4 pb-4" style={{ borderColor: "var(--color-primary)" }}>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--color-primary)" }}>
              ClearPath Health Insurance
            </h1>
            <p className="text-lg" style={{ color: "var(--color-gray-text)" }}>
              Plan Selection Certificate
            </p>
          </div>

          <div className="text-center mb-6">
            <div
              className="inline-block px-6 py-3 rounded-lg mb-4"
              style={{ backgroundColor: "rgba(46, 150, 115, 0.1)" }}
            >
              <h2 className="text-3xl font-bold" style={{ color: "var(--color-primary)" }}>
                Congratulations!
              </h2>
            </div>

            <p className="text-xl font-semibold mb-3">You have chosen</p>
            <h3
              className="text-2xl font-bold mb-4 px-6 py-2 rounded-lg inline-block"
              style={{
                color: "var(--color-white)",
                backgroundColor: "var(--color-accent)",
              }}
            >
              {planName}
            </h3>
          </div>

          <div className="mb-6 text-center max-w-2xl mx-auto">
            <p className="text-base leading-relaxed" style={{ color: "var(--color-gray-text)" }}>
              You chose a great plan for your health needs. ClearPath Health Insurance is honored to be your provider
              for <span className="font-bold">2026</span>.
            </p>
          </div>

          <div
            className="grid grid-cols-2 gap-4 p-4 rounded-lg mb-6"
            style={{ backgroundColor: "var(--color-gray-light)" }}
          >
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-gray-text)" }}>
                Deductible (Individual)
              </p>
              <p className="text-lg font-bold">${(plan.deductible as any)?.single || 0}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-gray-text)" }}>
                Out-of-Pocket Max
              </p>
              <p className="text-lg font-bold">${(plan.outOfPocketMax as any)?.single || 0}</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-gray-text)" }}>
                PCP Office Visit
              </p>
              <p className="text-lg font-bold">
                {typeof plan.pcpOfficeVisit === "number" ? `$${plan.pcpOfficeVisit}` : plan.pcpOfficeVisit}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-gray-text)" }}>
                Preventive Care
              </p>
              <p className="text-lg font-bold">{plan.preventiveCare}</p>
            </div>
          </div>

          <div className="border-t-2 pt-4" style={{ borderColor: "var(--color-gray-base)" }}>
            <h4 className="text-lg font-bold mb-3" style={{ color: "var(--color-primary)" }}>
              Next Steps
            </h4>
            <ul className="space-y-1.5 text-sm" style={{ color: "var(--color-gray-text)" }}>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: "var(--color-primary)" }}>
                  •
                </span>
                Your plan enrollment will be processed within 3-5 business days
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: "var(--color-primary)" }}>
                  •
                </span>
                You will receive your member ID card and welcome packet by mail
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: "var(--color-primary)" }}>
                  •
                </span>
                Coverage begins January 1, 2026
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: "var(--color-primary)" }}>
                  •
                </span>
                Questions? Contact us at (800) 555-CARE or support@clearpathhealth.com
              </li>
            </ul>
          </div>

          <div className="text-center mt-6 pt-4 border-t" style={{ borderColor: "var(--color-gray-base)" }}>
            <p className="text-sm" style={{ color: "var(--color-gray-text)" }}>
              Certificate issued on{" "}
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-xs mt-2" style={{ color: "var(--color-gray-text)" }}>
              Plan ID: {plan.planId} | ClearPath Health Insurance Company
            </p>
          </div>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
