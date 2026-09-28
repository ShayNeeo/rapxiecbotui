import React, { useState, useRef, useEffect } from 'react'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessageItem } from '../components/ChatMessageItem'
import { ChatInput } from '../components/ChatInput'
import { SettingsModal } from '../components/SettingsModal'
import { streamGeminiChat } from '../services/gemini'
import {
  retrieveRelevantChunks,
  retrieveRelevantChunksLocally,
  generateLocalCircusAnswer,
  buildRAGSystemInstruction,
  getKnowledgeBaseStats,
} from '../services/rag'
import { getPredefinedAnswer } from '../services/predefinedAnswers'
import { circusAudio } from '../utils/audio'
import type { ChatMessage, ChatSettings, RetrievedSource } from '../types/chat'
import { AlertTriangle, Compass } from 'lucide-react'
import { Icon } from "@/src/components/Icon";
import { useLanguage } from '@/src/context/LanguageContext'

const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'

const STORAGE_KEY_SETTINGS = 'gemini_chat_settings_v2'
const STORAGE_KEY_MESSAGES = 'gemini_chat_history_v2'

const STARTER_PROMPTS = [
  {
    icon: 'bi bi-person-arms-up',
    title: 'Xiếc đương đại vs truyền thống',
    titleEn: 'Traditional vs Contemporary',
    prompt: 'Sự khác biệt giữa xiếc truyền thống và xiếc đương đại?',
    promptEn: 'What is the difference between traditional and contemporary circus?',
  },
  {
    icon: 'bi bi-bullseye',
    title: 'Kỹ thuật khó & Tiết mục hay',
    titleEn: 'Technique & Performance Quality',
    prompt: 'Kỹ thuật khó có quyết định một tiết mục hay hay không?',
    promptEn: 'Does difficult technique determine whether a performance is good?',
  },
  {
    icon: 'bi bi-globe-americas',
    title: 'Ảnh hưởng văn hóa xiếc',
    titleEn: 'Cultural Influences',
    prompt: 'Xiếc Việt Nam chịu ảnh hưởng từ những nền văn hóa nào?',
    promptEn: 'Which cultures have influenced Vietnamese circus?',
  },
  {
    icon: '🎪',
    title: 'Nguồn gốc nghệ thuật xiếc',
    titleEn: 'Origin of Circus Arts',
    prompt: 'Xiếc bắt đầu từ khi nào và ở đâu?',
    promptEn: 'When and where did circus art begin?',
  },
  {
    icon: 'bi bi-file-earmark-text',
    title: 'Giai đoạn phát triển xiếc Việt',
    titleEn: 'Developmental Milestones',
    prompt: 'Từng giai đoạn phát triển trong xiếc Việt Nam',
    promptEn: 'What are the developmental stages of Vietnamese circus?',
  },
  {
    icon: 'bi bi-stopwatch',
    title: 'Trở thành diễn viên xiếc',
    titleEn: 'Artist Training Duration',
    prompt: 'Mất bao lâu để trở thành diễn viên xiếc đương đại',
    promptEn: 'How long does it take to become a contemporary circus artist?',
  },
  {
    icon: 'bi bi-lightning-charge',
    title: 'Khó khăn & Thách thức',
    titleEn: 'Challenges & Hardships',
    prompt: 'Khó khăn và thách thức nhất của một diễn viên xiếc?',
    promptEn: 'What are the biggest challenges faced by a circus performer?',
  },
  {
    icon: 'bi bi-stars',
    title: 'Yếu tố quyết định xiếc',
    titleEn: 'Decisive Performance Factors',
    prompt: 'Yếu tố quyết định của một màn trình diễn xiếc đương đại',
    promptEn: 'What factors determine a contemporary circus performance?',
  },
  {
    icon: 'bi bi-geo-alt',
    title: 'Địa điểm biểu diễn & Mua vé',
    titleEn: 'Venues & Ticket Booking',
    prompt: 'Các đoàn xiếc Việt Nam thường biểu diễn ở đâu?',
    promptEn: 'Where do Vietnamese circus troupes perform and how to book tickets?',
  },
  {
    icon: 'bi bi-universal-access',
    title: 'Vì sao không còn xiếc thú?',
    titleEn: 'Why No Circus Animals?',
    prompt: 'Vì sao ngày nay nhiều chương trình xiếc không còn sử dụng động vật',
    promptEn: 'Why do modern circus shows no longer use animals?',
  },
  {
    icon: 'bi bi-people',
    title: 'Độ tuổi & Khán giả phù hợp',
    titleEn: 'Target Audience & Age',
    prompt: 'Xiếc phù hợp với tệp khán giả nào?',
    promptEn: 'Which audience age group is circus suitable for?',
  },
  {
    icon: 'bi bi-tree',
    title: 'Đạo cụ truyền thống phổ biến',
    titleEn: 'Traditional Circus Props',
    prompt: 'Có những đạo cụ truyền thống nào phổ biến trong xiếc?',
    promptEn: 'What are the common traditional props in circus?',
  },
  {
    icon: '🎪',
    title: 'Xiếc đương đại là gì?',
    titleEn: 'What is Contemporary Circus?',
    prompt: 'Thông tin về xiếc đương đại Việt Nam',
    promptEn: 'Information about Vietnamese contemporary circus',
  },
]

