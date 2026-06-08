# Improve Load Performance & Fix Click Tracking

## Problems found

**Popularity tracking is silently broken.** The `resource_popularity` table is empty even though `trackCardClick` calls the RPC. Cause: `ProfessionalCounseling.tsx` builds card data with `type: "bureau"`, but the RPC `increment_resource_click` only accepts `"practitioner"` or `"institution"` and raises an exception for anything else. Every bureau card click fails server-side. Detail pages reached directly (deep links, SEO traffic) also never increment.

**Initial load is heavier than it needs to be.** Jotform scripts are render-blocking in `<body>`, GA is injected synchronously on first render, and the two big "with-relations" queries fire on the home page even before the user scrolls to results.

## Changes

### 1. Fix click tracking (data correctness)
- `src/utils/analytics.ts` → `trackCardClick`: map `"bureau"` → `"institution"` before calling the RPC; keep GA label as-is.
- `src/components/UnifiedCard.tsx`: no change needed once the mapping lands.
- Add a tiny `useTrackResourceView` hook fired once per detail page mount (`PractitionerDetail`, `BureauDetail`) so direct visits also count toward popularity. Debounced via a `sessionStorage` key per `resource:id` to avoid double-counting refreshes within the session.
- Optional: log RPC errors to the console so future breakage is visible.

### 2. Shared popularity query
Both `Index.tsx` and `ProfessionalCounseling.tsx` inline the same `resource_popularity` query. Extract into `useResourcePopularity()` in `src/hooks/useDatabase.ts` with a 5-minute `staleTime`, so it's cached across pages and only fetched once.

### 3. Defer non-critical third-party scripts (`index.html`)
- Move Jotform `feedback2.js`, `for-form-embed-handler.js`, and the init script to `defer` and load them after `DOMContentLoaded`, or inject them from `AppContent` on idle (`requestIdleCallback`). They're not needed for first paint.
- Same treatment for Google Analytics: keep the `initGA` call but schedule it inside `requestIdleCallback` (fallback `setTimeout 1500ms`) so the GA script doesn't compete with the React bundle on slow connections. Queue `trackPageView` calls until GA is ready.

### 4. Code-splitting tweaks (`vite.config.ts`)
Add `build.rollupOptions.output.manualChunks` to split vendor bundles:
```text
react vendor      → react, react-dom, react-router-dom
ui vendor         → @radix-ui/*, lucide-react
data vendor       → @tanstack/react-query, @supabase/supabase-js
```
This makes the initial chunk smaller and lets the browser cache vendor code across deploys.

### 5. Image hints
- Add `loading="lazy"` and explicit `width`/`height` to card images in `UnifiedCard.tsx` and `ImageWithFallback.tsx` (prevents CLS, defers offscreen images).
- Add `<link rel="preconnect" href="https://vvvsefzarzfisxrpfygw.supabase.co" crossorigin>` and `<link rel="preconnect" href="https://www.googletagmanager.com">` in `index.html` so the first Supabase request and GA handshake start during HTML parse.

### 6. Verify
- After changes, click a bureau card and a practitioner card, then run a `SELECT * FROM resource_popularity` to confirm rows appear.
- Visit a detail page directly and confirm a row is inserted.
- Open the preview, check the Network panel: Jotform/GA should load after the main JS, and the initial JS payload should drop noticeably.

## Out of scope
- No schema changes — `resource_popularity` already supports what we need.
- No new tracked resource types (peer-counseling/organizations) unless you want them; current RPC restricts to practitioner/institution.
- No changes to filter/sort logic.
