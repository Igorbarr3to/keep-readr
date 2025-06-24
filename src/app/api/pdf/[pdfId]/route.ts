import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type Params = {
  params: { pdfId: string }
}

export async function GET(_: Request, { params }: Params) {
  const progress = await prisma.progress.findUnique({
    where: { 
        pdfId: params.pdfId
    },
  })

  return NextResponse.json(progress)
}
