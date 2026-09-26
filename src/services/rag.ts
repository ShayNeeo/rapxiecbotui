import rawKnowledgeBase from '../data/rag_knowledge_base.json'
import type { RAGChunk, RetrievedSource } from '../types/chat'
import {
  CIRCUS_VENUES_AND_TICKETS_ANSWER,
  CIRCUS_VENUES_SOURCE,
  matchCircusVenuesQuestion,
} from './predefinedAnswers'

const knowledgeBase = rawKnowledgeBase as RAGChunk[]

export function getKnowledgeBaseStats() {
  return {
    totalChunks: knowledgeBase.length,
    embeddingDimensions: knowledgeBase[0]?.embedding.length ?? 3072,
    embeddingModel: 'gemini-embedding-2',
  }
}

/**
 * Fast cosine similarity between two float vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i]
    const b = vecB[i]
    dotProduct += a * b
    normA += a * a
    normB += b * b
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

/**
 * Obtain vector embedding for user query via gemini-embedding-2
 */
export async function getQueryEmbedding(query: string, apiKey: string): Promise<number[]> {
  const model = 'gemini-embedding-2'
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${encodeURIComponent(
    apiKey
  )}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      content: {
        parts: [{ text: query.trim() }],
      },
    }),
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new Error(`Embedding query failed (${response.status}): ${errText}`)
  }

  const json = (await response.json()) as { embedding?: { values?: number[] } }
  if (!json.embedding?.values) {
    throw new Error('No embedding returned for query')
  }

  return json.embedding.values
}

/**
 * Retrieve top-K relevant chunks from vector knowledge base
 */
export async function retrieveRelevantChunks(
  query: string,
  apiKey: string,
  topK = 3,
  minSimilarity = 0.55
): Promise<RetrievedSource[]> {
  if (!apiKey.trim() || !query.trim() || knowledgeBase.length === 0) {
    return []
  }

  try {
    const queryVector = await getQueryEmbedding(query, apiKey)

    const scored = knowledgeBase.map((chunk) => {
      const similarity = cosineSimilarity(queryVector, chunk.embedding)
      return {
        id: chunk.id,
        title: chunk.title,
        category: chunk.category,
        similarity,
        content: chunk.content,
      }
    })

    // Sort descending by similarity
    scored.sort((a, b) => b.similarity - a.similarity)

    // Filter by threshold and take top-K
    return scored.filter((item) => item.similarity >= minSimilarity).slice(0, topK)
  } catch (err) {
    console.warn('RAG retrieval failed, continuing with direct LLM prompt:', err)
    return []
  }
}

/**
 * Format grounding context for Gemini system instruction
 */
export function buildRAGSystemInstruction(
  baseSystemPrompt: string,
  sources: RetrievedSource[]
): string {
  if (sources.length === 0) return baseSystemPrompt

  const contextBlocks = sources
    .map(
      (source, index) =>
        `[Tài liệu tham khảo ${index + 1}: ${source.title} (Độ liên quan: ${(
          source.similarity * 100
        ).toFixed(1)}%)]\n${source.content}`
    )
    .join('\n\n---\n\n')

  return `${baseSystemPrompt}

BẠN ĐANG ĐƯỢC CUNG CẤP DỮ LIỆU TRI THỨC VỀ XIẾC ĐƯƠNG ĐẠI VIỆT NAM (ĐÃ ĐƯỢC LỌC SẠCH VÀ VECTOR HÓA BẰNG GEMINI EMBEDDING 2):
----------------------------------------
${contextBlocks}
----------------------------------------

3. Luôn giữ phong cách trả lời lịch sự, cô đọng, tự nhiên và hữu ích.`
}

/**
 * Fast keyword & lexical search on local RAG knowledge base
 * Used when API Key is not set or network is offline
 */
