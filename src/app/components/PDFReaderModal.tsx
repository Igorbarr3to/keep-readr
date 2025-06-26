'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { X } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useEffect, useState } from 'react'

import '@/worker'

type Props = {
    isOpen: boolean
    onClose: () => void
    fileUrl: string
    pdfId: string
    initialPage: number
}

export function PDFReaderModal({ isOpen, onClose, fileUrl, pdfId, initialPage }: Props) {
    const [pageNumber, setPageNumber] = useState(initialPage)
    const [numPages, setNumPages] = useState<number | null>(null)

    useEffect(() => {
        setPageNumber(initialPage)
    }, [initialPage, isOpen])

    const handlePageChange = async (newPage: number) => {
        setPageNumber(newPage)
        await fetch('/api/pdf/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pdfId, page: newPage })
        })
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <DialogPanel className="bg-zinc-900 rounded-lg max-w-5xl w-full h-[90vh] overflow-hidden p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-white">Leitura</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto flex justify-center">
                    <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                        <Page pageNumber={pageNumber} />
                    </Document>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
                        disabled={pageNumber <= 1}
                        className="px-4 py-2 rounded bg-zinc-700 text-white disabled:opacity-50"
                    >
                        Página anterior
                    </button>
                    <span className="text-white">
                        Página {pageNumber} de {numPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(Math.min(numPages || 1, pageNumber + 1))}
                        disabled={pageNumber === numPages}
                        className="px-4 py-2 rounded bg-zinc-700 text-white disabled:opacity-50"
                    >
                        Próxima página
                    </button>
                </div>
            </DialogPanel>
        </Dialog>
    )
}
