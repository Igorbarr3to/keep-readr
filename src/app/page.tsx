'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signIn')
    }
  }, [status, router])

  if (status === 'loading') {
    return <p className="p-4">Carregando sessão...</p>
  }

  if (status === 'authenticated') {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">Área Protegida</h1>
        <p>Bem-vindo, {session.user.email} !</p>
      </div>
    )
  }
}
