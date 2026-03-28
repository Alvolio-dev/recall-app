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
 * Fetch the video description and optionally an audio stream URL from the watch page.
 */
export async function fetchVideoPageData(videoId: string): Promise<{ description: string; audioUrl: string | null }> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { "User-Agent": WEB_USER_AGENT },
    });
    const html = await res.text();
    const match = html.match(/var ytInitialPlayerResponse\s*=\s*(\{[\s\S]+?\});/);
    if (!match) return { description: "", audioUrl: null };
    const player = JSON.parse(match[1]);
    const description = player?.videoDetails?.shortDescription || "";

    // Try to find a direct audio stream URL (no signature cipher)
    let audioUrl: string | null = null;
    const formats = player?.streamingData?.adaptiveFormats;
    if (Array.isArray(formats)) {
      const audioFormats = formats
        .filter((f: { mimeType?: string; url?: string }) => f.mimeType?.startsWith("audio/") && f.url)
        .sort((a: { bitrate?: number }, b: { bitrate?: number }) => (a.bitrate || 0) - (b.bitrate || 0));
      if (audioFormats.length > 0) {
        audioUrl = audioFormats[0].url;
      }
    }

    return { description, audioUrl };
  } catch {
    return { description: "", audioUrl: null };
  }
}

/**
 * Fetch the video description from the watch page.
 */
export async function fetchVideoDescription(videoId: string): Promise<string> {
  const { description } = await fetchVideoPageData(videoId);
  return description;
}

const INNERTUBE_URL = "https://www.youtube.com/youtubei/v1/player?prettyPrint=false";
const INNERTUBE_CLIENT_VERSION = "2.20240313.00.00";
const WEB_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function parseTranscriptXml(xml: string): TranscriptSegment[] {
  const segments: TranscriptSegment[] = [];

  // Try <p t="..." d="..."> format first (newer)
  const pRegex = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = pRegex.exec(xml)) !== null) {
    const offset = parseInt(match[1], 10);
    const duration = parseInt(match[2], 10);
    let text = match[3];
    // Extract text from <s> tags if present
    const sRegex = /<s[^>]*>([^<]*)<\/s>/g;
    let sMatch;
    let combined = "";
    while ((sMatch = sRegex.exec(text)) !== null) combined += sMatch[1];
    if (!combined) combined = text.replace(/<[^>]+>/g, "");
    combined = decodeEntities(combined).trim();
    if (combined) segments.push({ text: combined, offset, duration });
  }

  if (segments.length > 0) return segments;

  // Fallback: <text start="..." dur="..."> format (older)
  const textRegex = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;
  while ((match = textRegex.exec(xml)) !== null) {
    const offset = Math.round(parseFloat(match[1]) * 1000);
    const duration = Math.round(parseFloat(match[2]) * 1000);
    const text = decodeEntities(match[3]).trim();
    if (text) segments.push({ text, offset, duration });
  }

  return segments;
}

async function fetchCaptionTracks(videoId: string): Promise<{ baseUrl: string; languageCode: string }[]> {
  // Method 1: InnerTube API (WEB client)
  try {
    const res = await fetch(INNERTUBE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": WEB_USER_AGENT,
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion: INNERTUBE_CLIENT_VERSION,
          },
        },
        videoId,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      if (Array.isArray(tracks) && tracks.length > 0) return tracks;
    }
  } catch { /* fall through */ }

  // Method 2: Scrape the watch page
  const pageRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: { "User-Agent": WEB_USER_AGENT },
  });
  const html = await pageRes.text();

  if (html.includes('class="g-recaptcha"')) {
    throw new Error("YouTube is rate-limiting requests. Please try again later.");
  }

  const jsonMatch = html.match(/var ytInitialPlayerResponse\s*=\s*(\{[\s\S]+?\});/);
  if (!jsonMatch) {
    throw new Error("Could not fetch transcript. This video may not have captions available.");
  }

  try {
    const player = JSON.parse(jsonMatch[1]);
    const tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (Array.isArray(tracks) && tracks.length > 0) return tracks;
  } catch { /* fall through */ }

  throw new Error("Could not fetch transcript. This video may not have captions available.");
}

/**
 * Fetch transcript for a YouTube video.
 */
export async function fetchTranscript(
  videoId: string
): Promise<{ segments: TranscriptSegment[]; fullText: string; duration: number }> {
  const tracks = await fetchCaptionTracks(videoId);

  // Prefer English, fall back to first available
  const track =
    tracks.find((t) => t.languageCode === "en") ??
    tracks.find((t) => t.languageCode.startsWith("en")) ??
    tracks[0];

  const url = new URL(track.baseUrl);
  if (!url.hostname.endsWith(".youtube.com")) {
    throw new Error("Could not fetch transcript. This video may not have captions available.");
  }

  const res = await fetch(track.baseUrl, {
    headers: { "User-Agent": WEB_USER_AGENT },
  });
  if (!res.ok) {
    throw new Error("Could not fetch transcript. This video may not have captions available.");
  }

  const xml = await res.text();
  const segments = parseTranscriptXml(xml);

  if (segments.length === 0) {
    throw new Error("Could not fetch transcript. This video may not have captions available.");
  }

  const fullText = segments.map((s) => s.text).join(" ");

  const lastSegment = segments[segments.length - 1];
  const duration = lastSegment
    ? Math.ceil((lastSegment.offset + lastSegment.duration) / 1000)
    : 0;

  return { segments, fullText, duration };
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
