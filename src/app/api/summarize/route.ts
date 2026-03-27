import { NextRequest } from "next/server";
import { z } from "zod";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai/prompts";

const schema = z.object({
  mode: z.enum(["verdict", "takeaways", "steps"]),
  title: z.string(),
  channel: z.string(),
  transcript: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, title, channel, transcript } = schema.parse(body);

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: buildSystemPrompt(mode),
      prompt: buildUserPrompt(title, channel, transcript),
      maxOutputTokens: 1500,
      temperature: 0.3,
    });

    // Parse the JSON response
    const parsed = JSON.parse(text);

    return Response.json({ mode, result: parsed });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Invalid request", details: error.issues },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to generate summary";
    return Response.json({ error: message }, { status: 500 });
  }
}
