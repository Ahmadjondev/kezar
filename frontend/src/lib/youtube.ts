/**
 * Extracts YouTube video ID from various URL formats.
 * Supports:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 *   - Bare 11-character video ID
 *
 * Returns the original string if no YouTube ID is found (e.g., direct video path).
 */
export function extractYouTubeId(input: string): string {
  if (!input) return input;

  const match = input.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (match) return match[1];

  // Bare video ID (exactly 11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();

  return input;
}
