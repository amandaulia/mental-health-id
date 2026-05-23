/**
 * Hosts known to block hotlinking or use short-lived signed URLs.
 * Images from these hosts return 403 / expire and cannot be reliably
 * displayed from another origin. Treat them as unusable.
 */
const BLOCKED_HOST_PATTERNS = [/\.fbcdn\.net$/i, /\.cdninstagram\.com$/i];

export function isHotlinkBlocked(url?: string | null): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return BLOCKED_HOST_PATTERNS.some((re) => re.test(host));
  } catch {
    return false;
  }
}

/**
 * Returns the URL if it can safely be loaded as an <img src>, otherwise undefined
 * so callers fall back to a placeholder.
 */
export function safeImageSrc(url?: string | null): string | undefined {
  const trimmedUrl = url?.trim();
  if (!trimmedUrl || isHotlinkBlocked(trimmedUrl)) return undefined;
  return trimmedUrl;
}
