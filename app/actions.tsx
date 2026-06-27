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

export interface SpotlightPair {
  docA: Document
  docB: Document
  similarity: number
}

export async function getSpotlightPair(nameA: string, nameB: string): Promise<SpotlightPair> {
  try {
    const [docA, docB] = await Promise.all([
      prisma.document.findFirst({ where: { translator: nameA } }),
      prisma.document.findFirst({ where: { translator: nameB } }),
    ])
    if (!docA || !docB) {
      const missing = [!docA && nameA, !docB && nameB].filter(Boolean).join(', ')
      throw new Error(`Translator(s) not found: ${missing}`)
    }

    const result: Array<{ similarity: number }> = await prisma.$queryRaw`
      SELECT 1 - (
        (SELECT embedding FROM document WHERE id = ${docA.id})
        <=>
        (SELECT embedding FROM document WHERE id = ${docB.id})
      ) as similarity
    `
    if (!result || result.length === 0) throw new Error('Similarity computation returned no results')
    return { docA, docB, similarity: result[0].similarity }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getTopTranslatorDocs(names: string[]): Promise<Array<Document>> {
  try {
    const docs = await prisma.document.findMany({
      where: { translator: { in: names } },
    })
    return docs
  } catch (error) {
    console.error(error)
    throw error
  }
}
