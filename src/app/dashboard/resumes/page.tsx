import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FileManager } from "@/components/dashboard/FileManager";

export default async function ResumesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, filename: true, createdAt: true },
  });

  return (
    <FileManager
      kind="resumes"
      title="CVs & Resumes"
      description="Upload your resume once. Cue references it when generating answers so they reflect your real experience."
      emptyLabel="No resumes yet. Upload one to get started."
      initialFiles={resumes.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
    />
  );
}
