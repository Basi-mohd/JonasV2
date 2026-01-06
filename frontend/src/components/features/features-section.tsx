"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BookIllustration, ChatbotIllustration, VocabularyIllustration, SpacedRepetitionIllustration } from "./illustration"

const features = [
  {
    title: "AI-Generated Stories",
    description: "Generate personalized stories based on your interests and learning level. Choose any topic you want to explore.",
    icon: BookIllustration,
    color: "text-primary",
  },
  {
    title: "Interactive Chatbot",
    description: "Learn through conversation! Our AI chatbot asks questions, explains concepts, and guides you through each story.",
    icon: ChatbotIllustration,
    color: "text-accent",
  },
  {
    title: "Vocabulary Lists",
    description: "Automatically generate vocabulary lists from stories. Check each word's meaning, pronunciation, and usage.",
    icon: VocabularyIllustration,
    color: "text-secondary",
  },
  {
    title: "Spaced Repetition",
    description: "Master vocabulary with scientifically-proven spaced repetition. Review words at optimal intervals for long-term retention.",
    icon: SpacedRepetitionIllustration,
    color: "text-primary",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 sm:text-4xl">Everything You Need to Master German</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete learning system designed to make German learning engaging and effective
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-24 h-24 mx-auto mb-4">
                      <IconComponent className={feature.color} delay={index * 0.1} />
                    </div>
                    <CardTitle className="text-center">{feature.title}</CardTitle>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}





