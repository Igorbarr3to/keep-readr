'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        throw new Error(res.error || 'Email ou senha inválidos')
      }

      console.log(res)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='flex flex-col min-h-screen items-center px-4 bg-gradient-to-b from-neutral-900 to-neutral-700'>
      <header className='text-center m-30 '>
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-200 ">
          KeepReadr
        </h1>
        <p className="mt-2 text-lg text-neutral-400">
          Carregue seus PDFs e nunca mais perca sua página.
        </p>
      </header>

      <form onSubmit={handleLogin} className="space-y-6 w-[300px]">
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
       
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-neutral-400 text-neutral-900 font-semibold py-2 rounded hover:bg-neutral-100 transition"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className='mt-6'>Ainda não tem uma conta? <a href='/signUp' className='hover:underline'>Registre-se!</a></p>
    </main>
  )
}
