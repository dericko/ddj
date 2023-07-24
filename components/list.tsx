'use client'

import { listAll, listSimilar } from '@/app/actions'
import { useEffect, useState } from 'react'
import { type Document } from '@prisma/client'

interface SectionProps {
    document: Document & { similarity?: number }
    handleClick: (id: string) => void
}
function Section({ document, handleClick }: SectionProps) {
    const { id, translator, text, date, similarity } = document
    const [showText, setShowText] = useState(false);
    const similarityText = similarity?.toFixed(3)
    const showSimilarityText = similarityText && similarityText !== '1.000'
    const primaryColor = similarity === 1 ? 'bg-green-400' : 'bg-gray-200'
    return (
        <>
            <section className={`flex justify-between ${primaryColor} hover:opacity-75`}>
                <button className="px-2 py-1 text-sm border border-gray-400 hover:bg-gray-600" onClick={() => setShowText(!showText)}>{showText ? "v" : ">"}</button>
                <p>{translator} ({date}){showSimilarityText ? ` - ${similarityText}` : ''}</p>
                <button onClick={() => handleClick(id)} className="underline" >
                    view similar
                </button>
            </section>
            {showText && <section className='border'>
                <p className="text-sm">{text}</p>
            </section>}
        </>
    )
}

export function List() {
    const [documents, setDocuments] = useState<Array<Document & { similarity?: number }>>([
        {
            id: '1',
            translator: 'Loading...',
            date: '2006',
            text: 'Loading...',
        }
    ])
    useEffect(() => {
        let current = true
        listAll().then((results) => {
            if (current) {
                setDocuments(results)
            }
        })
        return () => {
            current = false
        }
    }, [listAll])
    const handleClick = async (id: string) => {
        const res = await listSimilar(id)
        setDocuments(res)
    }

    return (
        <ul className="w-full">
            {documents.map((document) => (
                <li key={document.id}>
                    <Section document={document} handleClick={handleClick} />
                </li >
            ))
            }
        </ul >
    )
}
