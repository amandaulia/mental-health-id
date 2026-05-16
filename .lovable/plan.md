## Problem

`OrganizationDetail.tsx` and `PeerCounselingDetail.tsx` render `t("detail.location")`, which falls back to displaying the raw key string `detail.location` because that key is missing from `src/contexts/LanguageContext.tsx`. Only `detail.locations` (plural, "Locations") exists.

## Fix

Add a `location` entry inside the `detail` block in both language sections of `src/contexts/LanguageContext.tsx`:

- English `detail` block (around line 309): `location: "Location",`
- Indonesian `detail` block (around line 740): `location: "Lokasi",`

That's it — no component changes needed. The existing `t("detail.location") || "Location"` calls will then resolve correctly in both EN and ID.