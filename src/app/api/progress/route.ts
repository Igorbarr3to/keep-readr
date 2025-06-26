import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { pdfId, page } = await req.json();
  if (!pdfId || typeof page !== "number") {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const existing = await prisma.progress.findUnique({ where: { pdfId } });

  if (existing) {
    await prisma.progress.update({
      where: { pdfId },
      data: { page },
    });
  } else {
    await prisma.progress.create({
      data: {
        pdfId,
        page,
      },
    });
  }

  return NextResponse.json({ success: true });
}
