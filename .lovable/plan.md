## Root Cause

The `image` URLs for Alpas, Mengenal Diri, and similar entries point to Instagram's CDN (`instagram.fbdo9-1.fna.fbcdn.net/...`). These URLs:

1. **Are signed and expire** — note the `oe=6A0D0AD2` / `oe=6A0D2F34` and `oh=...` query params. Once expired, the CDN returns 403.
2. **Block hotlinking** — Instagram/Facebook CDN checks `Referer`/`Origin` headers. Requests from `lovable.app` (or any non-Instagram origin) are rejected with 403.
3. **Are tied to a session** — `_nc_sid`, `_nc_gid`, `edm` are scoped to the browser session that scraped them.

So `<img src=...>` fails to load → `onError` swaps in `clinic-placeholder.png` (matches the memory rule).

This is not a code bug — the URLs themselves are unusable from a third-party site.

## Fix options

**Option A — Re-host images in Supabase Storage (recommended)**
- Download each Instagram image once, upload to the existing `practitioners` bucket (or a new `peer-counseling` bucket), and store the public Supabase URL in `peer_counseling.image`.
- Permanent, fast, no CORS/hotlink issues.
- Requires a one-time script + admin action when new entries are added.

**Option B — Use a generic source that allows hotlinking**
- Ask admins to paste only URLs from sources that permit embedding (their own website, Cloudinary, Imgur direct links, etc.). Reject `*.fbcdn.net` / `*.cdninstagram.com` at the admin form level with a warning.

**Option C — Proxy through an edge function**
- An edge function fetches the image server-side (where Instagram's referer check is less strict for some endpoints) and streams it back. Fragile — Instagram still rate-limits and may block — and adds latency. Not recommended.

## Proposed implementation (Option A)

1. Add a validation note in the admin "Add Peer Counseling" form: warn if URL host matches `fbcdn.net` / `cdninstagram.com`.
2. Run a one-off script (outside the app) to migrate the existing broken URLs:
   - For each `peer_counseling` row with an `fbcdn.net` / `cdninstagram.com` image, download via the original Instagram session (or have the admin re-upload), push to Supabase Storage, update the row.
3. Going forward, the admin form should support direct file upload to Supabase Storage instead of a URL field (similar to how `practitioners` bucket is used).

No DB schema change needed — `image` stays `text`.
