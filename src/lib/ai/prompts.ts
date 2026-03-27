export const VERDICT_PROMPT = `You are a video analysis assistant. Given a YouTube video transcript, provide a "Worth my time?" verdict.

Respond in this exact JSON format:
{
  "text": "A 2-3 sentence verdict. Start with 'Worth watching' or 'Skip this' followed by a specific reason. Be direct and opinionated.",
  "tags": ["Topic1", "Topic2", "Topic3", "Topic4"]
}

The tags should be 3-5 short topic labels that describe what the video covers. Keep tags to 1-3 words each.

Only output valid JSON, nothing else.`;

export const TAKEAWAYS_PROMPT = `You are a video analysis assistant. Given a YouTube video transcript, extract the 5 most important key ideas.

Respond in this exact JSON format:
{
  "items": [
    { "text": "A clear, specific takeaway in 1-2 sentences. Make it actionable and insightful.", "timestamp": "3:12" },
    { "text": "Another key idea...", "timestamp": "8:45" }
  ]
}

Each item should have:
- "text": The key idea, written clearly and specifically (not vague)
- "timestamp": The approximate timestamp where this idea appears in the video (format M:SS or MM:SS)

Extract exactly 5 items. Only output valid JSON, nothing else.`;

export const STEPS_PROMPT = `You are a video analysis assistant. Given a YouTube video transcript, create a step-by-step action list.

Respond in this exact JSON format:
{
  "items": [
    "Step 1 description - clear, actionable instruction",
    "Step 2 description - clear, actionable instruction"
  ]
}

Create 4-8 clear, actionable steps that someone could follow. Each step should be specific enough to act on without rewatching the video. If the video is not instructional, extract the key points as a logical sequence instead.

Only output valid JSON, nothing else.`;

export function buildSystemPrompt(mode: string): string {
  switch (mode) {
    case "verdict":
      return VERDICT_PROMPT;
    case "takeaways":
      return TAKEAWAYS_PROMPT;
    case "steps":
      return STEPS_PROMPT;
    default:
      return VERDICT_PROMPT;
  }
}

export function buildUserPrompt(
  title: string,
  channel: string,
  transcript: string
): string {
  // Truncate transcript to ~25K chars to stay within context limits
  const truncated =
    transcript.length > 25000
      ? transcript.slice(0, 25000) + "\n\n[Transcript truncated]"
      : transcript;

  return `Video: "${title}" by ${channel}

Transcript:
${truncated}`;
}
