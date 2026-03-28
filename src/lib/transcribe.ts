import Groq from "groq-sdk";

const MAX_AUDIO_BYTES = 24 * 1024 * 1024; // 24MB (Groq limit is 25MB)

/**
 * Download audio from a URL, capped at MAX_AUDIO_BYTES.
 */
async function downloadAudio(audioUrl: string): Promise<Buffer> {
  const res = await fetch(audioUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });

  if (!res.ok || !res.body) {
    throw new Error("Failed to download audio");
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_AUDIO_BYTES) {
      chunks.push(value.slice(0, value.byteLength - (totalBytes - MAX_AUDIO_BYTES)));
      break;
    }
    chunks.push(value);
  }

  reader.cancel();
  return Buffer.concat(chunks);
}

/**
 * Transcribe audio using Groq's free Whisper API.
 * Returns the transcript text, or null if unavailable.
 */
export async function transcribeAudio(audioUrl: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const audioBuffer = await downloadAudio(audioUrl);
    if (audioBuffer.byteLength < 1000) return null; // too small, probably an error page

    const groq = new Groq({ apiKey });

    const file = new File([new Uint8Array(audioBuffer)], "audio.webm", { type: "audio/webm" });

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
      response_format: "verbose_json",
    });

    // verbose_json returns segments with timestamps
    const segments = (transcription as { segments?: { start: number; end: number; text: string }[] }).segments;
    if (segments && segments.length > 0) {
      return segments.map((s) => s.text).join(" ").trim();
    }

    return (transcription as { text?: string }).text?.trim() || null;
  } catch {
    return null;
  }
}
