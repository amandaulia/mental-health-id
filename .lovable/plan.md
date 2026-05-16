## 1. Add Profession Type filter (Professional Counseling page)

The `handleProfessionSelect` handler and `filters.professionTypes` state already exist in `SearchAndFilters` — only the UI control is missing.

- Extend `SearchAndFiltersProps.filterOptions` with `professionTypes?: string[]`.
- Add a Profession Type popover button (desktop + mobile) right after the Institution Type filter, conditionally rendered when `professionTypeOptions.length > 0`. Uses the same purple pill styling as other filters and shows an active count badge.
- Each option button calls `handleProfessionSelect(type)` and displays via `getProfessionLabel(t, type)` so it picks up the relabeling from step 3.
- In `src/pages/ProfessionalCounseling.tsx`, collect distinct `profession_type` values from `allPractitioners` + `allBureaus` into `filterOptions.professionTypes`.
- In `src/components/FilterTags.tsx`, route the existing `professionTypes` tag label through `getProfessionLabel(t, value)` so removable chips also show "Counselor".

## 2. Rename "Therapist" → "Counselor" / "Konselor" (display only)

The DB enum value `Therapist` stays unchanged; only the label shown to users is updated.

- `src/utils/labels.ts`: add `therapist: "professionTypes.counselor"` to the `KEY` map in `getProfessionLabel` so any raw `"Therapist"` from the DB renders the existing `professionTypes.counselor` translation (`Counselor` / `Konselor`).
- `src/pages/admin/AddPractitioner.tsx`, `src/pages/admin/AddInstitution.tsx`, `src/components/admin/AddPractitionerForm.tsx`, `src/components/admin/AddInstitutionForm.tsx`, `src/pages/Admin.tsx`: change the option **label** shown in admin dropdowns from `Therapist` to `Counselor` while keeping the submitted value as `"Therapist"` (so existing rows and DB enum keep working). Where the list is a plain `string[]` of identical label+value, switch to `{ label, value }` pairs locally, or render the label via `getProfessionLabel` so EN/ID both pick up.

## 3. No DB migration

DB enum stays `Psychologist | Psychiatrist | Therapist`. This is purely a UI relabel + new filter.

## Out of scope
- Other places that read `profession_type` for analytics, SEO copy, etc. remain untouched — only user-visible profession labels and the new filter change.
