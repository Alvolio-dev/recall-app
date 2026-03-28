import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  extractVideoId,
  fetchVideoMetadata,
  fetchTranscript,
  fetchVideoPageData,
} from "@/lib/youtube";
import { transcribeAudio } from "@/lib/transcribe";

const schema = z.object({
  url: z.string().min(1, "URL is required"),
});

export const maxDuration = 60;

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

    const metadata = await fetchVideoMetadata(videoId);

    // 1. Try YouTube's built-in transcript
    try {
      const transcript = await fetchTranscript(videoId);

      if (transcript.duration > 0) {
        metadata.duration = transcript.duration;
      }

      return NextResponse.json({
        metadata,
        transcript: transcript.fullText,
        segments: transcript.segments,
        limited: false,
      });
    } catch {
      // Transcript unavailable — try audio transcription
    }

    // 2. Try audio transcription via Groq Whisper (free)
    const pageData = await fetchVideoPageData(videoId);

    if (pageData.audioUrl) {
      const audioTranscript = await transcribeAudio(pageData.audioUrl);
      if (audioTranscript && audioTranscript.length > 50) {
        return NextResponse.json({
          metadata,
          transcript: audioTranscript,
          segments: [],
          limited: false,
        });
      }
    }

    // 3. Fall back to description only
    return NextResponse.json({
      metadata,
      transcript: pageData.description || null,
      segments: [],
      limited: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch transcript";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
