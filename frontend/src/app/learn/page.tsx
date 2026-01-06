"use client"

import { useState, useEffect } from "react"
import { LevelSelection } from "@/components/onboarding/level-selection"
import { ChatSidebar } from "@/components/learn/chat-sidebar"
import { LearnChatInterface } from "@/components/learn/learn-chat-interface"
import { useAuth } from "@/lib/providers/auth-provider"
import { useRouter } from "next/navigation"

export default function LearnPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/")
        return
      }
      setShowOnboarding(!user.level)
      setIsChecking(false)
    }
  }, [user, authLoading, router])

  const handleNewSession = () => {
    setCurrentSessionId(undefined)
  }

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId)
  }

  if (authLoading || isChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return (
      <div className="h-screen">
        <LevelSelection onComplete={() => setShowOnboarding(false)} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-background">
      <div className="w-64 flex-shrink-0 border-r border-sidebar-border">
        <ChatSidebar
          currentSessionId={currentSessionId}
          onNewSession={handleNewSession}
          onSelectSession={handleSelectSession}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <LearnChatInterface sessionId={currentSessionId} />
      </div>
    </div>
  )
}

