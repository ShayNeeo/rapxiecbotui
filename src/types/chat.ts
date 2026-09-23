export interface RetrievedSource {
  id: string
  title: string
  category: string
  similarity: number
  content: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  isError?: boolean
  sources?: RetrievedSource[]
}

export interface ChatSettings {
  apiKey: string
  model: string
  systemPrompt: string
  temperature: number
  ragEnabled: boolean
}

export interface RAGChunk {
  id: string
  title: string
  category: 'history' | 'concept' | 'career' | 'artistry' | 'venues_hcm' | 'venues_hn' | 'ethics'
  keywords: string[]
  content: string
  embeddingLength: number
  embedding: number[]
}

export const DEFAULT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
] as const
