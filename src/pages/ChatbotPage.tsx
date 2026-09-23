import React, { useState, useRef, useEffect } from 'react'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessageItem } from '../components/ChatMessageItem'
import { ChatInput } from '../components/ChatInput'
import { SettingsModal } from '../components/SettingsModal'
import { streamGeminiChat } from '../services/gemini'
import {
  retrieveRelevantChunks,
  buildRAGSystemInstruction,
  getKnowledgeBaseStats,
} from '../services/rag'
import type { ChatMessage, ChatSettings, RetrievedSource } from '../types/chat'
import { Bot, Sparkles, AlertTriangle } from 'lucide-react'

const DEFAULT_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.5-flash-lite'

const STORAGE_KEY_SETTINGS = 'gemini_chat_settings_v2'
const STORAGE_KEY_MESSAGES = 'gemini_chat_history_v2'

const STARTER_PROMPTS = [
  'À Ố Show diễn ở đâu tại TP.HCM và sử dụng những đạo cụ gì?',
  'NSND Tạ Duy Hiển có vai trò và đóng góp gì cho xiếc Việt Nam?',
  'Xiếc đương đại khác biệt thế nào so với xiếc truyền thống?',
  'Vì sao các chương trình xiếc ngày nay không còn sử dụng động vật?',
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
      systemPrompt: 'You are a helpful, accurate, and concise AI assistant.',
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

    setErrorMessage(null)

    if (!settings.apiKey.trim()) {
      setIsSettingsOpen(true)
      return
    }

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
    setIsStreaming(true)

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      let retrievedSources: RetrievedSource[] = []
      let effectiveSystemPrompt = settings.systemPrompt

      // If RAG is enabled, retrieve relevant knowledge base chunks using gemini-embedding-2
      if (settings.ragEnabled) {
        retrievedSources = await retrieveRelevantChunks(
          textToSend,
          settings.apiKey,
          3,
          0.55
        )
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
            : 'An unexpected error occurred while communicating with Gemini.'

        setErrorMessage(errorText)

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? {
                  ...msg,
                  content: `⚠️ **Error encountered:**\n\n${errorText}\n\n*Tip: Check your API key and model selection in Settings.*`,
                  isError: true,
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
    setMessages([])
    setErrorMessage(null)
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES)
    } catch {
      // Ignore
    }
  }

  const toggleRag = () => {
    setSettings((prev) => ({
      ...prev,
      ragEnabled: !prev.ragEnabled,
    }))
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50 font-sans text-slate-800">
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
      <main className="flex-1 overflow-y-auto px-4 py-6 bg-slate-50">
        <div className="mx-auto max-w-4xl space-y-2">
          {/* Banner if API key is not configured */}
          {!settings.apiKey.trim() && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-800 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span>Chưa cấu hình API Key. Vui lòng thêm khóa để bắt đầu trò chuyện.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="rounded-lg bg-amber-200/80 px-3 py-1 font-medium text-amber-900 hover:bg-amber-300 cursor-pointer"
              >
                Cấu hình
              </button>
            </div>
          )}

          {/* Banner if errorMessage is present */}
          {errorMessage && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Empty state with prompt starters */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 mb-4 shadow-sm">
                <Bot className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
                Hỏi đáp về Xiếc đương đại Việt Nam
              </h2>
              <p className="mt-2 max-w-md text-xs text-slate-500">
                Powered by Google Gemini (<code className="text-blue-600 font-semibold">{settings.model}</code>) &{' '}
                <span className="text-emerald-600 font-medium">Gemini Embedding 2</span> RAG
                (17 clean knowledge chunks).
              </p>

              <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 text-left text-xs text-slate-700 shadow-xs transition hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-900 group cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 shrink-0 text-blue-500 group-hover:text-blue-600 mt-0.5" />
                    <span>{prompt}</span>
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
        disabled={!settings.apiKey.trim()}
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
