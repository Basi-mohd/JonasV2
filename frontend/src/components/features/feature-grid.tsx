"use client"

import { AnimatedCard } from "./animated-card"
import { motion } from "framer-motion"

const features = [
  {
    title: "Next.js 14+",
    description: "Built with the latest Next.js App Router and React Server Components",
  },
  {
    title: "TypeScript",
    description: "Full type safety across the entire application",
  },
  {
    title: "Tailwind CSS",
    description: "Utility-first CSS framework for rapid UI development",
  },
  {
    title: "shadcn/ui",
    description: "Beautiful and accessible component library",
  },
  {
    title: "Framer Motion",
    description: "Production-ready animations and transitions",
  },
  {
    title: "Dark Mode",
    description: "Built-in theme switching with system preference detection",
  },
]

export function FeatureGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <AnimatedCard
          key={feature.title}
          title={feature.title}
          description={feature.description}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}





