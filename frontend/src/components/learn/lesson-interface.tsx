"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Circle, Loader2, BookOpen, MessageSquare, Languages, ArrowLeft, ArrowRight, GraduationCap } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LessonInterfaceProps {
  story: string
  questions: string[]
  translation: string
  grammarNotes: string
  lessonId: string
  onSubmitAnswers: (answers: string[]) => Promise<string[]>
  onLessonComplete: () => void
}

type Step = "story" | "grammar" | "questions" | "feedback"

export function LessonInterface({
  story,
  questions,
  translation,
  grammarNotes,
  lessonId,
  onSubmitAnswers,
  onLessonComplete,
}: LessonInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<Step>("story")
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""))
  const [feedback, setFeedback] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "story", label: "Story", icon: <BookOpen className="h-4 w-4" /> },
    { id: "grammar", label: "Grammar", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "questions", label: "Questions", icon: <Languages className="h-4 w-4" /> },
    { id: "feedback", label: "Feedback", icon: <CheckCircle2 className="h-4 w-4" /> },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmitAnswers = async () => {
    setIsSubmitting(true)
    try {
      const feedbackResult = await onSubmitAnswers(answers)
      setFeedback(feedbackResult)
      setCurrentStep("feedback")
    } catch (error) {
      console.error("Error submitting answers:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const allAnswersFilled = answers.every((answer) => answer.trim() !== "")

  const canGoNext = () => {
    if (currentStep === "story" || currentStep === "grammar") return true
    if (currentStep === "questions") return allAnswersFilled && !isSubmitting
    return false
  }

  const handleNext = () => {
    if (currentStep === "story") {
      setCurrentStep("grammar")
    } else if (currentStep === "grammar") {
      setCurrentStep("questions")
    } else if (currentStep === "questions" && allAnswersFilled) {
      handleSubmitAnswers()
    }
  }

  const handleBack = () => {
    if (currentStep === "grammar") {
      setCurrentStep("story")
    } else if (currentStep === "questions") {
      setCurrentStep("grammar")
    } else if (currentStep === "feedback") {
      setCurrentStep("questions")
    }
  }

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10 shrink-0">
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Interactive Lesson</h2>
            <div className="text-sm text-muted-foreground font-medium">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
          </div>

          <div className="relative w-full h-2 bg-muted rounded-full mb-4">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (index <= currentStepIndex || step.id === "feedback") {
                      setCurrentStep(step.id)
                    }
                  }}
                  disabled={index > currentStepIndex && step.id !== "feedback"}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : index < currentStepIndex
                      ? "bg-muted text-foreground hover:bg-muted/80"
                      : "bg-muted/50 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {step.icon}
                  <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-8 ${
                    index < currentStepIndex ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="max-w-5xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === "story" && (
              <motion.div
                key="story"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">German Story</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTranslation(!showTranslation)}
                    className="gap-2"
                  >
                    <Languages className="h-4 w-4" />
                    {showTranslation ? "Hide Translation" : "Show Translation"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="min-h-0 flex"
                  >
                    <Card className="h-full w-full flex flex-col min-h-0 py-4">
                      <CardHeader className=" shrink-0">
                        <CardTitle className="text-base flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Original (Deutsch)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto min-h-0">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground">
                          {story}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <AnimatePresence>
                    {showTranslation && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-0 flex"
                      >
                        <Card className="h-full w-full flex flex-col min-h-0 border-primary/20 bg-primary/5 py-4">
                          <CardHeader className="shrink-0">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Languages className="h-5 w-5 text-primary" />
                              Translation (English)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex-1 overflow-y-auto min-h-0">
                            <p className="text-lg leading-relaxed whitespace-pre-wrap text-muted-foreground">
                              {translation}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!showTranslation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center lg:col-span-2"
                    >
                      <Card className="w-full border-dashed">
                        <CardContent className="flex items-center justify-center py-12">
                          <p className="text-muted-foreground text-center">
                            Click "Show Translation" to see the English translation alongside the German story
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button size="lg" onClick={handleNext} className="gap-2">
                    Continue to Grammar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "grammar" && (
              <motion.div
                key="grammar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Grammar Notes</h3>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="py-4">
                    <CardHeader className="shrink-0">
                      <CardTitle className="text-lg">Key Grammar Points</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                          {grammarNotes}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" size="lg" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Story
                  </Button>
                  <Button size="lg" onClick={handleNext} className="gap-2">
                    Continue to Questions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "questions" && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Languages className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">Answer the Questions</h3>
                </div>

                <Card className="py-4">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Practice Your Understanding ({questions.length} questions)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {questions.map((question, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-3"
                      >
                        <label className="font-semibold text-base block">
                          <span className="text-primary mr-2">Question {index + 1}:</span>
                          {question}
                        </label>
                        <Textarea
                          value={answers[index]}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          placeholder="Type your answer here in German..."
                          className="min-h-[120px] text-base"
                          disabled={isSubmitting}
                        />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" size="lg" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Grammar
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSubmitAnswers}
                    disabled={!allAnswersFilled || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Answers
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "feedback" && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <h3 className="text-xl font-semibold">Feedback on Your Answers</h3>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Review Your Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {questions.map((question, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-4 p-4 rounded-lg border border-border bg-card"
                      >
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Question {index + 1}
                          </p>
                          <p className="font-semibold text-base">{question}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Your Answer:</p>
                          <div className="p-3 bg-muted rounded-lg border border-border">
                            <p className="text-sm leading-relaxed">{answers[index] || "No answer provided"}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Feedback:</p>
                          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm leading-relaxed text-foreground">
                              {feedback[index] || "No feedback available"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-center pt-4">
                  <Button size="lg" onClick={onLessonComplete} className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Continue to Chat
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}
