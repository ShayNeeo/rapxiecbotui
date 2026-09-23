import React, { useRef, useEffect } from 'react'
import { ArrowUp, Square } from 'lucide-react'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSend: () => void
  onStop: () => void
  isLoading: boolean
  disabled?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isLoading,
  disabled = false,
}) => {
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
    <div className="relative border-t border-slate-200 bg-white/95 p-4 backdrop-blur-md">
      <div className="mx-auto max-w-4xl">
        <div className="relative flex items-end rounded-2xl border border-slate-300 bg-slate-50/80 p-2 shadow-xs transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={
              disabled
                ? 'Vui lòng cấu hình API key trong Cài đặt...'
                : 'Hỏi bất kỳ điều gì về xiếc đương đại Việt Nam... (Enter để gửi, Shift+Enter để xuống dòng)'
            }
            className="max-h-44 min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-50"
          />

          <div className="flex shrink-0 items-center gap-1.5 pb-1 pr-1">
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-200 active:scale-95 cursor-pointer"
                title="Dừng phản hồi"
              >
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSend}
                disabled={!input.trim() || disabled}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 active:scale-95 shadow-xs cursor-pointer"
                title="Gửi câu hỏi"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-slate-400">
          Gemini có thể đưa ra câu trả lời cần kiểm chứng lại. Dữ liệu được hỗ trợ bởi RAG tri thức xiếc.
        </p>
      </div>
    </div>
  )
}
