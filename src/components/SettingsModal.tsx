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
    const activeModel = model === 'custom' ? customModel.trim() || 'gemini-3.5-flash-lite' : model
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
    setModel('gemini-3.5-flash-lite')
    setCustomModel('')
    setSystemPrompt('You are a helpful, concise AI assistant.')
    setTemperature(0.7)
    setRagEnabled(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-800">Cài đặt hệ thống</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* API Key */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Key className="h-3.5 w-3.5 text-blue-600" />
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Nhập khóa API Gemini"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 pr-10 text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Được lưu trữ cục bộ trong trình duyệt của bạn. Mặc định tải từ `.env`.
            </p>
          </div>

          {/* Model Selector */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <Cpu className="h-3.5 w-3.5 text-blue-600" />
              Gemini Model
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
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              {DEFAULT_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m} {m === 'gemini-3.5-flash-lite' ? '(Mặc định)' : ''}
                </option>
              ))}
              <option value="custom">Tùy chỉnh tên Model...</option>
            </select>

            {model === 'custom' && (
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="vd: gemini-3.5-flash-lite hoặc gemini-2.5-flash"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            )}
          </div>

          {/* RAG Knowledge Base Toggle */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-600" />
                <div>
                  <span className="text-xs font-medium text-slate-800">
                    RAG Knowledge Base (Xiếc đương đại VN)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Vector hóa bằng <code>gemini-embedding-2</code> (17 chunks)
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ragEnabled}
                onChange={(e) => setRagEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700">
              <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
              Chỉ dẫn hệ thống (System Instruction)
            </label>
            <textarea
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Chỉ dẫn định hướng phong cách trả lời cho AI..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
              <span>Độ sáng tạo (Temperature)</span>
              <span className="font-mono text-blue-600">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="mt-2 w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Chính xác (0.0)</span>
              <span>Cân bằng (0.7)</span>
              <span>Sáng tạo (2.0)</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Khôi phục mặc định
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 shadow-xs cursor-pointer"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
