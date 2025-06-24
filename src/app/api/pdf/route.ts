import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { title, fileUrl } = await req.json();

    if (!title || !fileUrl) {
        return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const pdf = await prisma.pDF.create({
        data: {
            title: "exemplo",
            fileUrl: '/pdfs/exemplo.pdf',
        }
    })

    return NextResponse.json(pdf)
}

export async function GET() {
    const pdfs = await prisma.pDF.findMany({
        include: {
            progress: true,
        }
    })

    return NextResponse.json(pdfs);
}