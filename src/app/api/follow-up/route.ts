import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

const schema = z.object({
  question: z.string().min(1),
  transcript: z.string().min(1),
  title: z.string(),
  channel: z.string(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { question, transcript, title, channel } = schema.parse(body);

    const truncated =
      transcript.length > 25000
        ? transcript.slice(0, 25000) + "\n\n[Transcript truncated]"
        : transcript;

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: `You are a helpful assistant that answers questions about YouTube videos. Be concise and specific. Reference specific moments from the video when relevant. Answer in 2-4 sentences unless a longer answer is clearly needed.`,
      prompt: `Video: "${title}" by ${channel}

Transcript:
${truncated}

User question: ${question}`,
      maxOutputTokens: 500,
      temperature: 0.4,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
    return Response.json({ error: "Failed to answer question" }, { status: 500 });
  }
}
