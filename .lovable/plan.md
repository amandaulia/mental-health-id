# Translate remaining card & detail labels

Two parts: (1) wire keys that already exist, (2) add a handful of new keys for strings the table missed (`Duration not specified`, `In-Person`/`Text Chat`/`Voice Call`/`Video Call`, `Location`, `Psychologist`/`Psychiatrist`, the `+N more` suffix, `Independent Bureau`).

## Part 1 — Wiring only (keys already exist)

**`src/components/UnifiedCard.tsx`**
- L130, L165: keep `"BPJS"` literal (brand), already uses `t('insurance.privateInsurance')` ✓ — no change needed.
- L187, L205: already uses `t('common.free')` ✓ — no change needed.
- L94: already uses `t('common.verified')` ✓.
- L102–117 / L142–151: profession-type badges currently render the raw string. Map through `getProfessionLabel(type)` (see new helper in Part 2).

**`src/components/BureauCard.tsx`**
- L39 verified badge ✓ already wired.
- L77 insurance ✓ already wired.
- L15–28 `getBureauTypeLabel`: replace with `t('institutionTypes.privatePractice' | 'clinic' | 'faskes1' | 'faskes2')`. (`institutionTypes.privatePractice` already exists; covers the "Independent Bureau" case.)
- L46 profession-type badges: pass through `getProfessionLabel(type)`.

**`src/components/PractitionerCard.tsx`**
- L85 verified ✓; L145–147 insurance ✓.
- L93 profession-type badges: pass through `getProfessionLabel`.
- L116 `+N more`: replace with `t('common.more', { count })` — needs new key.

## Part 2 — New keys + small helper

Add to **`src/contexts/LanguageContext.tsx`** under `common`:
- `more` → EN `"more"` / ID `"lainnya"`
- `location` → EN `"Location"` / ID `"Lokasi"`
- `durationNotSpecified` → EN `"Duration not specified"` / ID `"Durasi tidak ditentukan"`

`sessionModes` already has `chat / voiceCall / videoCall / offline`. Add explicit display variants used on cards/detail:
- `sessionModes.textChat` → `"Text Chat"` / `"Obrolan Teks"`
- `sessionModes.inPerson` → `"In-Person"` / `"Tatap Muka"`
- `sessionModes.offlineSession` → `"Offline Session"` / `"Sesi Tatap Muka"`

`institutionTypes` already covers `clinic/privatePractice/faskes1/faskes2`. No additions.

`professionTypes` already has `psychologist/psychiatrist/...`. Add a small mapper helper inside `LanguageContext` (or a new `src/utils/labels.ts`) consumed by cards/details:

```ts
// returns translated label for an arbitrary profession string from data
export function getProfessionLabel(t, raw: string) {
  const k = raw.trim().toLowerCase();
  const map = {
    psychologist: 'professionTypes.psychologist',
    psychiatrist: 'professionTypes.psychiatrist',
    'art therapist': 'professionTypes.artTherapist',
    'music therapist': 'professionTypes.musicTherapist',
    counselor: 'professionTypes.counselor',
    'social worker': 'professionTypes.socialWorker',
  };
  return map[k] ? t(map[k]) : raw;
}
```

## Part 3 — Wire the new keys into components

- **`src/utils/dataTransform.ts`** L102: this file has no `t()` access. Replace literal with a sentinel `"__DURATION_NOT_SPECIFIED__"` and translate at render sites that show `service.duration` (BureauServices / PractitionerServices). Render: `value === '__DURATION_NOT_SPECIFIED__' ? t('common.durationNotSpecified') : value`.
- **`src/components/SearchAndFilters.tsx`** L62–70 `getModeLabel`: switch to `t('sessionModes.textChat'|'voiceCall'|'videoCall'|'inPerson')`. L72–80 `getInstitutionTypeLabel`: switch to `t('institutionTypes.*')`.
- **`src/pages/BureauDetail.tsx`** L153–161 `getModeLabel`: same as above.
- **`src/pages/PractitionerDetail.tsx`** L97–104 `getModeLabel`: same; `offline` → `t('sessionModes.offlineSession')`.
- **`src/components/PractitionerCard.tsx`** L116: `+N {t('common.more')}`.
- Anywhere a "Location" column header is rendered as a hardcoded literal, swap to `t('common.location')`.

## Out of scope

- Admin pages (`/admin/*`) and `AddInstitutionForm`/`AddPractitionerForm` "Verified" labels — admin UI, not user-facing.
- `mockData.ts` / type unions / `supabase/types.ts` literals — data layer, must stay English.
- Brand strings: `BPJS`, `Rp`, `WhatsApp`, `Instagram`, image alts.

## Verification

- Toggle EN/ID on `/professional-counseling`. Confirm cards show translated profession types, verified badge, insurance, institution type, "+N more".
- Open `/bureau/:id` and `/practitioner/:id`; confirm session mode chips, "Duration not specified" fallback, "Location" header all translate.
- Confirm filter dropdowns (mode + institution type) translate.
