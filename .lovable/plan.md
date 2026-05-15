## Goal
Wire insurance labels through the `t()` translation system so Indonesian users see translated values in BureauDetail, PractitionerDetail, FilterTags, and SearchAndFilters.

## Step 1 — Extend `insurance` block in `src/contexts/LanguageContext.tsx`

Add two keys to both `en` and `id`:

- `en.insurance`: add `privateInsurance: "Private Insurance"`, `noInsurance: "No Insurance"`
- `id.insurance`: add `privateInsurance: "Asuransi Pribadi"`, `noInsurance: "Tanpa Asuransi"`

Keep existing `private`, `bpjs`, `none` keys untouched for backward compatibility.

## Step 2 — Replace local `getInsuranceLabel()` in 4 files

For each file: import `useLanguage`, pull `t`, route `private`/`PRIVATE` → `t('insurance.privateInsurance')` and `none` → `t('insurance.noInsurance')`. Keep `BPJS` as a string literal (proper noun).

- **`src/components/SearchAndFilters.tsx`** — already uses `useLanguage`; replace local helper.
- **`src/components/FilterTags.tsx`** — add `useLanguage` import + hook call, then update switch.
- **`src/pages/BureauDetail.tsx`** — add `useLanguage` import + hook call (if not present), then update switch.
- **`src/pages/PractitionerDetail.tsx`** — add `useLanguage` import + hook call, then update the switch (note the uppercase `PRIVATE`/`BPJS` cases that come from the DB).

## Verification

- Switch language toggle to Indonesian on `/practitioner/3`, `/bureau/...`, and home filter chips.
- Confirm "Asuransi Pribadi" / "Tanpa Asuransi" render where "Private Insurance" / "No Insurance" used to.
- Confirm BPJS still displays correctly in both languages.

## Out of scope

No DB changes, no changes to insurance value normalization in `dataTransform.ts`, no other enum categories.