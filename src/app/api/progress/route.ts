import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { pdfId, page } = await req.json();

    const progress = await prisma.progress.upsert({
        where: { pdfId },
        update: { page },
        create: { pdfId, page }
    });

    return NextResponse.json(progress)
}