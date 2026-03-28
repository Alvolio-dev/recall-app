import { YoutubeTranscript } from "youtube-transcript";

export interface VideoMetadata {
  videoId: string;
  title: string;
  channel: string;
  duration: number; // seconds
  thumbnailUrl: string;
}

export interface TranscriptSegment {
  text: string;
  offset: number; // ms
  duration: number; // ms
}

/**
 * Extract video ID from various YouTube URL formats.
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Fetch video metadata using YouTube's oEmbed endpoint (no API key needed).
 */
export async function fetchVideoMetadata(
  videoId: string
): Promise<VideoMetadata> {
  const oembedUrl = `https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${videoId}&format=json`;
  const res = await fetch(oembedUrl);

  if (!res.ok) {
    throw new Error("Could not fetch video metadata. Is this a valid YouTube URL?");
  }

  const data = await res.json();

  return {
    videoId,
    title: data.title || "Untitled",
    channel: data.author_name || "Unknown",
    duration: 0, // oEmbed doesn't provide duration; we'll estimate from transcript
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}

/**
 * Fetch transcript for a YouTube video.
 */
export async function fetchTranscript(
  videoId: string
): Promise<{ segments: TranscriptSegment[]; fullText: string; duration: number }> {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoId);

    const mapped: TranscriptSegment[] = segments.map((s) => ({
      text: s.text,
      offset: s.offset,
      duration: s.duration,
    }));

    const fullText = mapped.map((s) => s.text).join(" ");

    // Estimate duration from last segment
    const lastSegment = mapped[mapped.length - 1];
    const duration = lastSegment
      ? Math.ceil((lastSegment.offset + lastSegment.duration) / 1000)
      : 0;

    return { segments: mapped, fullText, duration };
  } catch {
    throw new Error(
      "Could not fetch transcript. This video may not have captions available."
    );
  }
}

/**
 * Format seconds into a human-readable duration.
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

/**
 * Format milliseconds offset to timestamp string (e.g. "3:12").
 */
export function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
