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
import { Sparkles, AlertTriangle, Compass } from 'lucide-react'

const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'

const STORAGE_KEY_SETTINGS = 'gemini_chat_settings_v2'
const STORAGE_KEY_MESSAGES = 'gemini_chat_history_v2'

const STARTER_PROMPTS = [
  {
    icon: '🤹',
    title: 'Xiếc đương đại vs truyền thống',
    prompt: 'Sự khác biệt giữa xiếc truyền thống và xiếc đương đại?',
  },
  {
    icon: '⏱️',
    title: 'Trở thành diễn viên xiếc',
    prompt: 'Mất bao lâu để trở thành diễn viên xiếc đương đại?',
  },
  {
    icon: '💪',
    title: 'Khó khăn & Thách thức',
    prompt: 'Khó khăn và thách thức nhất của một diễn viên xiếc?',
  },
  {
    icon: '✨',
    title: 'Giá trị xiếc đương đại',
    prompt: 'Những yếu tố nào quyết định giá trị nghệ thuật của một tác phẩm xiếc đương đại?',
  },
  {
    icon: '📍',
    title: 'Địa điểm biểu diễn xiếc',
    prompt: 'Các đoàn xiếc Việt Nam thường biểu diễn ở đâu?',
  },
  {
    icon: '🎟️',
    title: 'Mua vé xem xiếc',
    prompt: 'mua vé ở đâu',
  },
]

const getCurrentTimestamp = () => Date.now()

interface ChatbotPageProps {
  onBackToPortal?: () => void
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({ onBackToPortal }) => {
  const kbStats = getKnowledgeBaseStats()

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
      systemPrompt: 'Bạn là Trợ lý AI am hiểu sâu sắc và nhiệt tình về nghệ thuật xiếc đương đại Việt Nam.',
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

    // Predefined answers: Always output exact response for circus venue & ticket inquiries
    const predefined = getPredefinedAnswer(textToSend)
    if (predefined) {
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? {
                  ...msg,
                  content: predefined.answer,
                  sources: predefined.sources,
                }
              : msg
          )
        )
        setIsLoading(false)
        circusAudio.playBambooStep()
      }, 300)
      return
    }

    // Mode 1: No API Key configured -> Use local knowledge base retrieval & synthesis
    if (!settings.apiKey.trim()) {
      setTimeout(() => {
        const localSources = retrieveRelevantChunksLocally(textToSend, 3)
        const localReply = generateLocalCircusAnswer(textToSend, localSources)

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? {
                  ...msg,
                  content: localReply,
                  sources: localSources,
                }
              : msg
          )
        )
        setIsLoading(false)
        circusAudio.playBambooStep()
      }, 350)
      return
    }

    // Mode 2: API Key is configured -> Live Gemini Streaming with Vector RAG
    setIsStreaming(true)
    const abortController = new AbortController()
    abortControllerRef.current = abortController

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
            : 'Đã xảy ra lỗi không mong muốn khi giao tiếp với máy chủ Gemini.'

        setErrorMessage(errorText)

        // Fallback to local search if remote LLM fails
        const fallbackSources = retrieveRelevantChunksLocally(textToSend, 3)
        const fallbackReply = generateLocalCircusAnswer(textToSend, fallbackSources)

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? {
                  ...msg,
                  content: `${fallbackReply}\n\n*(Lưu ý: API Gemini gặp thông báo: ${errorText})*`,
                  sources: fallbackSources,
                }
              : msg
          )
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
                  <strong>Chế độ Tra Cứu Cục Bộ:</strong> Đang hoạt động với 17 tư liệu xiếc Việt Nam. Bạn có thể hỏi đáp ngay hoặc thêm API Key trong Cài đặt để kích hoạt AI tạo sinh trực tiếp.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="shrink-0 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1.5 font-bold text-red-950 hover:from-amber-300 hover:to-amber-400 shadow-xs cursor-pointer transition-all active:scale-95"
              >
                Nhập API Key
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
                TRỢ LÝ XIẾC ĐƯƠNG ĐẠI VIỆT NAM
              </h2>
              <p className="mt-2.5 max-w-lg text-xs sm:text-sm text-amber-100/90 leading-relaxed font-medium">
                Khám phá kho tư liệu 100 năm nghệ thuật xiếc, các vở diễn đặc sắc (À Ố Show, Mơ Show), nghệ sĩ Cụ Tạ Duy Hiển, kỷ lục Quốc Cơ - Quốc Nghiệp và địa chỉ các rạp xiếc lớn.
              </p>

              {/* Grid of Starter Prompts */}
              <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {STARTER_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(item.prompt)}
                    className="flex flex-col items-start gap-1.5 rounded-2xl border-2 border-amber-400/40 bg-[#8c1c1f]/85 p-4 text-left text-amber-100 shadow-md transition-all duration-200 hover:border-amber-300 hover:bg-[#9e1f24] hover:text-white group cursor-pointer active:scale-98"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-bold text-amber-300 group-hover:text-amber-200 text-xs">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[11px] leading-relaxed text-amber-100/80 group-hover:text-white">
                      {item.prompt}
                    </span>
                  </button>
                ))}
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
