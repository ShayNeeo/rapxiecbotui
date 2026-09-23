import rawKnowledgeBase from '../data/rag_knowledge_base.json'
import type { RAGChunk, RetrievedSource } from '../types/chat'

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

HƯỚNG DẪN TRẢ LỜI:
1. Dựa vào thông tin chính xác từ các tài liệu tham khảo trên để trả lời câu hỏi của người dùng.
2. Nếu câu hỏi liên quan đến xiếc đương đại Việt Nam, các vở diễn (À Ố Show, Mơ Show, Vùng Đất Kỳ Bí, Huyền Sử Rồng Tiên, Vó Ngựa Biên Cương), địa điểm tại TP.HCM/Hà Nội, NSND Tạ Duy Hiển, hoặc nghệ sĩ Nguyễn Khánh Linh, hãy cung cấp chi tiết rõ ràng, chuẩn xác, kèm thông tin địa điểm và thời lượng khi cần thiết.
3. Luôn giữ phong cách trả lời lịch sự, cô đọng, tự nhiên và hữu ích.`
}
