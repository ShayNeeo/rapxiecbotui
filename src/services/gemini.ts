import type { ChatMessage, ChatSettings } from '../types/chat'

interface GeminiPart {
  text: string
}

interface GeminiContent {
  role: 'user' | 'model'
  parts: GeminiPart[]
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[]
    role?: string
  }
  finishReason?: string
}

interface GeminiResponse {
  candidates?: GeminiCandidate[]
  error?: {
    code: number
    message: string
    status: string
  }
}

export async function streamGeminiChat(
  messages: ChatMessage[],
  settings: ChatSettings,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const apiKey = settings.apiKey.trim()
  if (!apiKey) {
    throw new Error('API key is missing. Please provide a valid Gemini API key in Settings.')
  }

  const model = settings.model.trim() || 'gemini-3.5-flash-lite'

  // Format messages for Gemini API
  // Gemini expects roles 'user' and 'model'
  const contents: GeminiContent[] = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  if (contents.length === 0) {
    throw new Error('No message content to send.')
  }

  const payload: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: settings.temperature ?? 0.7,
    },
  }

  if (settings.systemPrompt.trim()) {
    payload.systemInstruction = {
      parts: [{ text: settings.systemPrompt.trim() }],
    }
  }

  // Use streamGenerateContent with alt=sse for real-time streaming
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} (${response.statusText})`
    try {
      const errJson = (await response.json()) as GeminiResponse
      if (errJson.error?.message) {
        errorDetail = errJson.error.message
      }
    } catch {
      // Fallback to text if JSON parsing fails
      const rawText = await response.text().catch(() => '')
      if (rawText) {
        errorDetail = rawText
      }
    }
    throw new Error(`Gemini API Error: ${errorDetail}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('ReadableStream not supported by response')
  }

  const decoder = new TextDecoder('utf-8')
  let fullResponse = ''
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data:')) continue

        const dataStr = trimmed.replace(/^data:\s*/, '')
        if (dataStr === '[DONE]') continue

        try {
          const parsed = JSON.parse(dataStr) as GeminiResponse
          const parts = parsed.candidates?.[0]?.content?.parts
          if (parts && parts.length > 0) {
            for (const part of parts) {
              if (part.text) {
                fullResponse += part.text
                onChunk(fullResponse)
              }
            }
          }
        } catch {
          // Incomplete chunk in SSE line, continue
        }
      }
    }

    if (buffer.trim().startsWith('data:')) {
      const dataStr = buffer.trim().replace(/^data:\s*/, '')
      try {
        const parsed = JSON.parse(dataStr) as GeminiResponse
        const parts = parsed.candidates?.[0]?.content?.parts
        if (parts && parts.length > 0) {
          for (const part of parts) {
            if (part.text) {
              fullResponse += part.text
              onChunk(fullResponse)
            }
          }
        }
      } catch {
        // Ignore partial parse error at end of stream
      }
    }
  } finally {
    reader.releaseLock()
  }

  return fullResponse
}
