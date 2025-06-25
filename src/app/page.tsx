'use client'

import { prisma } from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MyPDFs from "./components/MyPDFs";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file || !title) {
      setMessage('Informe o título e selecione um PDF.');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar');
      }

      setMessage('Upload realizado com sucesso!');
      setFile(null);
      setTitle('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || 'Erro desconhecido.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signIn')
    }
  }, [status, router])

  if (status === 'authenticated') {
    return (
      <div className="p-4 bg-zinc-800 min-h-screen space-y-10">
        <h1 className="text-4xl text-center font-semibold m-2">
          KeepReadr
        </h1>

        <section className="flex flex-col bg-zinc-700/60 p-4 rounded-2xl mx-[25%] gap-4 mt-10">
          <h2 className="text-2xl font-semibold text-zinc-300/80">
            Carregar Novo Livro
          </h2>
          <p>Selecione um arquivo PDF do seu computador para começar a ler.</p>

          <input
            type="text"
            placeholder="Título"
            className="w-[50%] px-3 py-2 rounded-xl text-zinc-200 border border-zinc-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              setFile(selectedFile);
              if (selectedFile) {
                const nameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, '');
                setTitle(nameWithoutExtension);
              }
            }}
            className="block w-full text-sm text-zinc-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-zinc-800/60 cursor-pointer hover:file:bg-zinc-800"
          />
          <div className="w-full text-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-[50%] bg-zinc-400 hover:bg-zinc-100 text-black font-semibold py-2 rounded-xl disabled:opacity-50"
            >
              {uploading ? 'Enviando...' : 'Enviar PDF'}
            </button>

          </div>

          {message && (
            <p className={`text-sm ${message.includes('sucesso') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </p>
          )}
        </section>

        <main className="bg-zinc-700/60 p-4 rounded-2xl">
          <h1 className="text-center text-3xl font-semibold text-zinc-300/80">Sua Biblioteca</h1>
          <section>
            <MyPDFs/>
          </section>
          
        </main>
      </div>
    )
  }
}
