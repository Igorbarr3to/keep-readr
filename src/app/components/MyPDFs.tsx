"use client"

import { useEffect, useState } from "react"
import { PDFReaderModal } from "./PDFReaderModal"

type PDF = {
    id: string
    title: string
    fileUrl: string
    totalPages: number
    progress?: {
        page: number
    } | null
}

export default function MyPDFs() {
    const [pdfs, setPdfs] = useState<PDF[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [openModal, setOpenModal] = useState(false)
    const [selectedPdf, setSelectedPdf] = useState<PDF | null>(null)

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
        <ul className="space-y-4 m-2">
            {pdfs.map((pdf) => {
                const page = pdf.progress?.page ?? 0
                const percent = Math.round((page / pdf.totalPages) * 100)

                return (
                    <li key={pdf.id} className="bg-zinc-700 p-4 rounded">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => {
                                    setSelectedPdf(pdf)
                                    setOpenModal(true)
                                }}
                                className="text-lg font-semibold text-blue-400 hover:text-blue-200"
                            >
                                {pdf.title}
                            </button>
                        </div>

                        <div className="w-full bg-zinc-600 rounded h-2 mt-2">
                            <div
                                className="bg-green-500 h-2 rounded"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </li>
                )
            })}

            {selectedPdf && (
                <PDFReaderModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    fileUrl={selectedPdf.fileUrl}
                    pdfId={selectedPdf.id}
                    initialPage={selectedPdf.progress?.page ?? 1}
                />
            )}
        </ul>
    )
}