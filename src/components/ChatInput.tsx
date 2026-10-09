import React, { useRef, useEffect } from 'react'
import { ArrowUp, Square, Sparkles } from 'lucide-react'
import { useLanguage } from '@/src/context/LanguageContext'
import { Icon } from '@/src/components/Icon'

export interface StarterPromptItem {
  icon: string
  title: string
  titleEn: string
  prompt: string
  promptEn: string
}

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSend: () => void
  onStop: () => void
  isLoading: boolean
  disabled?: boolean
  starterPrompts?: StarterPromptItem[]
  onSelectPrompt?: (prompt: string) => void
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isLoading,
  disabled = false,
  starterPrompts = [],
  onSelectPrompt,
}) => {
  const { isEn } = useLanguage()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim() && !disabled) {
        onSend()
      }
    }
  }

  return (
    <div className="relative border-t-4 border-amber-400 bg-gradient-to-r from-[#88171a] via-[#751215] to-[#600e11] pt-2 pb-3 sm:pb-4 px-3 sm:px-4 text-white shadow-2xl backdrop-blur-md">
      <div className="mx-auto max-w-4xl">
        {/* Horizontal Suggested Questions Row */}
        {starterPrompts && starterPrompts.length > 0 && (
          <div className="mb-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-amber-400/30 scrollbar-track-transparent">
              <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-amber-300/90 pl-0.5 pr-1 uppercase tracking-wider">
                <Sparkles className="h-3 w-3 text-amber-300" />
                <span className="hidden sm:inline">{isEn ? 'Suggestions:' : 'Gợi ý:'}</span>
              </span>
              {starterPrompts.map((item, idx) => {
                const label = isEn ? item.titleEn : item.title
                const promptText = isEn ? item.promptEn : item.prompt
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (onSelectPrompt) {
                        onSelectPrompt(promptText)
                      } else {
                        setInput(promptText)
                      }
                    }}
                    disabled={isLoading || disabled}
                    title={promptText}
                    className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400/50 bg-red-950/70 hover:bg-amber-400 hover:border-amber-300 px-3 py-1 text-xs font-semibold text-amber-200 hover:text-red-950 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-40"
                  >
                    <span className="text-xs group-hover:scale-110 transition-transform">
                      <Icon name={item.icon} />
                    </span>
                    <span className="whitespace-nowrap tracking-tight">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        <div className="relative flex items-end rounded-2xl border-2 border-amber-400/90 bg-[#fffdf9] p-2 shadow-lg transition focus-within:border-amber-300 focus-within:ring-4 focus-within:ring-amber-400/30">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled
                ? (isEn ? 'Please configure Gemini API key in Settings...' : 'Vui lòng cấu hình API key trong Cài đặt...')
                : (isEn ? 'Ask anything about Vietnamese contemporary & classical circus... (Enter to send, Shift+Enter for newline)' : 'Hỏi bất kỳ điều gì về xiếc đương đại Việt Nam... (Enter để gửi, Shift+Enter để xuống dòng)')
            }
            className="max-h-44 min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none disabled:opacity-50"
          />

          <div className="flex shrink-0 items-center gap-1.5 pb-1 pr-1">
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-800 text-amber-200 border border-amber-400 hover:bg-red-700 transition active:scale-95 cursor-pointer shadow-sm"
                title={isEn ? "Stop generating" : "Dừng phản hồi"}
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSend}
                disabled={!input.trim() || disabled}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-red-950 font-bold border border-amber-300 ring-2 ring-amber-400/40 transition hover:from-amber-300 hover:to-amber-400 disabled:opacity-30 disabled:hover:from-amber-400 disabled:hover:to-amber-500 active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer"
                title={isEn ? "Send inquiry" : "Gửi câu hỏi"}
              >
                <ArrowUp className="h-4 w-4 stroke-[3]" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] font-medium text-amber-200/80">
          {isEn
            ? "🎪 AI Circus Consultant • Powered by Vietnam Circus Knowledge Base & Google Gemini"
            : "🎪 Tư vấn viên AI • Hỗ trợ bởi RAG Tri Thức Xiếc Việt Nam & Google Gemini"}
        </p>
      </div>
    </div>
  )
}
