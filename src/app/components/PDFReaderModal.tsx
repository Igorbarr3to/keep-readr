// components/PDFReaderModal.tsx

'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { X, LoaderCircle, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Document, Page } from 'react-pdf'

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
    const [loadError, setLoadError] = useState<Error | null>(null) // Sugestão 2b

    // Limpa o estado de erro ao fechar/reabrir o modal
    useEffect(() => {
        if (isOpen) {
            setPageNumber(initialPage)
            setLoadError(null) // Reseta o erro
        }
    }, [initialPage, isOpen])


    const handlePageChange = async (newPage: number) => {
        if (newPage === pageNumber) return; // Evita chamadas desnecessárias
        
        setPageNumber(newPage)
        
        // Sugestão 2c: Tratamento de erro ao salvar progresso
        try {
            await fetch('/api/pdf/progress', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pdfId, page: newPage })
            })
        } catch (error) {
            console.error("Falha ao salvar o progresso da página:", error)
            // Opcional: Mostrar uma notificação (toast) para o usuário informando a falha
        }
    }

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
        setLoadError(null)
    }

    const onDocumentLoadError = (error: Error) => {
        console.error("Erro ao carregar o documento PDF:", error);
        setLoadError(error); // Sugestão 2b
    }

    // Componente para feedback visual de carregamento
    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center text-white h-full">
            <LoaderCircle className="animate-spin" size={48} />
            <p className="mt-4">Carregando PDF...</p>
        </div>
    )
    
    // Componente para feedback visual de erro
    const ErrorDisplay = () => (
        <div className="flex flex-col items-center justify-center text-red-400 h-full">
            <AlertTriangle size={48} />
            <p className="mt-4">Falha ao carregar o PDF.</p>
            <p className="text-sm text-zinc-400">Por favor, verifique a URL ou tente novamente.</p>
        </div>
    )

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <DialogPanel className="bg-zinc-900 rounded-lg max-w-5xl w-full h-[90vh] overflow-hidden p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">Leitura</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto flex justify-center">
                    {/* Sugestão 2: Adiciona estados de carregamento e erro */}
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={<LoadingSpinner />} // Sugestão 2a
                    >
                        {loadError ? (
                            <ErrorDisplay /> // Sugestão 2b
                        ) : (
                           <Page 
                                pageNumber={pageNumber}
                                loading={<LoadingSpinner />} // Sugestão 3
                                renderAnnotationLayer={false} // Opcional: melhora performance se não precisar de anotações
                                renderTextLayer={false} // Opcional: melhora performance se não precisar de seleção de texto
                           />
                        )}
                    </Document>
                </div>
                
                {/* Só mostra a paginação se o documento foi carregado com sucesso */}
                {!loadError && numPages && (
                    <div className="flex justify-between items-center mt-4 flex-shrink-0">
                        <button
                            onClick={() => handlePageChange(Math.max(1, pageNumber - 1))}
                            disabled={pageNumber <= 1}
                            className="px-4 py-2 rounded bg-zinc-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Página anterior
                        </button>
                        <span className="text-white">
                            Página {pageNumber} de {numPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(Math.min(numPages, pageNumber + 1))}
                            disabled={pageNumber === numPages}
                            className="px-4 py-2 rounded bg-zinc-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Próxima página
                        </button>
                    </div>
                )}
            </DialogPanel>
        </Dialog>
    )
}