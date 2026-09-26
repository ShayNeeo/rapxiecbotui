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
    <header className="sticky top-0 z-20 border-b-4 border-amber-400 bg-gradient-to-r from-[#8a181b] via-[#741316] to-[#5f0e11] px-4 py-3 text-white shadow-xl backdrop-blur-md relative select-none">
      {/* Decorative Bunting Pennants Banner */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-2 flex w-full justify-between overflow-hidden opacity-90">
        {[
          '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899',
          '#eab308', '#06b6d4', '#f97316', '#ef4444', '#f59e0b', '#10b981',
          '#3b82f6', '#8b5cf6', '#ec4899', '#eab308', '#06b6d4', '#f97316'
        ].map((color, idx) => (
          <div
            key={idx}
            className="h-2 w-4 sm:w-6 shrink-0"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              backgroundColor: color,
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          {onBackToPortal && (
            <button
              type="button"
              onClick={onBackToPortal}
              className="flex items-center gap-1.5 rounded-xl border border-amber-400/80 bg-amber-400/20 px-3 py-1.5 text-xs font-bold text-amber-200 transition hover:bg-amber-400/30 hover:text-white shadow-xs cursor-pointer active:scale-95"
              title="Quay lại Rạp Xiếc Bỏ Túi"
            >
              <ArrowLeft className="h-4 w-4 text-amber-300" />
              <span className="hidden sm:inline">Về Rạp Xiếc</span>
            </button>
          )}

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-red-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-300/40">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-circus text-base tracking-wide text-amber-300 drop-shadow-sm">
                Tư vấn viên AI
              </h1>
              <span className="flex items-center gap-1 rounded-full border border-amber-400/40 bg-red-950/60 px-2.5 py-0.5 text-xs font-medium text-amber-200">
                <Cpu className="h-3 w-3 text-amber-400" />
                {model}
              </span>
              <button
                type="button"
                onClick={onToggleRag}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition cursor-pointer ${
                  ragEnabled
                    ? 'border-emerald-400/80 bg-emerald-950/50 text-emerald-200 shadow-xs'
                    : 'border-white/20 bg-black/20 text-white/60 hover:text-white'
                }`}
                title={ragEnabled ? 'Tri thức RAG đang kích hoạt: gắn liền dữ liệu xiếc' : 'Bấm để bật tri thức RAG'}
              >
                <Database className="h-3 w-3 text-emerald-400" />
                <span>RAG: {chunkCount} tư liệu</span>
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    ragEnabled ? 'bg-emerald-400 ring-2 ring-emerald-300/50' : 'bg-slate-400'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-amber-100/70 font-medium">
              {messageCount === 0 ? 'Sẵn sàng giải đáp lịch sử & nghệ thuật xiếc' : `${messageCount} câu trao đổi`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messageCount > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              className="flex items-center gap-1.5 rounded-xl border border-red-400/40 bg-red-900/60 px-3 py-1.5 text-xs font-medium text-amber-100 transition hover:bg-red-800 hover:text-white shadow-xs cursor-pointer active:scale-95"
              title="Xóa cuộc trò chuyện"
            >
              <Trash2 className="h-3.5 w-3.5 text-amber-300" />
              <span className="hidden sm:inline">Xóa đoạn chat</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-xl border border-amber-400/50 bg-amber-400/20 px-3 py-1.5 text-xs font-bold text-amber-200 transition hover:bg-amber-400/30 hover:text-white shadow-xs cursor-pointer active:scale-95"
            title="Cài đặt hệ thống"
          >
            <Settings className="h-3.5 w-3.5 text-amber-300" />
            <span className="hidden sm:inline">Cài đặt</span>
          </button>
        </div>
      </div>
    </header>
  )
}
