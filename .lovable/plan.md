## Root cause

Both bugs come from the same source: a service with `price = 0` is treated as "no price" throughout the code, so it's either filtered out or evaluated as falsy.

For bureau 65 the database actually has only two services:
- `Konseling BPJS` — price `0`
- `Konseling Tanpa BPJS` — price `15000`

(There is no separate "15.000 – 30.000" service. What you're calling "the service with a price range" is the bureau's price range badge derived from min/max across all its services. Because the `0` service is being dropped, only `Rp 15.000` survives — making it look like the range "lost" its upper/lower value.)

### Bug 1 — Price `0` service is hidden on the bureau detail page
`src/pages/BureauDetail.tsx` initializes the price slider from `services.map(s => s.price ?? 0).filter(p => p > 0)`, so the default min becomes `15000`. The filter then evaluates `service.price (= 0) >= 15000` → false, hiding the BPJS service. Same `> 0` filter is repeated in `removeFilter`, `clearAllFilters`, and `hasActiveFilters`.

### Bug 2 — Card price range only shows the higher number
`src/pages/ProfessionalCounseling.tsx` (both `allPractitioners` and `allBureaus` memos) builds the card's `priceRange` with:
```ts
priceRange: minPrice && maxPrice ? `Rp ${minPrice.toLocaleString()} - Rp ${maxPrice.toLocaleString()}` : null
```
When `minPrice === 0`, the `&&` short-circuits to `0` (falsy) → `priceRange` becomes `null`. Combined with similar 0-as-falsy logic, the visible price collapses to just the non-zero one.

`src/utils/dataTransform.ts → calculatePriceRange` correctly includes 0 in the array but formats it as `Rp 0` rather than `Free`.

## Fix plan

1. **`src/pages/BureauDetail.tsx`** — stop discarding `price === 0`:
   - Replace every `.filter(p => p > 0)` (lines ~75, 220, 236, 247) with `.filter((p): p is number => p != null)` so 0 is a valid price.
   - Default the slider min to `0` (or the actual min including 0) and the max to the real max.
   - Keep the existing service-row rendering that already shows "Free" / "Price available upon request" — but change it so `price === 0` renders as **"Free"** and only `price == null` renders as "Price available upon request" (per your expectation).

2. **`src/pages/ProfessionalCounseling.tsx`** — fix falsy-zero in card price range:
   - Change `minPrice && maxPrice ? ... : null` to `minPrice != null && maxPrice != null ? ... : null` in both `allPractitioners` and `allBureaus` memos.
   - Format the range so a `0` value displays as `Free` instead of `Rp 0` (e.g. `Free - Rp 15.000`, or just `Free` when both ends are 0).
   - Make sure the price-range filter on this page also accepts 0 (`includeNullPrice` already covers null, but `priceRange[0]` may default above 0; verify the `service-price-range` query and slider min start at 0 when a 0-priced service exists, or simply allow `service.price === 0` to always pass).

3. **`src/utils/dataTransform.ts → calculatePriceRange`** — same "Free" formatting so any other consumer (e.g. `BureauHeader`, practitioner cards) renders consistently.

4. **Sanity check** other places that read price with `> 0` or truthy checks: `UnifiedCard`, `PractitionerServices`, and the practitioner detail page. Apply the same null-vs-zero distinction wherever a service price is rendered or filtered.

## Expected result

- `/bureau/65` shows both services; "Konseling BPJS" displays as **Free**.
- The bureau card on `/professional-counseling` shows the range **Free – Rp 15.000** instead of disappearing or collapsing to a single value.
- Services with `price = null` continue to show "Price available upon request".