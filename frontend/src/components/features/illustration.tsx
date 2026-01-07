"use client"

import { motion } from "framer-motion"

interface IllustrationProps {
  className?: string
  delay?: number
}

export function BookIllustration({ className, delay = 0 }: IllustrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <motion.path
          d="M40 30 L160 30 L160 170 L40 170 Z"
          fill="currentColor"
          className="text-primary/20"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: delay + 0.2 }}
        />
        <motion.path
          d="M40 30 L40 170"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.3 }}
        />
        <motion.path
          d="M50 60 L150 60 M50 90 L150 90 M50 120 L130 120"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary/60"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.5 }}
        />
        <motion.circle
          cx="170"
          cy="50"
          r="15"
          fill="currentColor"
          className="text-accent"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.7, type: "spring" }}
        />
      </svg>
    </motion.div>
  )
}

export function ChatbotIllustration({ className, delay = 0 }: IllustrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <motion.circle
          cx="100"
          cy="100"
          r="60"
          fill="currentColor"
          className="text-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
        />
        <motion.circle
          cx="85"
          cy="90"
          r="8"
          fill="currentColor"
          className="text-primary-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
        />
        <motion.circle
          cx="115"
          cy="90"
          r="8"
          fill="currentColor"
          className="text-primary-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        />
        <motion.path
          d="M75 120 Q100 135 125 120"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          className="text-primary-foreground"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.6 }}
        />
        <motion.path
          d="M100 160 L100 140 L80 150 Z"
          fill="currentColor"
          className="text-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.7 }}
        />
      </svg>
    </motion.div>
  )
}

export function VocabularyIllustration({ className, delay = 0 }: IllustrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <motion.rect
          x="50"
          y="40"
          width="100"
          height="120"
          rx="8"
          fill="currentColor"
          className="text-secondary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.2, type: "spring" }}
        />
        <motion.path
          d="M60 70 L140 70 M60 100 L140 100 M60 130 L140 130"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary-foreground"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: delay + 0.4 }}
        />
        <motion.circle
          cx="160"
          cy="60"
          r="12"
          fill="currentColor"
          className="text-accent"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.6, type: "spring" }}
        />
        <motion.path
          d="M155 60 L160 65 L165 55"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-primary-foreground"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.8 }}
        />
      </svg>
    </motion.div>
  )
}

export function SpacedRepetitionIllustration({ className, delay = 0 }: IllustrationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <motion.circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: delay + 0.2 }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="35"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-accent"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: delay + 0.4 }}
        />
        <motion.circle
          cx="100"
          cy="100"
          r="20"
          fill="currentColor"
          className="text-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.6, type: "spring" }}
        />
        <motion.path
          d="M100 100 L100 70"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary-foreground"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.7 }}
        />
        <motion.path
          d="M100 100 L120 100"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-primary-foreground"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.8 }}
        />
      </svg>
    </motion.div>
  )
}






