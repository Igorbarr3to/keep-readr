import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"
import { randomUUID } from "crypto";
import { bucket } from "@/lib/gcs";
import { prisma } from "@/lib/prisma";
const pdf = require('pdf-parse') as any

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const formData = await req.formData();
    const file = formData.get('file') as File
    const title = formData.get('title') as string

    if (!file || !title) {
        return NextResponse.json({ error: 'Arquivo ou título ausente.' }, { status: 400 })
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        const parsed = await pdf(buffer);
        const totalPages = parsed.numpages || 1;

        const fileName = `${randomUUID()}-${file.name}`;
        const blob = bucket.file(fileName);

        await blob.save(buffer, {
            contentType: file.type,
            resumable: false
        });

        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        const pDF = await prisma.pDF.create({
            data: {
                title,
                fileUrl,
                totalPages,
                userId: session.user.id,
            }
        })

        return NextResponse.json({ pDF }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Erro ao enviar PDF.' }, { status: 500 })
    }
}

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return new Response("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) return new Response("User not found", { status: 404 })

    const pdfs = await prisma.pDF.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(pdfs)
}