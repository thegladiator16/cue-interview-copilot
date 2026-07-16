import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  situation: z.string().min(1).optional(),
  task: z.string().min(1).optional(),
  action: z.string().min(1).optional(),
  result: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const story = await prisma.userStory.findUnique({ where: { id } })
  if (!story || story.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 })

  const updated = await prisma.userStory.update({
    where: { id },
    data: parsed.data,
  })

  return NextResponse.json({ story: updated })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const story = await prisma.userStory.findUnique({ where: { id } })
  if (!story || story.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.userStory.delete({ where: { id } })

  return NextResponse.json({ deleted: true })
}
