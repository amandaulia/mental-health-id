## Goal
Add all approved EN/ID translations from the spreadsheet to `LanguageContext.tsx`, then wire them into the corresponding components/pages so the language toggle controls every remaining hardcoded string.

## Step 1 — Add new translation blocks to `src/contexts/LanguageContext.tsx`

Add these blocks (mirrored under `en` and `id`) using the spreadsheet values verbatim:

- `home`: `hero.{title1,title2,subtitle}`, `feelings.{title,cta,analyzing,recommendationsTitle}`, `toast.{shareFeelings,recommendationsReady,analysisFailed}`, `sections.{professional,peer,stressRelief,organizations}`, `comingSoon`, `fallback.{unknownCity,addressUnavailable}`
- `about`: `hero.{title1,title2,subtitle}`, `what.{title,p1,p2}`, `info.{title,professional.{title,desc},peer.{title,desc},stressRelief.{title,desc},organizations.{title,desc}}`, `contribute.{title,intro,professionals.{title,desc},organizations.{title,desc},community.{title,desc}}`, `contact.{title,email,phone,followInstagram,instagramDesc}`
- `peerDetail`: `notFound`, `notFoundDesc`, `about`, `specialization`, `additionalInfo`, `schedule`, `groupSize`, `facilitator`, `languages`, `contactInfo`, `address`, `phone`, `email`, `website`, `instagram`, `getSupport`, `followDesc`
- `organizationDetail`: `notFound`, `notFoundDesc`, `about`, `organizationType`, `contactInfo`, `address`, `phone`, `email`, `website`, `instagram`, `getInTouch`, `followDesc`
- `organizations`: `browse`, `all`
- `peerCounseling`: `findPeerSupport`
- `stressRelief`: `findActivities`, `noActivities`
- `notFound`: `title`, `return`
- `footer`: `description`, `copyright`
- `phoneDialog`: `title`, `description`, `copy`, `copied`, `copiedToast`, `copyFailed`
- `common`: `callNow`, `openInGoogleMaps`, `clickOpenGoogleMaps`, `priceNotAvailable`, `verified`, `free`, `viewAll`, `goBack`, `visitWebsite`

(If `common.verified` / `detail.free` already exist they will be left as-is; the new `common.*` aliases are added per the sheet.)

## Step 2 — Wire the new keys into components/pages

For each file: import `useLanguage`, call `const { t } = useLanguage()`, and replace the hardcoded strings listed below with the matching keys. JSX containing inline `<span>` segments (hero gradient, "About Mental Health Directory") will use two `t()` calls separated by a space.

- `src/pages/Index.tsx` — hero title/subtitle, feelings prompt + CTA + analyzing state + recommendations heading, three toast messages, four section headings, "Coming Soon" badges, unknown-city / address fallbacks.
- `src/pages/About.tsx` — entire page text (hero, all section titles/cards, contribute cards, contact details labels).
- `src/pages/PeerCounselingDetail.tsx` — not-found state, all card titles, all field labels, follow description.
- `src/pages/OrganizationDetail.tsx` — same pattern as PeerCounselingDetail.
- `src/pages/Organizations.tsx` — "Browse..." and "All ..." headings.
- `src/pages/PeerCounseling.tsx` — "Find Peer Support" heading.
- `src/pages/StressRelief.tsx` — "Find Activities" heading and "No activities found..." empty state.
- `src/pages/NotFound.tsx` — "Oops! Page not found" + "Return to Home" (404 numeral kept).
- `src/components/Footer.tsx` — description paragraph and copyright line.
- `src/components/PhoneCallButton.tsx` — Dialog title/description, Copy/Copied button labels, both toast messages, default "Call Now" button label.
- `src/components/BureauLocations.tsx` — "Open in Google Maps" button label.
- `src/components/PractitionerLocations.tsx` — "Click to open in Google Maps" overlay label.
- `src/components/PractitionerCard.tsx` — "Price not available" → `common.priceNotAvailable`; "Verified" → `common.verified`; insurance literals → existing `insurance.*` keys.
- `src/components/BureauCard.tsx` — "Verified" → `common.verified`; insurance literals → existing `insurance.*` keys. (Institution-type fallbacks `"Independent Bureau"` / `"Clinic"` are not in the sheet — leave as-is.)
- `src/components/UnifiedCard.tsx` — "Free" → `common.free` (or existing `detail.free`); insurance literals → `insurance.*`. The `"Unknown City"` comparison sentinel is kept untranslated.

## Out of scope

- No DB / data-layer changes; insurance value normalization in `dataTransform.ts` stays as-is.
- Brand/proper nouns not in the sheet (`BPJS`, `Elysium Mental Care` alt text, `@mentalwellnessmovieclub`, `WhatsApp`, `Instagram` social labels, `Rp`, `404`) remain untranslated.
- `BureauCard` institution-type fallbacks (`"Independent Bureau"`, `"Clinic"`) remain English until a translation is provided.

## Verification

- Toggle language on `/`, `/about`, `/professional-counseling`, a bureau detail, a practitioner detail, a peer-counseling detail, an organization detail, `/organizations`, `/peer-counseling`, `/stress-relief`, and `/anything-404`.
- Open the desktop phone-call dialog and confirm dialog/buttons/toasts are translated.
- Confirm both Bureau and Practitioner location cards show the translated Google Maps CTA.
