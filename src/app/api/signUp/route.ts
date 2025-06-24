import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
  }

  const hashed = await hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashed },
  })

  return NextResponse.json({ id: user.id, email: user.email })
}
