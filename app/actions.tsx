'use server'

import prisma from '@/lib/prisma'
import { openai } from '@/lib/openai'
import { type Document } from '@prisma/client'
import { topTranslators } from './constants'

export async function listAll(): Promise<Array<Document>> {
  try {
    const documents = await prisma.document.findMany({
      where: {
        translator: {
          in: topTranslators,
        },
      },
    })
    return documents
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function listSimilar(id: string): Promise<Array<Document & { similarity: number }>> {
  try {
    const curr: Array<any> = await prisma.$queryRaw`
      SELECT
        id,
        embedding::text
      FROM document
      where id = ${id}
      LIMIT 1;
    `
    const vectorQuery = curr[0].embedding
    const documents = await prisma.$queryRaw`
      SELECT
        id,
        translator,
        text,
        date,
        1 - (embedding <=> ${vectorQuery}::vector) as similarity
      FROM document
      where 1 - (embedding <=> ${vectorQuery}::vector) > .5
      ORDER BY similarity DESC
      LIMIT 10;
    `

    return documents as Array<Document & { similarity: number }>
  } catch (error) {
    console.error(error)
    throw error
  }
}

// async function generateEmbedding(raw: string) {
//   // OpenAI recommends replacing newlines with spaces for best results
//   const input = raw.replace(/\n/g, ' ')
//   const embeddingResponse = await openai.createEmbedding({
//     model: 'text-embedding-ada-002',
//     input,
//   })

//   const embeddingData = await embeddingResponse.json()
//   const [{ embedding }] = (embeddingData as any).data
//   return embedding
// }
