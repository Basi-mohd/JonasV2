"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, MessageSquare, List, Repeat } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Choose Your Topic",
    description: "Select any topic that interests you - from travel to technology, food to philosophy. Our AI generates a personalized story just for you.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Read & Learn",
    description: "Engage with the story at your own pace. Each story is tailored to your level, with vocabulary and grammar appropriate for your progress.",
    icon: MessageSquare,
  },
  {
    number: "03",
    title: "Practice with AI",
    description: "Our chatbot asks questions, explains concepts, and helps you understand the story better through interactive conversation.",
    icon: List,
  },
  {
    number: "04",
    title: "Master Vocabulary",
    description: "Review automatically generated vocabulary lists and use spaced repetition to ensure long-term retention of new words.",
    icon: Repeat,
  },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 sm:text-4xl">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start learning German in just four simple steps
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full border-2 hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-4xl font-bold text-primary/20 mb-2">{step.number}</div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30 transform -translate-y-1/2" />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}






