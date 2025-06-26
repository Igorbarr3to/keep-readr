import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { randomUUID } from "crypto";
import { bucket } from "@/lib/gcs";
import { prisma } from "@/lib/prisma";
import { PDFDocument } from "pdf-lib";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;

  if (!file || !title) {
    return NextResponse.json(
      { error: "Arquivo ou título ausente." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${randomUUID()}-${file.name}`;
    const blob = bucket.file(fileName);

    await blob.save(buffer, {
      contentType: file.type,
      resumable: false,
    });

    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(fileName)}`;

    const pdfDoc = await PDFDocument.load(buffer);
    const totalPages = pdfDoc.getPageCount();

    const pdf = await prisma.pDF.create({
      data: {
        title,
        fileUrl,
        totalPages,
        userId: session.user.id,
      },
    });

    console.log(pdf);

    return NextResponse.json({ pdf }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao enviar PDF." }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const pdfs = await prisma.pDF.findMany({
    where: { userId: session.user.id },
    include: {
      progress: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(pdfs);
}
