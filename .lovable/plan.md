## Revised plan — use the existing LanguageToggle, no surprise Indonesian copy

You already have `LanguageContext` (`en` / `id`) + `LanguageToggle` + a `t()` helper, and `<html lang>` flips with the toggle. Most landing-page copy (hero H1, intro paragraph, empty states, "Load More" button, section headings) is currently hardcoded English in the page components, so the toggle doesn't actually translate them yet.

But there's an important SEO catch we have to design around — calling out up front:

> **Googlebot doesn't have your localStorage.** If `en` is the default and `id` only appears after the user clicks the toggle, Google will only ever see the English version. So a pure toggle, by itself, won't move your `psikolog` / `konseling online` rankings. You need at least one of: (a) a separate URL for the Indonesian version, or (b) Indonesian text rendered in the DOM (just not as the visible default).

### What I propose to ship

**1. Wire the toggle to actually translate landing-page copy.**

Move the hardcoded English on `/professional-counseling`, `/peer-counseling`, `/stress-relief`, `/organizations`, `/about` into `t()` keys, and add the matching Indonesian strings in `LanguageContext.tsx`:

- Page H1 + subhead
- "No results found" / "Clear Filters" / "Load More"
- Card labels ("Verified", "Independent", "Book Now", "Learn More" etc. that aren't already through `t()`)
- About-page body

The toggle then does what users expect, and we get a clean Indonesian translation layer for free.

**2. Per-route meta with `react-helmet-async`, language-aware.**

`<Helmet>` reads `language` from `LanguageContext` and emits the matching `<title>` / `<meta description>` / `<html lang>` / `og:locale`. So a user who has `id` saved sees Indonesian metadata when sharing the URL. Each route owns its own canonical (and we drop `<link rel="canonical">` from `index.html` to avoid duplicates).

**3. Fix the static head in `index.html` for Googlebot's first paint.**

Even though the toggle now works, Googlebot sees the default. So `index.html` becomes a **bilingual brand head** that names both languages without confusing English-default users:

- `<title>Mental Health Directory Indonesia — Psikolog, Psikiater & Konseling</title>` (English brand + Indonesian keywords — readable to both)
- Bilingual `<meta description>`: e.g. *"Find licensed psychologists, psychiatrists, and counseling services in Indonesia. Direktori psikolog, psikiater, dan layanan konseling profesional di Indonesia."*
- `<html lang="en">` stays as default; Helmet flips it on toggle
- JSON-LD `Organization` + `WebSite` with Indonesian `alternateName` and a `SearchAction`

This gets Indonesian keywords into Google's index without changing the visible UI for English users.

**4. Sitemap from Supabase.**

`scripts/generate-sitemap.ts` (run via `predev`/`prebuild`) lists the 5 static routes plus every practitioner / bureau / peer-counseling / organization detail page. Add `Sitemap:` line to `public/robots.txt`. Detail pages give Google many indexable URLs that already contain Indonesian clinic names like `Indopsycare`, `Aditi Psycenter`, etc.

### Open question — the only real choice you need to make

How aggressive do you want to be about Indonesian rankings?

- **A. Toggle-only (what's described above).** Minimal, no surprise copy, but Google only ranks you for Indonesian queries through metadata + clinic detail pages. Safe, modest SEO lift.
- **B. Toggle + dedicated Indonesian URLs (`/id/...`).** Clicking the toggle navigates to `/id/professional-counseling`; both URLs index independently with `hreflang` alternates. Google ranks the Indonesian URL for `psikolog terdekat` etc. Bigger SEO lift, slightly more routing work, no surprise copy on the English URL.

A is the safer, faster ship. B is the real Indonesian SEO play. Which one?