"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/features/hero-section";
import { FeaturesSection } from "@/components/features/features-section";
import { HowItWorks } from "@/components/features/how-it-works";
import { CTASection } from "@/components/features/cta-section";
import { FloatingLetters } from "@/components/features/floating-letters";
import { useAuth } from "@/lib/providers/auth-provider";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/learn")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      <FloatingLetters />
      <Header />
      <main>
        <div className="mx-auto ">
          <HeroSection />
        </div>
        <FeaturesSection />
        <HowItWorks />
        <CTASection />
      </main>
    </div>
  );
}
