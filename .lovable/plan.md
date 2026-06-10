## Root cause

NALA Mindspace (institution id `1165`) exists in the DB with 6 services, 1 location, 4 contacts, and 3 linked practitioners — so it is being fetched fine. The reason it disappears from the Professional Counseling results is the **price-range filter** in `src/pages/ProfessionalCounseling.tsx` (lines 352–358):

```ts
if (filters.priceRange && bureau.services.length > 0) {
  const hasServiceInRange = bureau.services.some((service) => {
    if (service.price == null) return filters.includeNullPrice;
    return service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1];
  });
  if (!hasServiceInRange) return false;
}
```

All 6 NALA services have `price = NULL` in the `service` table. Because `filters.includeNullPrice` defaults to `false`, every service returns `false` and the bureau is filtered out — even though the user hasn't actively touched the price slider.

The same trap affects practitioners (analogous block) for any institution whose services all have null prices.

## Fix plan

Update `src/pages/ProfessionalCounseling.tsx` so the price filter doesn't silently exclude null-priced resources when the user hasn't narrowed the slider:

1. Treat the price filter as "inactive" when `filters.priceRange` equals the full `[filterOptions.minPrice, filterOptions.maxPrice]` default. While inactive, skip the price check entirely (so null-priced services pass).
2. When the user actually narrows the range, keep the current behavior — null-priced services are included only if `includeNullPrice` is checked.
3. Apply the same logic to the practitioner filter block to keep behavior consistent.
4. Also default `filters.includeNullPrice` to `true` for safety, so toggling the slider doesn't immediately drop all null-priced items until the user explicitly opts out.

No DB changes, no other components touched. After the change, verify by reloading Professional Counseling with no filters applied and confirming "NALA Mindspace" appears in the bureau list.