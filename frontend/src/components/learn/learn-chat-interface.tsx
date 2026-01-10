"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, BookPlus, X } from "lucide-react"
import { useAuth } from "@/lib/providers/auth-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api/client"
import { LessonInterface } from "./lesson-interface"

const USE_MOCK_API = false

const MOCK_LESSON_RESPONSE = {
  lesson_id: "e10f08bc-854b-48f4-a4dc-2a2fa72a593e",
  story: "Als ich im Sommer auf den Bergen unterwegs war, hatte ich das Gefühl, wie ein Schmetterling durch einen Wäldchen flatternd. Die Berge waren so majestätisch und tief in die Lüfte gerückt, dass es mich immer wieder begeisterte, sie zu erkunden. Ich wanderte entlang des Bergpfades und hörte den Geräuschen der Natur nach: der lauten Donau, das leisere Flattern von Wind über den Felsen und die leiseren Rufe anderer Wanderer. Die Luft war frisch und klar, und ich spürte die Kraft der Berge in mir. Als ich an einem Wasserfall vorbeiging, hatte ich das Gefühl, dass ich durch ein magisches Portal geführt wurde – es schien, als hätte ich den Himmel auf mich zukommen lassen. Ich war so glücklich und voller Energie, dass ich nicht daran dachte, zu Heimreise. Stattdessen entschied ich, die Berge weiter zu erkunden und mir ihre Geheimnisse anzuschauen.",
  questions: [
    "Was passiert, wenn man durch ein magisches Portal auf den Berg führt?",
    "Welche Gefühle empfand der Schüler, als er an einem Wasserfall vorbeiging?",
    "Warum empfand der Schüler das Gefühl, durch das Portal geführt zu werden?",
    "Gibt es spezielle Wahrnehmungen, die man bei solchen Naturerlebnissen hat?",
    "Welche Details des Ortes und seiner Umgebung hebt der Schüler besonders hervor?",
  ],
  grammar: "In German sentences, the subject usually comes first (e.g., 'Ich' in 'Ich bin begeistert'). Adjectives typically follow the noun they modify (e.g., 'wilde Berge' for 'mountains'). Verbs often come last (e.g., 'wanderte' after 'am Bergpfad und...').",
  translation: "when I was traveling in the summer on hills, I felt like a butterfly flitting through a meadow. The mountains were so majestic and deep into the sky that it always thrilled me to explore them. I walked along the mountain path and heard the sounds of nature: the loud Donau, the gentle fluttering of wind over rocks, and the softer calls of other hikers. The air was fresh and clear, and I felt the power of the mountains in me. When I reached a waterfall, I felt like I had been transported through a magical portal - it seemed as if I had let heaven fall upon me. I was so happy and full of energy that I didn't even think about going home. Instead, I decided to continue exploring the mountains and looking at their secrets.",
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface LearnChatInterfaceProps {
  sessionId?: string
}

interface LessonData {
  lessonId: string
  story: string
  questions: string[]
  translation: string
  grammarNotes: string
}

export function LearnChatInterface({ sessionId }: LearnChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [lessonData, setLessonData] = useState<LessonData | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [tooltipState, setTooltipState] = useState<{
    messageId: string
    position: { x: number; y: number }
    text: string
    selectedWord: string
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setTooltipState(null)
      }
    }

    if (tooltipState) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [tooltipState])

  useEffect(() => {
    if (sessionId) {
      setMessages([])
      setShowWelcome(true)
    }
  }, [sessionId])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    if (showWelcome) {
      setShowWelcome(false)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're interested in "${userMessage.content}". This feature is coming soon! I'll help you learn German through interactive stories based on your ${user?.level || "beginner"} level.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const genres = [
    { title: "Adventure", description: "Exciting journeys and thrilling experiences", message: "Create an adventure story" },
    { title: "Mystery", description: "Solve puzzles and uncover secrets", message: "Create a mystery story" },
    { title: "Drama", description: "Emotional and engaging life stories", message: "Create a drama story" },
    { title: "Comedy", description: "Funny and lighthearted stories", message: "Create a comedy story" },
  ]

  const getWordAtPosition = (element: HTMLElement, x: number, y: number): { word: string; rect: DOMRect | null } => {
    const range = document.caretRangeFromPoint?.(x, y) || (document as any).caretPositionFromPoint?.(x, y)
    if (!range) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const selRange = selection.getRangeAt(0)
        const selectedText = selection.toString().trim()
        if (selectedText) {
          const words = selectedText.split(/\s+/)
          const word = words[0] || selectedText
          return { word, rect: selRange.getBoundingClientRect() }
        }
      }
      return { word: "", rect: null }
    }

    const textNode = range.startContainer
    if (textNode.nodeType !== Node.TEXT_NODE) {
      return { word: "", rect: null }
    }

    const text = textNode.textContent || ""
    const offset = range.startOffset

    let start = offset
    let end = offset

    while (start > 0 && /\S/.test(text[start - 1])) {
      start--
    }
    while (end < text.length && /\S/.test(text[end])) {
      end++
    }

    const word = text.substring(start, end).trim()
    if (!word) {
      return { word: "", rect: null }
    }

    const wordRange = document.createRange()
    wordRange.setStart(textNode, start)
    wordRange.setEnd(textNode, end)
    const rect = wordRange.getBoundingClientRect()

    return { word, rect }
  }

  const handleDoubleClick = (message: Message, event: React.MouseEvent) => {
    if (message.role !== "assistant") return

    const target = event.currentTarget as HTMLElement
    const { word, rect } = getWordAtPosition(target, event.clientX, event.clientY)
    
    if (!word || !rect) {
      return
    }

    setTooltipState({
      messageId: message.id,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top,
      },
      text: message.content,
      selectedWord: word,
    })
  }

  const handleAddToVocabulary = (text: string) => {
    console.log("Adding to vocabulary:", text)
    setTooltipState(null)
  }

  const getTranslation = (word: string): string => {
    return `Translation of "${word}"`
  }

  const mockApiCall = async (): Promise<{
    lesson_id: string
    story: string
    questions: string[]
    grammar: string
    translation: string
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return MOCK_LESSON_RESPONSE
  }

  const handleTopicSelect = async (message: string) => {
    setShowWelcome(false)
    setIsLoading(true)
    
    const topic = message.replace(/^Create (an? |a )?/, "").replace(/ story$/i, "").trim()

    try {
      let response: {
        lesson_id: string
        story: string
        questions: string[]
        grammar: string
        translation: string
      }

      if (USE_MOCK_API) {
        response = await mockApiCall()
      } else {
        const level = (user?.level || "beginner") as "beginner" | "intermediate" | "advanced"
        response = await api.post<{
          lesson_id: string
          story: string
          questions: string[]
          grammar: string
          translation: string
        }>("/lesson/start", {
          level: level,
          topic: topic,
        })
      }

      setLessonData({
        lessonId: response.lesson_id,
        story: response.story,
        questions: response.questions,
        translation: response.translation,
        grammarNotes: response.grammar,
      })
    } catch (error) {
      console.error("Error starting lesson:", error)
      setShowWelcome(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAnswers = async (answers: string[]): Promise<string[]> => {
    if (!lessonData) return []

    const response = await api.post<{ feedback: string[] }>(
      `/lesson/${lessonData.lessonId}/answer`,
      { answers }
    )

    return response.feedback
  }

  const handleLessonComplete = () => {
    setShowChat(true)
    
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "Great job completing the lesson! Feel free to ask me any questions about the story or German language in general.",
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  if (lessonData && !showChat) {
    return (
      <div className="h-full">
        <LessonInterface
          story={lessonData.story}
          questions={lessonData.questions}
          translation={lessonData.translation}
          grammarNotes={lessonData.grammarNotes}
          lessonId={lessonData.lessonId}
          onSubmitAnswers={handleSubmitAnswers}
          onLessonComplete={handleLessonComplete}
        />
      </div>
    )
  }

  return (
    <div className={`flex h-full bg-background ${showChat ? "flex-row" : "flex-col"}`}>
      {showChat && lessonData && (
        <div className="w-1/2 border-r h-full">
          <LessonInterface
            story={lessonData.story}
            questions={lessonData.questions}
            translation={lessonData.translation}
            grammarNotes={lessonData.grammarNotes}
            lessonId={lessonData.lessonId}
            onSubmitAnswers={handleSubmitAnswers}
            onLessonComplete={() => {}}
          />
        </div>
      )}

      <div className={`flex flex-col h-full bg-background ${showChat ? "w-1/2" : "w-full"}`}>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto p-6 space-y-6">
              {showWelcome && messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 py-12 flex flex-col items-center justify-center min-h-[60vh]"
              >
                <div className="text-center space-y-4 max-w-2xl">
                  <h1 className="text-4xl font-bold">Choose an interesting topic (for story)</h1>
                  <p className="text-muted-foreground text-lg">
                    Select a story genre that interests you and I'll create an interactive German learning story based on your level.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {genres.map((genre, index) => (
                    <motion.button
                      key={genre.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleTopicSelect(genre.message)}
                      className="p-6 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors group text-left"
                    >
                      <div className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {genre.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {genre.description}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs text-center text-muted-foreground"
                >
                  Make sure you agree to our{" "}
                  <a href="#" className="underline hover:text-foreground">Terms</a> and our{" "}
                  <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
                </motion.p>
              </motion.div>
            ) : (
              <div className="space-y-4 py-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="relative max-w-[85%]">
                        <Card
                          className={`rounded-xl ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                          onDoubleClick={(e) => handleDoubleClick(message, e)}
                        >
                          <CardContent className="p-4">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.content}
                            </p>
                          </CardContent>
                        </Card>
                        {tooltipState?.messageId === message.id && (
                          <motion.div
                            ref={tooltipRef}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="fixed z-50 w-80 bg-background border border-border rounded-xl shadow-lg p-4"
                            style={{
                              left: `${tooltipState.position.x}px`,
                              top: `${tooltipState.position.y}px`,
                              transform: "translate(-50%, calc(-100% - 8px))",
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-sm">Translation</h4>
                              <button
                                onClick={() => setTooltipState(null)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              <span className="font-medium">{tooltipState.selectedWord}</span>
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">
                              {getTranslation(tooltipState.selectedWord)}
                            </p>
                            <Button
                              onClick={() => handleAddToVocabulary(tooltipState.selectedWord)}
                              className="w-full rounded-xl"
                              size="sm"
                            >
                              <BookPlus className="h-4 w-4 mr-2" />
                              Add to Vocabulary
                            </Button>
                          </motion.div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <Card className="bg-muted rounded-xl">
                      <CardContent className="p-4">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-muted-foreground"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="border-t bg-background">
          <div className="max-w-3xl mx-auto p-3.5">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  disabled={isLoading}
                  className="min-h-[52px] resize-none rounded-xl"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[52px] w-[52px] bg-primary hover:bg-primary/90 rounded-xl"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

