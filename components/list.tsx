'use client'

import { listAll, listSimilar } from '@/app/actions'
import { useEffect, useState } from 'react'
import { type Document } from '@prisma/client'

interface SectionProps {
    document: Document & { similarity?: number }
    handleClick: (id: string) => void
}
function Section({ document, handleClick }: SectionProps) {
    const { id, translator, text, date, similarity, } = document
    const isPrimary = similarity === 1
    const [showText, setShowText] = useState(false);
    return (
        <>
            <section className={`flex justify-between ${isPrimary ? 'bg-green-50' : ''}`}>
                <button className="px-2 py-1 text-sm border border-gray-400" onClick={() => setShowText(!showText)}>{showText ? "v" : ">"}</button>
                <p>{translator} ({date}) - {similarity?.toFixed(3)}</p>
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
    const [documents, setDocuments] = useState<Array<Document & { similarity?: number }>>([])
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
