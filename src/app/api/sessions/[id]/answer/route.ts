import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAnthropicClient, ANSWER_MODEL } from "@/lib/anthropic";

const schema = z.object({
  question: z.string().min(1).max(4000),
  format: z.enum(["star", "bullet", "paragraph"]).optional(),
  tone: z.enum(["professional", "conversational", "direct"]).optional(),
  length: z.enum(["brief", "balanced", "thorough"]).optional(),
  mode: z.enum(["general", "behavioral", "technical", "system-design"]).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const session = await prisma.callSession.findUnique({
    where: { id },
    include: { resume: true, messages: { orderBy: { createdAt: "asc" }, take: 20 } },
  });
  if (!session || session.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { question, format, tone, length, mode } = parsed.data;

  const formatInstructions = []
  if (format === "star") formatInstructions.push("Structure your answer using the STAR format with these exact section headers: **Situation:** ... **Task:** ... **Action:** ... **Result:** ...")
  if (format === "bullet") formatInstructions.push("Answer in concise bullet points, one point per line, each starting with •")
  if (format === "paragraph") formatInstructions.push("Answer in clear paragraphs")
  if (tone === "conversational") formatInstructions.push("Use a warm, conversational tone — natural spoken English, not formal.")
  if (tone === "direct") formatInstructions.push("Be direct and concise, no filler words.")
  if (tone === "professional") formatInstructions.push("Use a professional, polished tone suitable for a job interview.")
  if (length === "brief") formatInstructions.push("Keep your answer to 2-3 sentences maximum.")
  if (length === "thorough") formatInstructions.push("Give a detailed, thorough answer with specifics.")
  const formatBlock = formatInstructions.length ? "\n\nFormat instructions:\n" + formatInstructions.join("\n") : ""

  const anthropic = getAnthropicClient();
  if (!anthropic) {
    return NextResponse.json(
      {
        error:
          "AI answers aren't configured yet. Add ANTHROPIC_API_KEY to .env to enable real-time answers.",
      },
      { status: 501 }
    );
  }

  await prisma.message.create({
    data: { sessionId: id, role: "question", content: question },
  });

  const contextParts = [
    session.company ? `Company: ${session.company}` : null,
    session.role ? `Role: ${session.role}` : null,
    session.resume ? `Candidate resume:\n${session.resume.content.slice(0, 6000)}` : null,
    session.extraContext ? `Extra context:\n${session.extraContext.slice(0, 2000)}` : null,
  ].filter(Boolean);

  const systemPrompt = `You are Cue, a real-time interview copilot. The user is live in a ${
    session.type === "interview" ? "job interview" : "call"
  } right now and needs an answer they can say out loud immediately.

Answer in first person, as the candidate — concise (2-4 sentences unless the question needs more), natural spoken English, grounded in the context below. Never invent specific employers, project names, or metrics that aren't in the context; if the resume doesn't cover something, answer with a reasonable, honest, general approach instead. Do not narrate that you are an AI.${
    mode === "behavioral"
      ? "\n\nThis is a behavioral interview question. Structure your answer using the STAR method (Situation, Task, Action, Result) when applicable. Focus on specific examples from the candidate's experience."
      : mode === "technical"
      ? "\n\nThis is a technical interview question. Provide technically accurate, detailed answers. Include trade-offs, time/space complexity where relevant, and concrete implementation details."
      : mode === "system-design"
      ? "\n\nThis is a system design interview question. Structure your answer with: requirements clarification, high-level design, component deep-dive, and scalability considerations. Use concrete numbers and estimates."
      : ""
  }

${contextParts.length ? contextParts.join("\n\n") : "No resume or extra context was provided — answer generally."}${formatBlock}`;

  const history = session.messages.map((m) => ({
    role: (m.role === "answer" ? "assistant" : "user") as "assistant" | "user",
    content: m.content,
  }));

  const encoder = new TextEncoder();
  let fullAnswer = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = anthropic.messages.stream({
          model: ANSWER_MODEL,
          max_tokens: 500,
          system: systemPrompt,
          messages: [...history, { role: "user", content: question }],
        });

        anthropicStream.on("text", (delta) => {
          fullAnswer += delta;
          controller.enqueue(encoder.encode(delta));
        });

        await anthropicStream.finalMessage();
        controller.close();
      } catch {
        controller.enqueue(
          encoder.encode(
            "\n\n[Cue couldn't reach the AI model. Check your ANTHROPIC_API_KEY and try again.]"
          )
        );
        controller.close();
      } finally {
        if (fullAnswer.trim()) {
          await prisma.message.create({
            data: { sessionId: id, role: "answer", content: fullAnswer },
          });
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
