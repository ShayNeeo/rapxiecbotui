import React, { useState } from 'react'
import { X, Eye, EyeOff, Key, Cpu, Sliders, MessageSquare, RotateCcw, Database } from 'lucide-react'
import { DEFAULT_MODELS, type ChatSettings } from '../types/chat'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: ChatSettings
  onSave: (newSettings: ChatSettings) => void
  defaultApiKey: string
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  defaultApiKey,
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey)
  const [model, setModel] = useState(settings.model)
  const [customModel, setCustomModel] = useState(
    DEFAULT_MODELS.includes(settings.model as (typeof DEFAULT_MODELS)[number])
      ? ''
      : settings.model
  )
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt)
  const [temperature, setTemperature] = useState(settings.temperature)
  const [ragEnabled, setRagEnabled] = useState(settings.ragEnabled ?? true)
  const [showKey, setShowKey] = useState(false)

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const activeModel = model === 'custom' ? customModel.trim() || 'gemini-2.5-flash' : model
    onSave({
      apiKey: apiKey.trim(),
      model: activeModel,
      systemPrompt: systemPrompt.trim(),
      temperature,
      ragEnabled,
    })
    onClose()
  }

  const handleReset = () => {
    setApiKey(defaultApiKey)
    setModel('gemini-2.5-flash')
    setCustomModel('')
    setSystemPrompt('Bạn là Trợ lý AI am hiểu sâu sắc và nhiệt thành về nghệ thuật xiếc đương đại Việt Nam.')
    setTemperature(0.7)
    setRagEnabled(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-[#8a191c] via-[#751417] to-[#5e0f11] p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-amber-400/40 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-300" />
            <h2 className="font-circus text-lg tracking-wide text-amber-300">Cài đặt hệ thống AI</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-amber-200 hover:bg-white/10 hover:text-white cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* API Key */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-200">
              <Key className="h-3.5 w-3.5 text-amber-400" />
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Nhập khóa API Gemini (bỏ trống để dùng chế độ tri thức cục bộ)"
                className="w-full rounded-xl border-2 border-amber-400/80 bg-[#fffdf9] px-3 py-2 pr-10 text-xs font-mono text-stone-900 placeholder-stone-400 focus:border-amber-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-amber-200/80">
              Được lưu an toàn trong trình duyệt của bạn. Tự động tải từ <code>.env</code> nếu có.
            </p>
          </div>

          {/* Model Selector */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-200">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              Mô hình Gemini (Model)
            </label>
            <select
              value={DEFAULT_MODELS.includes(model as (typeof DEFAULT_MODELS)[number]) ? model : 'custom'}
              onChange={(e) => {
                const val = e.target.value
                setModel(val)
                if (val !== 'custom') {
                  setCustomModel('')
                }
              }}
              className="w-full rounded-xl border-2 border-amber-400/80 bg-[#fffdf9] px-3 py-2 text-xs font-medium text-stone-900 focus:border-amber-300 focus:outline-none cursor-pointer"
            >
              {DEFAULT_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m} {m === 'gemini-2.5-flash' ? '(Mặc định khuyên dùng)' : ''}
                </option>
              ))}
              <option value="custom">Tùy chỉnh tên Model khác...</option>
            </select>

            {model === 'custom' && (
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="vd: gemini-2.5-flash hoặc gemini-2.0-flash"
                className="mt-2 w-full rounded-xl border-2 border-amber-400/80 bg-[#fffdf9] px-3 py-2 text-xs font-mono text-stone-900 placeholder-stone-400 focus:border-amber-300 focus:outline-none"
              />
            )}
          </div>

          {/* RAG Knowledge Base Toggle */}
          <div className="rounded-xl border border-amber-400/50 bg-black/20 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                <div>
                  <span className="text-xs font-semibold text-amber-200">
                    RAG Tri thức Xiếc Đương Đại Việt Nam
                  </span>
                  <p className="text-[11px] text-amber-100/70">
                    Vector hóa bằng <code>gemini-embedding-2</code> (17 tư liệu tinh gọn)
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ragEnabled}
                onChange={(e) => setRagEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-200">
              <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
              Chỉ dẫn hệ thống (System Instruction)
            </label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Chỉ dẫn phong cách trả lời cho AI..."
              className="w-full rounded-xl border-2 border-amber-400/80 bg-[#fffdf9] p-2.5 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-300 focus:outline-none"
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-amber-200">
              <span>Độ sáng tạo (Temperature)</span>
              <span className="font-mono text-amber-300 font-bold">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="mt-2 w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-amber-200/70">
              <span>Chuẩn xác (0.0)</span>
              <span>Cân bằng (0.7)</span>
              <span>Sáng tạo (2.0)</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-amber-400/30">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-amber-300/80 hover:text-amber-200 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Khôi phục mặc định
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-amber-400/60 bg-red-950/60 px-4 py-2 text-xs font-semibold text-amber-200 hover:bg-red-900 cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-red-950 hover:from-amber-300 hover:to-amber-400 shadow-md cursor-pointer transition-all active:scale-95"
              >
                Lưu cài đặt
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
