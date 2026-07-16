import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FileManager } from "@/components/dashboard/FileManager";

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const documents = await prisma.document.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, filename: true, createdAt: true },
  });

  return (
    <FileManager
      kind="documents"
      title="Documents"
      description="Job descriptions, notes, or anything else Cue should know about before a session."
      emptyLabel="No documents yet."
      initialFiles={documents.map((d) => ({ ...d, createdAt: d.createdAt.toISOString() }))}
    />
  );
}
