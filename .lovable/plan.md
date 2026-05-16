## Change

The current `safeImageSrc` preemptively returns `undefined` for any URL on `fbcdn.net` or `cdninstagram.com`, which forces the placeholder even when the DB has a real URL. Switch the behavior so that:

- If `image` is present in the DB → use it as the `<img src>`.
- Placeholder only when `image` is empty/null OR when the browser fails to load it (`onError`).

## Implementation

`src/utils/imageUrl.ts`:
- Simplify `safeImageSrc(url)` to: `return url || undefined;` (no host-based blocking).
- Keep `isHotlinkBlocked` exported (still used by the admin form warning in `AddPeerCounseling.tsx`) but don't apply it inside `safeImageSrc`.

No changes needed in `UnifiedCard.tsx`, `OrganizationDetail.tsx`, `PeerCounselingDetail.tsx`, or `BureauHeader.tsx` — they already use `safeImageSrc(...) || placeholder` with an `onError` fallback to the placeholder, which is exactly the desired behavior.

## Trade-off
Images hosted on Instagram/Facebook CDNs will briefly attempt to load and then fall back via `onError` if blocked. The admin form still warns admins not to paste such URLs.
