## SEO improvements (Indonesian-first)

The project already ships per-route `<Helmet>` with bilingual `seo.*` keys, a generator-driven `sitemap.xml`, `robots.txt`, and `WebSite`/`Organization` JSON-LD. The remaining gaps below would meaningfully lift Indonesian-language search performance.

### 1. Default the static head to Indonesian (high impact)
`index.html` ships `<html lang="en">`, English-first title, English-first description, and `og:locale=en_US`. Social crawlers (LinkedIn/Slack/FB) don't run JS, so this static head is what they cache. Switch the static defaults to Indonesian:
- `<html lang="id">`
- Title: `Direktori Kesehatan Mental Indonesia — Psikolog, Psikiater & Konseling`
- Description: Indonesian-first sentence, with a short English clause after.
- `og:locale` = `id_ID`, `og:locale:alternate` = `en_US`.
- `JSON-LD inLanguage`: `["id-ID", "en"]` (id first).

### 2. Add `<PageSEO>` to the home page
`src/pages/Index.tsx` is the only main route without `<PageSEO>`. Add `<PageSEO pageKey="home" path="/" />` and create `seo.home.title` / `seo.home.description` in the language context (Indonesian + English).

### 3. Add hreflang alternates
In `PageSEO.tsx` emit:
- `<link rel="alternate" hreflang="id" href="…" />`
- `<link rel="alternate" hreflang="en" href="…" />`
- `<link rel="alternate" hreflang="x-default" href="…" />` (point to ID)

Tells Google to surface the Indonesian version to Indonesian users.

### 4. Per-detail-page SEO (practitioner/bureau/peer/org)
Detail pages don't render `<PageSEO>`. Add it with a dynamic `title` / `description` derived from the entity name + city + type, in Indonesian. Example: `"Dr. X — Psikolog di Jakarta | Direktori Kesehatan Mental"`. Without this, every detail URL inherits the static English head.

### 5. Richer JSON-LD per entity
For practitioner detail pages emit `Person` + `MedicalBusiness` (or `Physician`) schema; for bureau/clinic pages emit `MedicalClinic` / `LocalBusiness` with address, telephone, geo if available. Helps Google's medical-vertical ranking and rich results.

### 6. Sitemap polish
`scripts/generate-sitemap.ts` is missing the home `/` entry. Add `{ path: "/", priority: "1.0", changefreq: "weekly" }`. Optional: include `<xhtml:link rel="alternate" hreflang="id|en" />` per URL to mirror the hreflang strategy in #3.

### 7. Optional: og:image
A 1200×630 og:image with the brand name in Indonesian would lift social CTR. I can generate one with the image tool if you want — say the word and I'll do it (otherwise we leave it off, as a missing image previews better than a placeholder).

### Out of scope until you ask
- Writing new Indonesian landing-copy / content marketing.
- Switching to SSR (would be needed if accurate per-route social previews matter beyond Google).
- Backlink/keyword research via Semrush.

### Suggested order if you approve
1, 2, 3, 4, 6 in one pass; 5 next; 7 only on request.