import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Temporary in-memory store until database is connected
// This will be replaced with Prisma queries
const summariesStore: Map<string, unknown[]> = new Map();

export function getSummariesForUser(userId: string) {
  return summariesStore.get(userId) || [];
}

export function addSummaryForUser(userId: string, summary: unknown) {
  const existing = summariesStore.get(userId) || [];
  existing.unshift(summary);
  summariesStore.set(userId, existing);
}

const createSchema = z.object({
  videoId: z.string(),
  title: z.string(),
  channel: z.string(),
  duration: z.number(),
  thumbnailUrl: z.string(),
  transcript: z.string().optional(),
  verdict: z.unknown().optional(),
  takeaways: z.unknown().optional(),
  steps: z.unknown().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const summary = {
      id: crypto.randomUUID(),
      userId,
      ...data,
      triageState: "INBOX" as const,
      tags: data.tags || [],
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    addSummaryForUser(userId, summary);

    return NextResponse.json(summary, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save summary" }, { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summaries = getSummariesForUser(userId);
  return NextResponse.json(summaries);
}
