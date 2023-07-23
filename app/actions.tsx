'use server'

import prisma from '@/lib/prisma'
import { openai } from '@/lib/openai'
import { type Document } from '@prisma/client'

export async function listAll(): Promise<Array<Document>> {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        translator: 'asc',
      },
    })
    return documents
  } catch (error) {
    console.error(error)
    throw error
  }
}


export async function listSimilar(
  query: string
): Promise<Array<Document & { similarity: number }>> {
  try {
    if (query.trim().length === 0) return []

    const embedding = await generateEmbedding(query)
    const vectorQuery = `[${embedding.join(',')}]`
    const document = await prisma.$queryRaw`
      SELECT
        id,
        "name",
        1 - (embedding <=> ${vectorQuery}::vector) as similarity
      FROM document
      where 1 - (embedding <=> ${vectorQuery}::vector) > .5
      ORDER BY  similarity DESC
      LIMIT 8;
    `

    return document as Array<Document & { similarity: number }>
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function generateEmbedding(raw: string) {
  // OpenAI recommends replacing newlines with spaces for best results
  const input = raw.replace(/\n/g, ' ')
  const embeddingResponse = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input,
  })

  const embeddingData = await embeddingResponse.json()
  const [{ embedding }] = (embeddingData as any).data
  return embedding
}
