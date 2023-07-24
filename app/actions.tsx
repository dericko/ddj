'use server'

import prisma from '@/lib/prisma'
import { type Document } from '@prisma/client'

export async function listAll(): Promise<Array<Document>> {
  try {
    const documents = await prisma.document.findMany()
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
      ORDER BY similarity DESC;
    `

    return documents as Array<Document & { similarity: number }>
  } catch (error) {
    console.error(error)
    throw error
  }
}
