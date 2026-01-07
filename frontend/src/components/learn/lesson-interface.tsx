"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Circle, Loader2, BookOpen, MessageSquare } from "lucide-react"
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

export function LessonInterface({
  story,
  questions,
  translation,
  grammarNotes,
  lessonId,
  onSubmitAnswers,
  onLessonComplete,
}: LessonInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<"story" | "questions" | "feedback">("story")
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""))
  const [feedback, setFeedback] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)

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

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Interactive Lesson</h2>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                currentStep === "story" ? "bg-primary/10 text-primary" : "bg-muted"
              }`}>
                <Circle className={`h-4 w-4 ${currentStep === "story" ? "fill-primary" : ""}`} />
                <span className="text-sm font-medium">Story</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                currentStep === "questions" ? "bg-primary/10 text-primary" : "bg-muted"
              }`}>
                <Circle className={`h-4 w-4 ${currentStep === "questions" ? "fill-primary" : ""}`} />
                <span className="text-sm font-medium">Questions</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                currentStep === "feedback" ? "bg-primary/10 text-primary" : "bg-muted"
              }`}>
                <CheckCircle2 className={`h-4 w-4 ${currentStep === "feedback" ? "fill-primary" : ""}`} />
                <span className="text-sm font-medium">Feedback</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === "story" && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      German Story
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">{story}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Translation & Grammar</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        {showTranslation ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </CardHeader>
                  {showTranslation && (
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Translation:</h4>
                        <p className="text-muted-foreground leading-relaxed">{translation}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Grammar Notes:</h4>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {grammarNotes}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>

                <div className="flex justify-end">
                  <Button size="lg" onClick={() => setCurrentStep("questions")}>
                    Continue to Questions
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "questions" && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Answer the Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={index} className="space-y-2">
                        <label className="font-medium text-sm">
                          Question {index + 1}: {question}
                        </label>
                        <Textarea
                          value={answers[index]}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          placeholder="Type your answer here..."
                          className="min-h-[100px]"
                          disabled={isSubmitting}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep("story")}>
                    Back to Story
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSubmitAnswers}
                    disabled={!allAnswersFilled || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Answers"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "feedback" && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Feedback on Your Answers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={index} className="space-y-3 pb-6 border-b last:border-0">
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">
                            Question {index + 1}
                          </p>
                          <p className="font-medium">{question}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Your Answer:</p>
                          <p className="mt-1 p-3 bg-muted rounded-lg">{answers[index]}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Feedback:</p>
                          <p className="mt-1 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                            {feedback[index] || "No feedback available"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button size="lg" onClick={onLessonComplete}>
                    <MessageSquare className="mr-2 h-4 w-4" />
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