const getCurrentTimestamp = () => Date.now()

/**
 * Hiệu ứng hiển thị chữ chạy từ từ (typewriter streaming) cho câu trả lời
 */
function streamTextGradually(
  fullText: string,
  onChunk: (chunkText: string) => void,
  signal?: AbortSignal,
  chunkSize = 3,
  intervalMs = 16
): Promise<void> {
  return new Promise((resolve) => {
    let currentIndex = 0
    const intervalId = setInterval(() => {
      if (signal?.aborted) {
        clearInterval(intervalId)
        resolve()
        return
      }

      currentIndex = Math.min(currentIndex + chunkSize, fullText.length)
      onChunk(fullText.slice(0, currentIndex))

      if (currentIndex >= fullText.length) {
        clearInterval(intervalId)
        resolve()
      }
    }, intervalMs)
  })
}

interface ChatbotPageProps {
  onBackToPortal?: () => void
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({ onBackToPortal }) => {
  const { isEn, setLanguage } = useLanguage()
  const kbStats = getKnowledgeBaseStats()

  // Automatically switch to English mode when accessing Chatbot for the ENG section
  useEffect(() => {
    setLanguage('en')
  }, [])

  const [settings, setSettings] = useState<ChatSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // Fallback
    }
    return {
      apiKey: DEFAULT_API_KEY,
      model: DEFAULT_MODEL,
      systemPrompt: 'You are an AI Assistant with deep expertise and enthusiasm for Vietnamese and global circus arts. Provide eloquent, structured, and informative responses in English.',
      temperature: 0.7,
      ragEnabled: true,
    }
  })

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // Fallback
    }
    return []
  })

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
    } catch {
      // Ignore
    }
  }, [settings])

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages))
    } catch {
      // Ignore
    }
  }, [messages])

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isStreaming])

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt ?? input).trim()
    if (!textToSend || isLoading) return

    circusAudio.playBambooStep()
    setErrorMessage(null)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend,
      timestamp: getCurrentTimestamp(),
    }

    const assistantPlaceholderId = crypto.randomUUID()
    const assistantPlaceholder: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: getCurrentTimestamp(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages([...updatedMessages, assistantPlaceholder])
    setInput('')
    setIsLoading(true)

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    // Predefined answers: Always output exact response for circus queries
    const predefined = getPredefinedAnswer(textToSend, isEn ? 'en' : 'vi')
    if (predefined) {
      setTimeout(async () => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? {
                  ...msg,
                  sources: predefined.sources,
                }
              : msg
          )
        )
        setIsLoading(false)
        setIsStreaming(true)

        await streamTextGradually(
          predefined.answer,
          (chunkText) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantPlaceholderId
                  ? { ...msg, content: chunkText }
                  : msg
              )
            )
          },
          abortController.signal
        )

        setIsStreaming(false)
        abortControllerRef.current = null
        circusAudio.playBambooStep()
      }, 250)
      return
    }

    // Mode 1: No API Key configured -> Use local knowledge base retrieval & synthesis
    if (!settings.apiKey.trim()) {
      setTimeout(async () => {
        const localSources = retrieveRelevantChunksLocally(textToSend, 3)
        const localReply = generateLocalCircusAnswer(textToSend, localSources, isEn ? 'en' : 'vi')

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? {
                  ...msg,
                  sources: localSources,
                }
              : msg
          )
        )
        setIsLoading(false)
        setIsStreaming(true)

        await streamTextGradually(
          localReply,
          (chunkText) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantPlaceholderId
                  ? { ...msg, content: chunkText }
                  : msg
              )
            )
          },
          abortController.signal
        )

        setIsStreaming(false)
        abortControllerRef.current = null
        circusAudio.playBambooStep()
      }, 300)
      return
    }

    // Mode 2: API Key is configured -> Live Gemini Streaming with Vector RAG
    setIsStreaming(true)

    try {
      let retrievedSources: RetrievedSource[] = []
      let effectiveSystemPrompt = settings.systemPrompt

      // If RAG is enabled, retrieve relevant knowledge base chunks using embedding
      if (settings.ragEnabled) {
        try {
          retrievedSources = await retrieveRelevantChunks(
            textToSend,
            settings.apiKey,
            3,
            0.55
          )
        } catch (embedErr) {
          console.warn('Vector embedding API call failed, falling back to local search:', embedErr)
          retrievedSources = retrieveRelevantChunksLocally(textToSend, 3)
        }

        if (retrievedSources.length > 0) {
          effectiveSystemPrompt = buildRAGSystemInstruction(
            settings.systemPrompt,
            retrievedSources
          )
        }
      }

      // Attach retrieved sources to assistant message for UI citation
      if (retrievedSources.length > 0) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? { ...msg, sources: retrievedSources }
              : msg
          )
        )
      }

      const activeSettings: ChatSettings = {
        ...settings,
        systemPrompt: effectiveSystemPrompt,
      }

      await streamGeminiChat(
        updatedMessages,
        activeSettings,
        (currentText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantPlaceholderId
                ? { ...msg, content: currentText }
                : msg
            )
          )
        },
        abortController.signal
      )
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Stream aborted by user, leave content intact
      } else {
        const errorText =
          err instanceof Error
            ? err.message
            : isEn
            ? 'An unexpected error occurred while communicating with Gemini API.'
            : 'Đã xảy ra lỗi không mong muốn khi giao tiếp với máy chủ Gemini.'

        setErrorMessage(errorText)

        // Fallback to local search if remote LLM fails
        const fallbackSources = retrieveRelevantChunksLocally(textToSend, 3)
        const fallbackReply = generateLocalCircusAnswer(textToSend, fallbackSources, isEn ? 'en' : 'vi')
        const fullFallbackText = isEn
          ? `${fallbackReply}\n\n*(Note: Gemini remote API message: ${errorText})*`
          : `${fallbackReply}\n\n*(Lưu ý: API Gemini gặp thông báo: ${errorText})*`

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? {
                  ...msg,
                  sources: fallbackSources,
                }
              : msg
          )
        )

        await streamTextGradually(
          fullFallbackText,
          (chunkText) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantPlaceholderId
                  ? { ...msg, content: chunkText }
                  : msg
              )
            )
          },
          abortController.signal
        )
      }
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleClearChat = () => {
    if (isLoading) handleStop()
    circusAudio.playBambooStep()
    setMessages([])
    setErrorMessage(null)
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES)
    } catch {
      // Ignore
    }
  }

  const toggleRag = () => {
    circusAudio.playBambooStep()
    setSettings((prev) => ({
      ...prev,
      ragEnabled: !prev.ragEnabled,
    }))
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#8a181b] via-[#741316] to-[#5a0c0f] font-sans text-white select-none">
      <ChatHeader
        model={settings.model}
        ragEnabled={settings.ragEnabled}
        onToggleRag={toggleRag}
        chunkCount={kbStats.totalChunks}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClearChat={handleClearChat}
        messageCount={messages.length}
        onBackToPortal={onBackToPortal}
      />

      {/* Main chat viewport */}
      <main className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-[#8a181b]/90 via-[#731215]/95 to-[#5a0c0f]">
        <div className="mx-auto max-w-4xl space-y-3">
          {/* Banner if API key is not configured */}
          {!settings.apiKey.trim() && (
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border-2 border-amber-400/80 bg-amber-50/95 p-3.5 text-xs text-amber-950 shadow-md">
              <div className="flex items-center gap-2.5">
                <Compass className="h-4 w-4 shrink-0 text-amber-700" />
                <span>
                  <strong>{isEn ? "Local Knowledge Mode:" : "Chế độ Tra Cứu Cục Bộ:"}</strong>{" "}
                  {isEn
                    ? "Operating with 17 curated Vietnamese circus documents. You can explore questions immediately or add a Gemini API Key in Settings for live generative AI."
                    : "Đang hoạt động với 17 tư liệu xiếc Việt Nam. Bạn có thể hỏi đáp ngay hoặc thêm API Key trong Cài đặt để kích hoạt AI tạo sinh trực tiếp."}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="shrink-0 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1.5 font-bold text-red-950 hover:from-amber-300 hover:to-amber-400 shadow-xs cursor-pointer transition-all active:scale-95"
              >
                {isEn ? "Enter API Key" : "Nhập API Key"}
              </button>
            </div>
          )}

          {/* Banner if errorMessage is present */}
          {errorMessage && (
            <div className="mb-4 flex items-center justify-between rounded-2xl border-2 border-red-300 bg-red-100/95 p-3 text-xs text-red-900 shadow-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-red-700 hover:text-red-950 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Empty state with prompt starters */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center animate-in fade-in duration-300">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-red-950 mb-4 shadow-xl ring-4 ring-amber-400/30">
                <span className="text-3xl">🎪</span>
              </div>
              <h2 className="font-circus text-2xl sm:text-3xl tracking-wide text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                {isEn ? "AI CIRCUS CONSULTANT" : "TƯ VẤN VIÊN AI"}
              </h2>
              <p className="mt-2.5 max-w-lg text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
                {isEn
                  ? "Circus arts knowledge is vast and you might have unanswered questions? We are here to answer everything for you!"
                  : "Thông tin về nghệ thuật xiếc khá rộng lớn nhưng bạn vẫn chưa giải đáp được? Hãy đến đây, chúng tôi sẽ trả lời tất tần tật các câu hỏi của bạn!"}
              </p>

              {/* Grid of Starter Prompts */}
              <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {STARTER_PROMPTS.map((item, idx) => {
                  const title = isEn ? item.titleEn : item.title
                  const prompt = isEn ? item.promptEn : item.prompt
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="flex flex-col items-start gap-1.5 rounded-2xl border-2 border-amber-400/40 bg-[#8c1c1f]/85 p-4 text-left text-amber-100 shadow-md transition-all duration-200 hover:border-amber-300 hover:bg-[#9e1f24] hover:text-white group cursor-pointer active:scale-98"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg"><Icon name={item.icon} /></span>
                        <span className="font-bold text-amber-300 group-hover:text-amber-200 text-xs">
                          {title}
                        </span>
                      </div>
                      <span className="text-[11px] leading-relaxed text-amber-100/80 group-hover:text-white">
                        {prompt}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                isStreaming={
                  isStreaming &&
                  index === messages.length - 1 &&
                  message.role === 'assistant'
                }
              />
            ))
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input bar */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={() => handleSend()}
        onStop={handleStop}
        isLoading={isLoading}
        disabled={false}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => setSettings(newSettings)}
        defaultApiKey={DEFAULT_API_KEY}
      />
    </div>
  )
}

export default ChatbotPage
