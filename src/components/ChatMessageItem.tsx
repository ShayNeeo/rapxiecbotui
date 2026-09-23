import React, { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles, User, Copy, Check, AlertCircle, Database, ChevronDown, ChevronUp } from 'lucide-react'
import type { ChatMessage } from '../types/chat'

interface ChatMessageItemProps {
  message: ChatMessage
  isStreaming?: boolean
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isStreaming = false,
}) => {
  const isUser = message.role === 'user'
  const [showSources, setShowSources] = useState(false)

  return (
    <div
      className={`flex w-full gap-3 py-3 transition-colors ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div
          className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl shadow-md ${
            message.isError
              ? 'border-2 border-red-400 bg-red-100 text-red-600'
              : 'border-2 border-amber-400 bg-gradient-to-tr from-[#8a181b] to-[#6d1013] text-amber-300 ring-2 ring-amber-400/30'
          }`}
        >
          {message.isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4 text-amber-300" />
          )}
        </div>
      )}

      <div
        className={`relative max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[78%] shadow-md ${
          isUser
            ? 'rounded-tr-xs bg-gradient-to-r from-[#9c1c1f] via-[#881518] to-[#700f12] text-amber-50 border border-amber-400/50 shadow-red-950/40'
            : message.isError
            ? 'rounded-tl-xs border-2 border-red-300 bg-red-50 text-red-900 shadow-sm'
            : 'rounded-tl-xs border-2 border-amber-400/70 bg-[#fffdf8] text-stone-900 shadow-lg'
        }`}
      >
        <div className="prose max-w-none text-sm leading-relaxed break-words text-inherit">
          {isUser ? (
            <p className="whitespace-pre-wrap font-medium">{message.content}</p>
          ) : (
            <>
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code(props) {
                    const { children, className, ...rest } = props
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !match && !String(children).includes('\n')

                    if (isInline) {
                      return (
                        <code
                          className="rounded border border-amber-300/80 bg-amber-50 px-1.5 py-0.5 font-mono text-xs text-[#8a181b] font-semibold"
                          {...rest}
                        >
                          {children}
                        </code>
                      )
                    }

                    return (
                      <CodeBlock language={match ? match[1] : ''}>
                        {String(children).replace(/\n$/, '')}
                      </CodeBlock>
                    )
                  },
                  h1({ children }) {
                    return <h1 className="mb-2 text-lg font-bold text-[#8a181b]">{children}</h1>
                  },
                  h2({ children }) {
                    return <h2 className="mb-2 text-base font-bold text-[#8a181b]">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="mb-1.5 text-sm font-bold text-[#8a181b]">{children}</h3>
                  },
                  p({ children }) {
                    return <p className="mb-3 last:mb-0 text-stone-850 leading-relaxed">{children}</p>
                  },
                  ul({ children }) {
                    return <ul className="mb-3 list-disc space-y-1.5 pl-4 last:mb-0 text-stone-800">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="mb-3 list-decimal space-y-1.5 pl-4 last:mb-0 text-stone-800">{children}</ol>
                  },
                  li({ children }) {
                    return <li className="text-stone-800">{children}</li>
                  },
                  table({ children }) {
                    return (
                      <div className="my-3 overflow-x-auto rounded-xl border border-amber-300/80 shadow-xs">
                        <table className="w-full text-left text-xs text-stone-800">{children}</table>
                      </div>
                    )
                  },
                  th({ children }) {
                    return (
                      <th className="border-b-2 border-amber-300 bg-amber-100/70 px-3 py-2 font-bold text-[#8a181b]">
                        {children}
                      </th>
                    )
                  },
                  td({ children }) {
                    return <td className="border-b border-amber-200/60 px-3 py-2">{children}</td>
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="my-2.5 rounded-r-xl border-l-4 border-amber-500 bg-amber-50/80 px-3.5 py-2 italic text-amber-950 text-xs shadow-xs">
                        {children}
                      </blockquote>
                    )
                  },
                }}
              >
                {message.content}
              </Markdown>
              {isStreaming && (
                <span className="inline-block h-3.5 w-1.5 animate-pulse rounded-full bg-amber-500 ml-1 align-middle" />
              )}
            </>
          )}
        </div>

        {/* RAG Sources Grounding Accordion */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3.5 border-t border-amber-200/80 pt-2.5">
            <button
              type="button"
              onClick={() => setShowSources(!showSources)}
              className="flex w-full items-center justify-between rounded-xl border border-amber-300 bg-amber-50/90 px-3 py-1.5 text-xs text-amber-950 transition hover:bg-amber-100 cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <Database className="h-3.5 w-3.5 text-emerald-700" />
                <span>
                  {message.sources.length} trích đoạn tư liệu RAG (Gemini Embedding)
                </span>
              </div>
              {showSources ? (
                <ChevronUp className="h-3.5 w-3.5 text-amber-800" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-amber-800" />
              )}
            </button>

            {showSources && (
              <div className="mt-2.5 space-y-2">
                {message.sources.map((src, i) => (
                  <div
                    key={src.id}
                    className="rounded-xl border border-amber-300/80 bg-amber-50/60 p-2.5 text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between text-stone-900 font-medium">
                      <span className="font-bold text-[#8a181b]">
                        #{i + 1} {src.title}
                      </span>
                      <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-mono text-emerald-800 font-semibold">
                        {(src.similarity * 100).toFixed(1)}% khớp
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-3 text-[11px] text-stone-700 leading-relaxed">
                      {src.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className={`mt-1.5 flex items-center justify-end text-[10px] font-medium ${
            isUser ? 'text-amber-200/80' : 'text-stone-400'
          }`}
        >
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl border border-amber-300/80 bg-amber-400 text-red-950 font-bold shadow-md">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}

interface CodeBlockProps {
  language?: string
  children: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore copy error
    }
  }

  return (
    <div className="group relative my-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 font-mono text-xs shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-400">
        <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-300">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-slate-200">
        <code>{children}</code>
      </pre>
    </div>
  )
}
