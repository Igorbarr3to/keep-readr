'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'

type FormData = {
    email: string
    password: string
    confirmPassword: string
}

export default function SignUpPage() {
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormData>()

    const [showPassword, setShowPassword] = useState(false)
    const [serverError, setServerError] = useState('')
    const router = useRouter()

    const onSubmit = async (data: FormData) => {
        setServerError('')

        if (data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'As senhas não coincidem.',
            })
            return
        }

        try {
            const res = await fetch('/api/signUp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, password: data.password }),
            })

            const json = await res.json()

            if (!res.ok) {
                throw new Error(json.error || 'Erro ao cadastrar usuário.')
            }

            router.push('/signIn');
        } catch (err: any) {
            setServerError(err.message || 'Erro inesperado.')
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-[300px]">

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full border border-neutral-500 bg-neutral-700 rounded-md px-3 py-2"
                        {...register('email', { required: 'Email obrigatório' })}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div className='relative'>
                    <label className="block text-sm font-medium">Senha</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full border border-neutral-500 bg-neutral-700 rounded-md px-3 py-2"
                        {...register('password', { required: 'Senha obrigatória' })}
                    />
                    <button
                        type="button"
                        className="absolute top-1 right-3 text-neutral-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-white">Confirmar Senha</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full border border-neutral-500 bg-neutral-700 text-white rounded-md px-3 py-2"
                        {...register('confirmPassword', { required: 'Confirmação obrigatória' })}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-neutral-400 text-neutral-900 font-semibold py-2 rounded hover:bg-neutral-100 transition"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                </button>
            </form>
            <p className="mt-6 text-neutral-300">
                Já tem uma conta?{' '}
                <a href="/signIn" className="text-white hover:underline">
                    Faça login!
                </a>
            </p>
        </main >
    )
}