export function retrieveRelevantChunksLocally(
  query: string,
  topK = 3
): RetrievedSource[] {
  if (!query.trim() || knowledgeBase.length === 0) return []

  if (matchCircusVenuesQuestion(query)) {
    return [CIRCUS_VENUES_SOURCE]
  }

  const terms = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1)

  if (terms.length === 0) return []

  const scored = knowledgeBase.map((chunk) => {
    let score = 0
    const titleLower = chunk.title.toLowerCase()
    const contentLower = chunk.content.toLowerCase()
    const keywordsLower = chunk.keywords.map((k) => k.toLowerCase())

    for (const term of terms) {
      if (keywordsLower.some((k) => k.includes(term))) {
        score += 3.5
      }
      if (titleLower.includes(term)) {
        score += 2.5
      }
      if (contentLower.includes(term)) {
        score += 1.0
      }
    }

    // Normalized pseudo-similarity between 0.60 and 0.95
    const similarity = score > 0 ? Math.min(0.95, 0.6 + (score / (terms.length * 4)) * 0.35) : 0

    return {
      id: chunk.id,
      title: chunk.title,
      category: chunk.category,
      similarity: Number(similarity.toFixed(3)),
      content: chunk.content,
      rawScore: score,
    }
  })

  scored.sort((a, b) => b.rawScore - a.rawScore)
  return scored
    .filter((item) => item.rawScore > 0)
    .slice(0, topK)
    .map(({ id, title, category, similarity, content }) => ({
      id,
      title,
      category,
      similarity,
      content,
    }))
}

/**
 * Generate a rich, formatted answer from retrieved local chunks
 */
export function generateLocalCircusAnswer(
  query: string,
  sources: RetrievedSource[]
): string {
  if (matchCircusVenuesQuestion(query)) {
    return CIRCUS_VENUES_AND_TICKETS_ANSWER
  }

  if (sources.length === 0) {
    return [
      '🎪 **Chào bạn! Cảm ơn bạn đã quan tâm đến Nghệ thuật Xiếc.**',
      '',
      `Hiện tại trong cơ sở dữ liệu nhanh chưa tìm thấy tài liệu phù hợp với câu hỏi: "${query}".`,
      '',
      '💡 **Gợi ý bạn có thể hỏi về:**',
      '- 📜 *Lịch sử xiếc Việt Nam và cụ tổ NSND Tạ Duy Hiển (1922)*',
      '- 🎋 *Xiếc tre đương đại À Ố Show, Mơ Show, Teh Dar*',
      '- 🤹 *Sự khác biệt giữa xiếc truyền thống và xiếc đương đại*',
      '- 🦁 *Xu hướng chuyển dịch không dùng động vật hoang dã*',
      '- 📍 *Địa chỉ và giá vé các rạp xiếc lớn tại Hà Nội và TP.HCM*',
      '',
      '*(Mẹo: Bạn có thể nhập Gemini API Key trong phần Cài đặt để AI phân tích và trả lời mở rộng mọi chủ đề!)*',
    ].join('\n')
  }

  const primarySource = sources[0]
  const otherSources = sources.slice(1)

  const lines: string[] = [
    '🎪 **Thông tin từ Cơ sở Dữ liệu Rạp Xiếc Bỏ Túi:**',
    '',
    `### 📌 ${primarySource.title}`,
    '',
    primarySource.content,
    '',
  ]

  if (otherSources.length > 0) {
    lines.push('#### 🔍 Tư liệu bổ trợ liên quan:')
    for (const src of otherSources) {
      lines.push(`- **${src.title}**: ${src.content.slice(0, 180)}...`)
    }
    lines.push('')
  }

  lines.push('> 💡 *Câu trả lời được trích xuất trực tiếp từ hệ thống 17 tư liệu tri thức xiếc đã được chọn lọc. Bạn có thể thêm khóa Gemini API Key trong phần Cài đặt để kích hoạt trò chuyện AI sinh thông minh theo thời gian thực!*')

  return lines.join('\n')
}
