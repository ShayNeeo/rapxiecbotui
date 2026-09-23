import React from 'react'
import { Sparkles, Settings, Trash2, Cpu, Database, ArrowLeft } from 'lucide-react'

interface ChatHeaderProps {
  model: string
  ragEnabled: boolean
  onToggleRag: () => void
  chunkCount: number
  onOpenSettings: () => void
  onClearChat: () => void
  messageCount: number
  onBackToPortal?: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  model,
  ragEnabled,
  onToggleRag,
  chunkCount,
  onOpenSettings,
  onClearChat,
  messageCount,
  onBackToPortal,
}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md shadow-xs">
      <div className="flex items-center gap-3">
        {onBackToPortal && (
          <button
            type="button"
            onClick={onBackToPortal}
            className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100 shadow-xs cursor-pointer"
            title="Quay lại Rạp Xiếc Bỏ Túi"
          >
            <ArrowLeft className="h-4 w-4 text-amber-700" />
            <span className="hidden sm:inline">Rạp Xiếc Bỏ Túi</span>
          </button>
        )}

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-blue-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-base font-semibold text-slate-900">Gemini Assistant</h1>
            <span className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              <Cpu className="h-3 w-3" />
              {model}
            </span>
            <button
              type="button"
              onClick={onToggleRag}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition cursor-pointer ${
                ragEnabled
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-xs'
                  : 'border-slate-200 bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
              title={ragEnabled ? 'RAG is active: grounded in circus knowledge base' : 'Click to enable RAG knowledge base'}
            >
              <Database className="h-3 w-3" />
              <span>RAG: {chunkCount} chunks</span>
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  ragEnabled ? 'bg-emerald-500 ring-2 ring-emerald-300' : 'bg-slate-400'
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            {messageCount === 0 ? 'Ready to chat' : `${messageCount} message${messageCount === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {messageCount > 0 && (
          <button
            type="button"
            onClick={onClearChat}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 shadow-xs cursor-pointer"
            title="Clear conversation"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 shadow-xs cursor-pointer"
          title="Settings"
        >
          <Settings className="h-3.5 w-3.5 text-slate-500" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  )
}
