## Goal

Add richer per-entity JSON-LD structured data to practitioner and bureau detail pages so Google can render rich results (knowledge panel, business info) instead of generic blue links.

## Approach

Extend `PageSEO.tsx` to accept an optional `jsonLd` prop (object or array). When provided, render an extra `<script type="application/ld+json">` inside `<Helmet>`. This keeps existing per-route SEO untouched and lets each detail page pass its own schema.

Then build the schema objects inline in each detail page from already-loaded data.

## Schema per page

### PractitionerDetail (`/practitioner/:id`)

Combine two `@graph` nodes:

1. **Person** — name, jobTitle (first profession), image, url, knowsAbout (specializations), alumniOf (education), worksFor (link to bureau if any).
2. **MedicalBusiness** wrapper for the booking offering — uses practitioner's location[0] (address, city, province, country), telephone (from contactDetails type Phone/WhatsApp), priceRange, availableService (map services to `MedicalProcedure`/`Service` with `offers.price` + `priceCurrency: IDR`).

### BureauDetail (`/bureau/:id`)

One **MedicalClinic** node (falls back to `LocalBusiness` for non-clinic bureauTypes):

- name, image, url, telephone, priceRange
- address → `PostalAddress` (streetAddress, addressLocality=city, addressRegion=province, addressCountry=country) from location[0]
- geo → `GeoCoordinates` if lat/lng present and non-zero
- medicalSpecialty (specializations)
- availableService (services with offers)
- sameAs (Website/Instagram from contactDetails)
- openingHours if `businessHours` present

## Technical details

```ts
// PageSEO.tsx — add prop
interface PageSEOProps {
  ...existing,
  jsonLd?: object | object[];
}
// inside <Helmet>:
{jsonLd && (
  <script type="application/ld+json">
    {JSON.stringify(Array.isArray(jsonLd)
      ? { "@context": "https://schema.org", "@graph": jsonLd }
      : { "@context": "https://schema.org", ...jsonLd })}
  </script>
)}
```

Each detail page builds the object with `useMemo` from existing `practitioner` / `bureau` / `locations` / `contactDetails` state — no new data fetching.

Helper: small `buildPostalAddress(location)` and `buildOffers(services)` inlined per page (no new util file unless both pages share enough — likely yes, will add `src/utils/jsonLd.ts`).

## Files to change

- `src/components/PageSEO.tsx` — add `jsonLd` prop + script tag.
- `src/utils/jsonLd.ts` — **new**, small helpers (`buildPostalAddress`, `buildOffers`, `buildSameAs`, `phoneFromContacts`).
- `src/pages/PractitionerDetail.tsx` — build Person + MedicalBusiness graph, pass to `<PageSEO jsonLd={...} />`.
- `src/pages/BureauDetail.tsx` — build MedicalClinic/LocalBusiness, pass to `<PageSEO jsonLd={...} />`.

## Out of scope

- PeerCounseling and Organization detail pages (can follow same pattern later if requested).
- og:image generation.
- Validation against Google Rich Results Test (manual step after deploy).
