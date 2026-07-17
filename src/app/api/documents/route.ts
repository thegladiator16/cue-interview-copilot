import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractText } from "@/lib/extractText";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const documents = await prisma.document.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, filename: true, createdAt: true },
  });

  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)." }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  const blockedExts = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".ico", ".mp3", ".mp4", ".mov", ".avi", ".mkv", ".wav", ".exe", ".dmg", ".zip", ".rar", ".7z", ".tar", ".gz"];
  if (blockedExts.some((ext) => name.endsWith(ext))) {
    return NextResponse.json(
      { error: "That file type isn't supported. Upload a PDF, DOCX, TXT, RTF, HTML, or other text document." },
      { status: 400 }
    );
  }

  let content: string;
  try {
    content = await extractText(file);
  } catch {
    return NextResponse.json(
      { error: "Couldn't read that file. Supported formats: PDF, DOCX, TXT, MD, RTF, HTML, CSV." },
      { status: 400 }
    );
  }

  if (!content.trim()) {
    return NextResponse.json(
      { error: "That file appears to be empty or couldn't be parsed. Try a different format." },
      { status: 400 }
    );
  }

  try {
    const document = await prisma.document.create({
      data: { userId: user.id, filename: file.name, content },
      select: { id: true, filename: true, createdAt: true },
    });
    return NextResponse.json({ document });
  } catch {
    return NextResponse.json(
      { error: "Failed to save the file. Please try again." },
      { status: 500 }
    );
  }
}
