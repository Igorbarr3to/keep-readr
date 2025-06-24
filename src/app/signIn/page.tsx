'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

type FormData = {
  email: string
  password: string
}

export default function SignInPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>()

  const [authError, setAuthError] = useState('')

  const onSubmit = async (data: FormData) => {
    setAuthError('')

    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (res?.error) {
      setError('email', { message: 'Email ou senha inválidos' })
      setError('password', { message: ' ' })
      setAuthError(res.error)
    } else {
      router.push('/')
    }
  }

  return (
    <main className="flex flex-col min-h-screen items-center px-4 bg-gradient-to-b from-neutral-900 to-neutral-700 py-20">
      <header className="text-center m-30">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-200">KeepReadr</h1>
        <p className="mt-2 text-lg text-neutral-400">
          Carregue seus PDFs e nunca mais perca sua página.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-[300px]">
        <div>
          <label className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            className="w-full border border-neutral-500 bg-neutral-700 text-white rounded-md px-3 py-2"
            {...register('email', { required: 'Email obrigatório' })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Senha</label>
          <input
            type="password"
            className="w-full border border-neutral-500 bg-neutral-700 text-white rounded-md px-3 py-2"
            {...register('password', { required: 'Senha obrigatória' })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {authError && !errors.email && (
          <p className="text-red-500 text-sm">{authError}</p>
        )}

        <button
          type="submit"
          className="w-full bg-neutral-400 text-neutral-900 font-semibold py-2 rounded hover:bg-neutral-100 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-neutral-300">
        Ainda não tem uma conta?{' '}
        <a href="/signUp" className="text-white hover:underline">
          Registre-se!
        </a>
      </p>
    </main>
  )
}
