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
          className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl shadow-xs ${
            message.isError
              ? 'border border-red-200 bg-red-100 text-red-600'
              : 'border border-blue-200 bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-blue-500/10'
          }`}
        >
          {message.isError ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
        </div>
      )}

      <div
        className={`relative max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
          isUser
            ? 'rounded-tr-xs bg-blue-600 text-white shadow-md shadow-blue-600/10'
            : message.isError
            ? 'rounded-tl-xs border border-red-200 bg-red-50 text-red-800 shadow-xs'
            : 'rounded-tl-xs border border-slate-200 bg-white text-slate-800 shadow-xs'
        }`}
      >
        <div className="prose max-w-none text-sm leading-relaxed break-words text-inherit">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
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
                          className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-blue-700"
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
                  p({ children }) {
                    return <p className="mb-3 last:mb-0 text-slate-800">{children}</p>
                  },
                  ul({ children }) {
                    return <ul className="mb-3 list-disc space-y-1 pl-4 last:mb-0 text-slate-700">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="mb-3 list-decimal space-y-1 pl-4 last:mb-0 text-slate-700">{children}</ol>
                  },
                  li({ children }) {
                    return <li className="text-slate-700">{children}</li>
                  },
                  table({ children }) {
                    return (
                      <div className="my-3 overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-left text-xs text-slate-700">{children}</table>
                      </div>
                    )
                  },
                  th({ children }) {
                    return (
                      <th className="border-b border-slate-200 bg-slate-100 px-3 py-2 font-semibold text-slate-800">
                        {children}
                      </th>
                    )
                  },
                  td({ children }) {
                    return <td className="border-b border-slate-100 px-3 py-2">{children}</td>
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="my-2 border-l-2 border-cyan-600 bg-slate-50/60 pl-3 py-1 italic text-slate-600">
                        {children}
                      </blockquote>
                    )
                  },
                }}
              >
                {message.content}
              </Markdown>
              {isStreaming && (
                <span className="inline-block h-3.5 w-1.5 animate-pulse rounded-full bg-blue-600 ml-1 align-middle" />
              )}
            </>
          )}
        </div>

        {/* RAG Sources Grounding Accordion */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 border-t border-slate-100 pt-2.5">
            <button
              type="button"
              onClick={() => setShowSources(!showSources)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 transition hover:bg-slate-100 hover:text-blue-700 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-blue-600" />
                <span className="font-medium">
                  {message.sources.length} RAG Chunk{message.sources.length > 1 ? 's' : ''} retrieved (Gemini Embedding 2)
                </span>
              </div>
              {showSources ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>

            {showSources && (
              <div className="mt-2 space-y-2">
                {message.sources.map((src, i) => (
                  <div
                    key={src.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 p-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-800">
                      <span className="font-semibold text-blue-700">
                        #{i + 1} {src.title}
                      </span>
                      <span className="rounded-full bg-blue-100 border border-blue-200 px-2 py-0.5 text-[10px] font-mono text-blue-800">
                        {(src.similarity * 100).toFixed(1)}% match
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-3 text-[11px] text-slate-600">
                      {src.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          className={`mt-1.5 flex items-center justify-end text-[10px] ${
            isUser ? 'text-blue-100' : 'text-slate-400'
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
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-xs">
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
