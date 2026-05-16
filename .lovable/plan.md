## Goal
Replace the single `clinic-placeholder.png` fallback with category-specific placeholders hosted in Supabase Storage.

## 1. New helper: `src/utils/placeholderImage.ts`
```ts
const PLACEHOLDERS = {
  institution: ".../Health%20Institutions.png",
  practitioner: ".../Practitioners.png",
  "support-group": ".../Support%20Group.png",
  "peer-counseling": ".../Peer%20Counseling.png",
  organization: ".../Organizations.png",
} as const;

// Priority order when an entity could resolve to multiple categories
const PRIORITY = ["institution","practitioner","support-group","peer-counseling","organization"] as const;

export type PlaceholderCategory = keyof typeof PLACEHOLDERS;
export function getPlaceholderImage(category: PlaceholderCategory | PlaceholderCategory[]): string;
```
- Accepts a single category or an array; if array, picks the highest-priority match.
- Returns the Supabase URL.
- Unknown / unsupported categories (`activity`, `community`) fall back to the existing local `clinic-placeholder.png`.

## 2. Wire it into the UI
Replace `clinicPlaceholder` usage with `getPlaceholderImage(...)` in:
- `src/components/UnifiedCard.tsx` — use `data.type` (already one of the categories).
- `src/pages/OrganizationDetail.tsx` — `"organization"`.
- `src/pages/PeerCounselingDetail.tsx` — `"peer-counseling"`.
- `src/components/BureauHeader.tsx` — `"institution"`.
- `src/pages/PractitionerDetail.tsx` — if it renders an image, use `"practitioner"` (will verify during implementation).

Each `<img>` continues to use `safeImageSrc(data.image) || getPlaceholderImage(category)` and the same URL in the `onError` fallback.

## 3. Memory
Update `mem://style/placeholders` to reflect the new per-category placeholders and priority order.

## Notes
- No DB changes.
- The Supabase `placeholders` bucket is already public.
- `activity` / `community` card types keep the local placeholder since no asset was provided.
