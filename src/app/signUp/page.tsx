'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/signUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao registrar usuário.')
            }

            router.push('/signIn')
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Erro inesperado.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex flex-col min-h-screen items-center px-4 bg-gradient-to-b from-neutral-900 to-neutral-700">
            <header className='text-center m-30 '>
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-200 ">
                    KeepReadr
                </h1>
                <p className="mt-2 text-lg text-neutral-400">
                    Crie sua conta e comece sua leitura!
                </p>
            </header>
            <form onSubmit={handleRegister} className="space-y-6 w-[300px]">
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full border border-neutral-500 bg-neutral-700 rounded-md px-3 py-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Senha</label>
                    <input
                        type="password"
                        className="w-full border border-neutral-500 bg-neutral-700 rounded-md px-3 py-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">Repetir Senha</label>
                    <input
                        type="password"
                        className="w-full border border-neutral-500 bg-neutral-700 text-white rounded-md px-3 py-2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-neutral-400 text-neutral-900 font-semibold py-2 rounded hover:bg-neutral-100 transition"
                    disabled={loading}
                >
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>
        </main>
    )
}
