## Goal

On the homepage, the search box and every filter in `SearchAndFilters` should narrow results in all five preview sections — Professional Counseling, Clinics & Hospitals, Peer Counseling, Stress Relief Activities, and Organizations — not just Professional Counseling.

## Current state

- `Professional Counseling`: filters by `search` + `locations` only.
- `Clinics & Hospitals`: not filtered at all (uses raw `allBureaus`).
- `Peer Counseling`, `Activities`, `Organizations`: filter by `search` only.
- Filter options (cities, specializations, modes, insurance, professionTypes) are computed only from professional resources, so peer/activity/org cities never appear as options.

## Plan

### 1. Centralize filter logic
Create a small helper module `src/utils/filterResource.ts` exporting one matcher per resource shape:

- `matchProfessional(resource, filters)` — search (name/bureau/city), locations, professionTypes, specializations, modes, insurance, institutionTypes, institutions, priceRange.
- `matchPeer(item, filters)` — search (name/city/specialization), locations (from `peer_counseling_locations`), specializations (against `specialization[]`), modes (against `peer_type`/session mode field if present), priceRange (against `price`).
- `matchActivity(item, filters)` — search (name/org/city), locations (from `activity_locations`), specializations (against activity tags), modes (online/offline), priceRange.
- `matchOrganization(item, filters)` — search (name/city), locations (from `organization_locations`), specializations (against `specialization[]`).

Each matcher silently skips filter dimensions that don't apply to that resource type (e.g. insurance has no meaning for activities), so adding a filter only narrows sections where it's relevant.

### 2. Fetch locations for peer counseling
Update `database.getPeerCounseling()` to include `peer_counseling_locations(location:location(*))` so city/location filtering works. Mirrors how organizations and activities are already fetched.

### 3. Wire the matchers into `Index.tsx`
- Replace the four `useMemo` filter blocks with calls to the new matchers.
- Add a new `filteredClinics` memo applying `matchProfessional` (institution branch) to `allBureaus`, and use it in the Clinics & Hospitals section instead of raw `allBureaus`.
- Keep `sortByCompleteness` and the `.slice(0, 6)` previews unchanged.

### 4. Expand filter options to cover all sections
In `Index.tsx`'s `filterOptions` memo, also aggregate:
- cities from peer counseling, activities, organizations
- specializations from peer counseling, activities, organizations
- (modes/insurance/professionTypes stay sourced from professional resources)

So a city like "Bandung" that only appears in Organizations becomes selectable.

### 5. Empty-state handling
Each section already conditionally renders. Keep the existing "Coming Soon" badge on Peer Counseling when the filtered list is empty, but for other sections add a small muted "No results match your filters" line when their array is empty and any filter is active, so users understand why a section disappeared.

### Technical notes

- No schema changes; only one query update (peer counseling include).
- Matchers are pure functions and unit-test-friendly.
- Type: extend signature with `resource: any` to avoid invasive type changes across mixed shapes.
- This does not touch the dedicated `/peer-counseling`, `/organizations`, `/stress-relief` pages; they can adopt the same matchers in a follow-up if desired.
