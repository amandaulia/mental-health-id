## SEO Boost — Phase 1

Three focused improvements: run the built-in SEO scan, add structured data to the two detail pages that are missing it (plus breadcrumbs everywhere), and fix the hreflang duplication.

### 1. Run the SEO scan

Trigger the built-in SEO reviewer against the live site. It returns concrete findings (missing alts, heading hierarchy, meta length, etc.) that we can then triage in a follow-up pass. Requires your one-tap approval when it runs.

### 2. Add JSON-LD to missing detail pages + BreadcrumbList everywhere

Current state:
- `PractitionerDetail` — has `Person` + business JSON-LD ✓
- `BureauDetail` — has `MedicalBusiness`/`LocalBusiness` JSON-LD ✓
- `PeerCounselingDetail` — no JSON-LD ✗
- `OrganizationDetail` — no JSON-LD ✗
- None of the detail pages emit `BreadcrumbList` (even though they render visual breadcrumbs)

Changes:

**`src/pages/PeerCounselingDetail.tsx`** — add a `Service` / `MedicalBusiness` node (name, description, areaServed = city, address from primary location, telephone/sameAs from contacts) and pass it to `PageSEO` via `jsonLd={[serviceNode, breadcrumbNode]}`.

**`src/pages/OrganizationDetail.tsx`** — add an `Organization` / `NGO` node (name, description, address, telephone, sameAs, knowsAbout = specializations) and pass to `PageSEO`.

**Breadcrumb JSON-LD (all 4 detail pages)** — emit a `BreadcrumbList` node matching the visible breadcrumbs (e.g. Home › Professional Counseling › {Name}). Add a small `buildBreadcrumbList(items)` helper to `src/utils/jsonLd.ts` and reuse it from all four pages. `PageSEO` already accepts `jsonLd` as an array → auto-wraps in `@graph`.

### 3. Fix hreflang duplication

`src/components/PageSEO.tsx` currently emits:
```
<link rel="alternate" hrefLang="id" href={url} />
<link rel="alternate" hrefLang="en" href={url} />
<link rel="alternate" hrefLang="x-default" href={url} />
```
Both lang variants point at the same URL, which Google treats as a misconfiguration (and the language is actually controlled by a client-side toggle, not the URL). Until we have real `/id` / `/en` URL prefixes, the correct signal is:
- Set `<html lang>` to the active language (already done) ✓
- Drop the `hreflang="id"` and `hreflang="en"` alternates
- Keep `<link rel="alternate" hreflang="x-default">` pointing at the canonical

This removes the duplicate-URL warning without overclaiming bilingual URLs.

### Out of scope (saved for follow-ups)

- Image `alt`/`loading=lazy`/dimensions audit
- Internal linking (related practitioners on detail pages)
- Per-language URL prefixes (requires routing changes)
- Keyword research with Semrush (separate exploration)
- Articles / blog content section
- Core Web Vitals performance audit

### Technical notes

- `PageSEO` already supports `jsonLd: Record<string, unknown> | Record<string, unknown>[]` and wraps arrays in `@graph` — no change needed there.
- Reuse existing helpers in `src/utils/jsonLd.ts` (`buildPostalAddress`, `phoneFromContacts`, `sameAsFromContacts`) plus a new `buildBreadcrumbList(items: {name, path}[])` helper.
- No DB, routing, or business-logic changes. All edits are presentation/head-only.

**Files touched:**
- `src/utils/jsonLd.ts` (add breadcrumb helper)
- `src/components/PageSEO.tsx` (hreflang cleanup)
- `src/pages/PeerCounselingDetail.tsx` (add JSON-LD)
- `src/pages/OrganizationDetail.tsx` (add JSON-LD)
- `src/pages/PractitionerDetail.tsx` (add breadcrumb node)
- `src/pages/BureauDetail.tsx` (add breadcrumb node)
