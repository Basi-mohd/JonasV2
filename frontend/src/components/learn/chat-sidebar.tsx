"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/providers/auth-provider"
import { Plus, Search, MessageSquare, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

interface ChatSidebarProps {
  currentSessionId?: string
  onNewSession: () => void
  onSelectSession: (sessionId: string) => void
}

export function ChatSidebar({
  currentSessionId,
  onNewSession,
  onSelectSession,
}: ChatSidebarProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const sessions: ChatSession[] = [
    {
      id: "1",
      title: "German Basics",
      lastMessage: "Let's start with greetings",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      title: "Conversation Practice",
      lastMessage: "How do you say hello?",
      timestamp: new Date(Date.now() - 172800000),
    },
  ]

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-4 space-y-4 border-b border-sidebar-border">
        <Button
          onClick={onNewSession}
          className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search your threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No sessions found
            </div>
          ) : (
            filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group",
                  currentSessionId === session.id &&
                    "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {session.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate mt-1">
                      {session.lastMessage}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-sidebar-accent/50">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-medium">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {user?.username || "User"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {user?.level || "beginner"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




