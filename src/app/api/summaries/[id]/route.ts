import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSummariesForUser } from "../route";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const summaries = getSummariesForUser(userId) as Array<{ id: string }>;
  const summary = summaries.find((s) => s.id === id);

  if (!summary) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(summary);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const summaries = getSummariesForUser(userId) as Array<Record<string, unknown>>;
  const summary = summaries.find((s) => s.id === id);

  if (!summary) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Update allowed fields
  if (body.triageState !== undefined) summary.triageState = body.triageState;
  if (body.isFavorite !== undefined) summary.isFavorite = body.isFavorite;
  if (body.tags !== undefined) summary.tags = body.tags;
  if (body.verdict !== undefined) summary.verdict = body.verdict;
  if (body.takeaways !== undefined) summary.takeaways = body.takeaways;
  if (body.steps !== undefined) summary.steps = body.steps;

  return NextResponse.json(summary);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const summaries = getSummariesForUser(userId) as Array<{ id: string }>;
  const index = summaries.findIndex((s) => s.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  summaries.splice(index, 1);
  return NextResponse.json({ success: true });
}
