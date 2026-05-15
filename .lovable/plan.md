## Why it shows "Independent"

`transformPractitioner` (in `src/utils/dataTransform.ts`) reads the institution from `dbPractitioner.practitioner_institutions?.[0]?.institution`. If that field is missing, it falls back to `"Independent"`.

On the home page (`src/pages/Index.tsx` line 45), practitioners are loaded via `usePractitioners()`, which calls `databaseService.getPractitioners()` — a plain `select("*")` on the `practitioner` table with **no embedded relations**. So `practitioner_institutions` is `undefined` for every practitioner on the home page, and the card defaults to "Independent".

The Professional Counseling page does not have this bug because it fetches the embed inline (`src/pages/ProfessionalCounseling.tsx` line 126 uses `practitioner.practitioner_institutions?.[0]?.institution?.name`).

The DB join itself is intact and the recent RLS migration did not change `practitioner_institutions` — verified by querying as the anon role and getting back the institution names correctly.

## Fix

Switch the home page to a query that includes the institution embed.

### File changes

- **`src/pages/Index.tsx`**
  - Replace `usePractitioners()` with `usePractitionersWithRelations()` from `@/hooks/useDatabase` (already exists; runs one optimized query that includes `practitioner_institutions(institution(*))`, `practitioner_locations`, and `practitioner_services`).
  - Keep the existing `transformPractitioner(...)` call as-is — it already reads the embed when present.
  - Optional follow-up (not required for the fix): the page also fires per-practitioner `getServicesByPractitioner` / `getLocationsByPractitioner` queries; those become redundant once the relations hook is used and could be removed later to reduce request count.

### Out of scope

- No DB / RLS changes.
- No edits to `dataTransform.ts`, the card components, or the Professional Counseling page.