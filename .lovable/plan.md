## Why the page is slow

The home page (`src/pages/Index.tsx`) is the main bottleneck. After the initial `practitioners` + `institutions` lists load, it fires **four N+1 query loops** sequentially, one Supabase request per row:

- `getServicesByPractitioner` for every practitioner
- `getServicesByInstitution` for every institution (each of these in turn fires another query against `contact_details`)
- `getLocationsByPractitioner` for every practitioner
- `getLocationsByInstitution` for every institution

With ~50 practitioners + ~50 institutions, that's **200+ serial round-trips** before the page is allowed to render anything — the whole page is gated behind `if (isLoading) return <skeleton/>`. The console logs confirm dozens of `Raw services from DB` / `Fetching contact_details` round-trips firing one after another.

Meanwhile `ProfessionalCounseling.tsx` already uses the optimized `usePractitionersWithRelations` / `useInstitutionsWithRelations` hooks that fetch everything in **2 queries** via Supabase JOINs. We just need to do the same on the home page.

Two smaller wins:
- `App.tsx` imports every route eagerly, so the initial JS bundle includes admin/detail pages users may never visit.
- Card images have no `loading="lazy"` or `decoding="async"`, so off-screen logos all decode up front.

## Plan

### 1. Rewrite `src/pages/Index.tsx` to use the optimized JOIN hooks
- Replace `useInstitutions` + the four per-row `useQuery` loops with `usePractitionersWithRelations` and `useInstitutionsWithRelations`.
- Build `allPractitioners` / `allBureaus` directly from the nested `practitioner_services`, `practitioner_locations`, `institution_services`, `institution_locations` arrays (mirror the transform already used in `ProfessionalCounseling.tsx`).
- Drop the now-unused per-row imports from `databaseService`.
- Net effect: ~200 serial requests → 2 parallel requests on first paint.

### 2. Don't block the whole page on secondary sections
- Render the hero + search immediately.
- Only the "Professional", "Peer Counseling", "Activities", "Organizations" result grids should show their own small skeleton while their respective query is still loading, instead of hiding the entire page behind one global `isLoading`.

### 3. Route-level code splitting in `src/App.tsx`
- Convert each `Route` page import to `React.lazy(() => import(...))` and wrap `<Routes>` in `<Suspense fallback={...}>`.
- Keeps the initial bundle small; detail/admin pages load on demand.

### 4. Image lazy loading in `src/components/UnifiedCard.tsx`
- Add `loading="lazy"` and `decoding="async"` to the card `<img>`.
- Cheap win for pages with many cards.

### 5. (Optional) React Query defaults
- In `App.tsx`, set `QueryClient` defaults: `staleTime: 5 * 60 * 1000`, `refetchOnWindowFocus: false`. Prevents redundant refetches when users switch tabs.

## Out of scope
- No DB schema changes.
- No changes to filtering/sorting behavior or UI design.
- Admin pages and detail pages are untouched except for being lazy-loaded.

## Expected impact
- First meaningful paint on `/` drops from "wait for ~200 round-trips" to "wait for 2 parallel queries" — typically 5–15× faster on a populated DB.
- Smaller initial JS bundle for first visit.
- Smoother scroll on pages with many cards.
