## Problem

The sort dropdown only renders when `SearchAndFilters` receives the `showSort` prop. Only `ProfessionalCounseling.tsx` passes it, so the Home page (`/`) doesn't show the control.

## Change

In `src/pages/Index.tsx`, pass `showSort` to `<SearchAndFilters>` and wire `filters.sortBy` into the sorting of the previewed lists.

### Technical details

1. `src/pages/Index.tsx`
   - Add `showSort` to the `<SearchAndFilters>` props (around line 361).
   - Ensure `filters` initial state includes a default `sortBy` (e.g. `"popular"`), matching what ProfessionalCounseling uses.
   - Replace the six `sortByCompleteness(filtered)` calls with `sortResources(filtered, { sortBy: filters.sortBy ?? "popular", popularity, userLocation })`, mirroring the pattern already used in `ProfessionalCounseling.tsx`. Reuse the same `usePopularity` / `useUserLocation` hooks if they exist there; otherwise lift the minimal logic.
   - Optionally pass `locationSortMessage` so the "nearest" hint shows when geolocation is unavailable, matching Professional.

2. No changes to `SearchAndFilters.tsx` — the existing `showSort` branch already renders the dropdown on mobile (line 281) and desktop (line 922).

3. Leave Peer Counseling, Organizations, and Stress Relief unchanged per your choice.

## Verification

- Load `/` on desktop and mobile, confirm the sort pill appears next to the filters.
- Switching sort changes the order of the preview grids (popular / name / lowest / highest / nearest).
- ProfessionalCounseling continues to work unchanged.
