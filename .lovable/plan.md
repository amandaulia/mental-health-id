## Problem

The mobile filter panel in `src/components/SearchAndFilters.tsx` is missing two filters that exist on desktop:

- **Institution Type** (rendered desktop-only, lines 722–760)
- **Profession** (rendered desktop-only, lines 763–801)

On mobile (<768px) the collapsible filter grid only shows: City, Specialization, Session Mode, Price Range, Insurance. So on Professional Counseling (where Institution Type and Profession matter most), mobile users cannot filter by them.

## Fix

In `src/components/SearchAndFilters.tsx`, inside the mobile `{showMobileFilters && ...}` block (the `grid grid-cols-2 gap-2` container, around lines 247–478), append two more Popover filter buttons mirroring the desktop versions:

1. **Institution Type** — conditional on `institutionTypeOptions.length > 0`. Icon: `Building2`. Same multi-select chip popover as desktop, using `handleInstitutionTypeSelect` and `getInstitutionTypeLabel`. Show active count badge.
2. **Profession** — conditional on `professionTypeOptions.length > 0`. Icon: `User`. Same chip popover, using `handleProfessionSelect` and `getProfessionLabel`. Show active count badge.

Style each trigger to match the existing mobile filter buttons (`bg-purple-100 ... rounded-full px-3 py-2 h-auto text-xs ...`), and reuse the existing `PopoverContent w-80 p-6` layout with the wrap-of-chips pattern already used for City/Specialization on mobile.

No prop, state, type, or business-logic changes — pure presentation parity between mobile and desktop.

## Files

- `src/components/SearchAndFilters.tsx` — add two Popover blocks inside the mobile grid.
