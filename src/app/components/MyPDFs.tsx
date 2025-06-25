"use client"

import { useEffect, useState } from "react"

type PDF = {
    id: string
    title: string
    fileUrl: string
}

export default function MyPDFs() {
    const [pdfs, setPdfs] = useState<PDF[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetch("/api/pdf")
            .then((res) => {
                if (!res.ok) throw new Error("Erro ao buscar PDFs")
                return res.json()
            })
            .then((data) => setPdfs(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Carregando PDFs...</p>
    if (error) return <p className="text-red-500">{error}</p>
    if (pdfs.length === 0) return <p>Nenhum PDF encontrado.</p>

    return (
        <ul className="space-y-2 m-2">
            {pdfs.map((pdf) => (
                <li key={pdf.id} className="bg-zinc-700 p-4 rounded"> 
                    <a
                        href={pdf.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-500 hover:text-blue-700"
                    >
                        {pdf.title}
                    </a>
                </li>
            ))}
        </ul>
    )
}