## Goal

The "Book Now" and "Learn More" buttons on services (in the practitioner and bureau detail pages) currently render as `<a href={url} target="_blank">`. When the underlying contact is a phone number, the resulting `tel:` link doesn't work on desktop browsers — same problem we already solved for plain phone contacts with `PhoneCallButton`.

Make these CTAs behave consistently:
- If the link is a `tel:` link → render via `PhoneCallButton` (mobile triggers `tel:`, desktop opens the copy-number dialog).
- Otherwise → keep the existing `<a target="_blank" rel="noopener noreferrer">` behavior (web URLs, mailto, WhatsApp, etc.).

## Changes

1. **`src/components/PractitionerServices.tsx`**
   - Add a small helper `isTelLink(url) = /^tel:/i.test(url)`.
   - For each CTA (`bookingUrl`, `learnMoreUrl`):
     - If `isTelLink(url)`, render a `<PhoneCallButton phone={url.replace(/^tel:/i, '')} variant=... size="sm">Book Now</PhoneCallButton>` (and `variant="outline"` for Learn More), preserving the existing analytics `onClick` (`handleBookingClick` / `handleLearnMoreClick`).
     - Otherwise, keep the current `<Button asChild><a ...></Button>` block unchanged.
   - Import `PhoneCallButton`.

2. **`src/pages/BureauDetail.tsx`** (services list around lines 499–510)
   - Apply the same conditional rendering for `service.bookingUrl` and `service.learnMoreUrl`.
   - Import `PhoneCallButton`.

3. **`src/components/PhoneCallButton.tsx`**
   - Accept an optional `onClick` prop and call it inside `handleClick` (before the mobile/desktop branch) so analytics tracking still fires for both branches. No other behavior change.

No backend, schema, type, or data-fetching changes. The `Service.bookingUrl` / `learnMoreUrl` strings already come through `normalizeLink`, which preserves `tel:` as-is, so detection is a pure string check.

## Out of scope

- No change to non-tel CTAs.
- No change to the plain phone contacts already wired through `PhoneCallButton`.
- No styling changes to the buttons themselves; the `PhoneCallButton` Button branch already supports `variant` and `size` matching the current Book Now / Learn More styles.
