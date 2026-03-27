import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { extractVideoId, fetchVideoMetadata, fetchTranscript } from "@/lib/youtube";

const schema = z.object({
  url: z.string().min(1, "URL is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = schema.parse(body);

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const [metadata, transcript] = await Promise.all([
      fetchVideoMetadata(videoId),
      fetchTranscript(videoId),
    ]);

    // Update duration from transcript if we got it
    if (transcript.duration > 0) {
      metadata.duration = transcript.duration;
    }

    return NextResponse.json({
      metadata,
      transcript: transcript.fullText,
      segments: transcript.segments,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch transcript";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
