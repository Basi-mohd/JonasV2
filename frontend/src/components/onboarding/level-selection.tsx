"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen, Award } from "lucide-react"
import { useAuth } from "@/lib/providers/auth-provider"
import { api } from "@/lib/api/client"
import { ApiError } from "@/lib/api/client"

type Level = "beginner" | "intermediate" | "advanced"

interface LevelOption {
  level: Level
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const levels: LevelOption[] = [
  {
    level: "beginner",
    title: "Beginner",
    description: "Just starting your German journey? Perfect! We'll start with basic vocabulary and simple sentences.",
    icon: GraduationCap,
    color: "text-green-600 dark:text-green-400",
  },
  {
    level: "intermediate",
    title: "Intermediate",
    description: "You know the basics! We'll help you expand your vocabulary and improve your grammar.",
    icon: BookOpen,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    level: "advanced",
    title: "Advanced",
    description: "Ready for complex conversations? We'll challenge you with advanced topics and nuanced language.",
    icon: Award,
    color: "text-purple-600 dark:text-purple-400",
  },
]

interface LevelSelectionProps {
  onComplete: () => void
}

export function LevelSelection({ onComplete }: LevelSelectionProps) {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refreshAuth } = useAuth()

  const handleSelect = async (level: Level) => {
    setSelectedLevel(level)
    setIsLoading(true)
    setError(null)

    try {
      await api.patch("/users/me/level", { level })
      await refreshAuth()
      setTimeout(() => {
        onComplete()
      }, 500)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Failed to save your level. Please try again.")
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to JonasV2!</h1>
          <p className="text-lg text-muted-foreground">
            Let's personalize your learning experience. Choose your German proficiency level.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {levels.map((levelOption, index) => {
            const Icon = levelOption.icon
            const isSelected = selectedLevel === levelOption.level
            const isProcessing = isLoading && isSelected

            return (
              <motion.div
                key={levelOption.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary border-2 shadow-lg"
                      : "hover:border-primary/50"
                  } ${isProcessing ? "opacity-75" : ""}`}
                  onClick={() => !isLoading && handleSelect(levelOption.level)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                      <div
                        className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ${
                          isSelected ? "bg-primary/20" : ""
                        }`}
                      >
                        <Icon className={`h-8 w-8 ${levelOption.color}`} />
                      </div>
                    </div>
                    <CardTitle className="text-center">{levelOption.title}</CardTitle>
                    <CardDescription className="text-center">
                      {levelOption.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isProcessing && (
                      <div className="text-center text-sm text-muted-foreground">
                        Setting up your profile...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}






