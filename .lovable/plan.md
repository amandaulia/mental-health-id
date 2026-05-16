## Institution Detail Page — Practitioner Card Fixes

### Problems

On `/bureau/:id`, the practitioner cards under the institution show "Independent" as the bureau name, render insurance chips, show "Price not available", and lack a real city — because `getPractitionersByInstitution` only fetches the `practitioner(*)` row without its services, locations, or linked institutions.

### Changes

**1. `src/services/database.ts` — enrich `getPractitionersByInstitution`**
Extend the select to include the relations needed for cards:
```
practitioner(
  *,
  practitioner_institutions(institution(*)),
  practitioner_services(service(*)),
  practitioner_locations(location(*))
)
```

**2. `src/pages/BureauDetail.tsx` — hydrate practitioners with services + city**
In the `useEffect` that builds `transformedPractitioners`:
- Map `practitioner_services` to `Service[]` via `transformService`.
- Read `practitioner_locations[0].location.city` and assign it to the transformed practitioner's `city`.
- Pass a `variant="institution"` (or `hideInstitutionName` + `hideInsurance`) prop to `<PractitionerCard>` in the institution detail listing.

**3. `src/components/PractitionerCard.tsx` — context-aware card**
Add optional props:
- `hideInstitutionName?: boolean` — when true, do not render the `bureauName` line (no "Independent" fallback either).
- `hideInsurance?: boolean` — when true, omit the insurance badges block.
- Change the empty-price fallback from `t('common.priceNotAvailable')` to `t('detail.priceUponRequest')` so it matches the Services card wording everywhere (single source of truth).

### Out of scope
No DB schema changes. Other pages using `PractitionerCard` keep current behavior (props default to `false`); only BureauDetail passes the hide flags.
