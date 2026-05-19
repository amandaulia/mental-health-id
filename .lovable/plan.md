I scanned the codebase for two issues:

1. **All `t()` keys are defined** in both EN and ID — no missing keys, no orphaned keys. ✅
2. **Hardcoded user-facing strings** that bypass the translation system — found below.

## Hardcoded strings to translate

Excludes admin pages, shadcn `ui/` primitives, and brand names (e.g. logos `alt="Elysium Mental Care"` which should stay as-is).

### Visible text in JSX

| File | Line | String | Suggested key |
|---|---|---|---|
| `src/components/Footer.tsx` | 32 | "Counseling Quick Links" | `footer.counselingQuickLinks` |
| `src/components/Footer.tsx` | 72 | "Activities" | `footer.activities` |
| `src/components/Footer.tsx` | 73 | "Organizations" | `footer.organizations` |
| `src/components/Footer.tsx` | 74 | "Communities" | `footer.communities` |
| `src/pages/Organizations.tsx` | 148 | "Loading..." | use existing `common.loading` |
| `src/pages/PeerCounseling.tsx` | 139 | "Loading..." | use existing `common.loading` |
| `src/pages/StressRelief.tsx` | 133 | "Loading..." | use existing `common.loading` |
| `src/pages/PeerCounselingDetail.tsx` | 248 | "Tags" | `common.tags` |
| `src/pages/PractitionerDetail.tsx` | 352 | "Duration" | `detail.duration` |
| `src/pages/BureauDetail.tsx` | 454 | "Duration" | `detail.duration` |

### Accessibility / placeholder attributes

| File | Line | Attribute | String | Suggested key |
|---|---|---|---|---|
| `src/components/LanguageToggle.tsx` | 19 | JSX text "Toggle language" (sr-only) | | `header.toggleLanguage` |
| `src/components/ScrollToTopButton.tsx` | 27 | `aria-label="Scroll to top"` | | `common.scrollToTop` |

### Likely false positives (recommend leaving as-is)

- `alt="Elysium Mental Care"` / `alt="Mental Wellness Movie Club"` — brand/product names, fine in both languages.
- `src/pages/BureauDetail.tsx` L571 "Remove" and L746 placeholder "Search by name" — these sit inside the admin-only edit panel of that page. Confirm before translating.

## Implementation steps (when you approve)

1. Add the new keys to `src/contexts/LanguageContext.tsx` for both `en` and `id`.
2. Replace each hardcoded literal listed above with `t("...")`.
3. Reuse the existing `common.loading` key for the three "Loading..." cases instead of creating new ones.

Total: ~12 strings to wrap, all in presentation code only.
