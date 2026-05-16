## Goal
Make the Jotform feedback popup (the panel that opens when the button is clicked) feel like part of the Mental Health Directory, matching the same warm/rounded/soft-shadow aesthetic as the rest of the site.

## What we can and cannot style
The popup is a Jotform-injected wrapper (`div` + close button) containing a cross-origin `<iframe>` served from `form.jotform.com`. Because of browser cross-origin rules:
- We CAN style the **popup chrome** from our `index.html`: outer container, border-radius, drop shadow, backdrop/overlay, close ("×") button, entrance animation, and the iframe's outer frame (border, radius via `overflow:hidden` on the wrapper).
- We CANNOT restyle the **form content inside the iframe** (fields, labels, submit button) from our code. Those must be changed inside Jotform's own form designer (Form Builder → Form Designer) on the Jotform account that owns form `261353904089057`.

This plan covers everything we can do from the site. I'll also note the small set of in-Jotform tweaks the user can apply later for full consistency.

## Plan

1. **Extend the `<style>` block in `index.html`** with selectors for the Jotform popup wrapper. Jotform renders the popup as a fixed container (commonly `.lightbox-wrapper`, `#lightbox-NNN`, `.lightbox-container`, with the iframe inside). I'll target these defensively with attribute/class selectors so a Jotform update is less likely to break the styling:
   - Outer wrapper / overlay: subtle warm-tinted backdrop (`background: hsla(25, 30%, 15%, 0.45)`) with `backdrop-filter: blur(4px)`.
   - Popup container: `border-radius: 16px`, `overflow: hidden`, `box-shadow: 0 20px 60px -20px hsla(15, 50%, 30%, 0.45)`, white card background so the iframe's edges blend in.
   - Iframe: `border: 0`, inherit container radius.
   - Close button (`a.lightbox-close`, `.lightbox-close-button`, `button[class*="close"]`): restyle to a circular button with the site's primary coral on hover, white "×" glyph, soft shadow; positioned just inside the top-right corner.
   - Entrance animation: fade + small scale-up (`@keyframes lovable-popup-in`) applied to the container; respect `prefers-reduced-motion`.

2. **Set a max width/height** on the popup wrapper so it sits nicely on mobile (`max-width: calc(100vw - 24px)`, `max-height: calc(100vh - 48px)`). Keep current `width: 700, height: 500` from the init call.

3. **Verify in preview** that:
   - Clicking the Feedback button opens the popup with rounded corners, soft shadow, warm-tinted overlay.
   - The close button is visible, sits inside the corner, and matches the site palette.
   - On mobile widths the popup scales down and stays readable.
   - The button itself (already restyled last turn) still looks correct.

4. **Note for the user (no code change here)** — to match the form fields/submit button inside the iframe (which we cannot reach from CSS), open the form in Jotform → Form Designer and set:
   - Heading font: same family as our site, color `hsl(25 30% 15%)`.
   - Submit button: background `#EE5B2B` (our `--primary`), white text, radius 12px.
   - Page background: `#FAF8F3` (matches our `--background`).
   - Input border radius: 8–12px.
   I'll surface this as a short note in the final reply, not in code.

## Technical notes
- All edits live in the existing `<style>` block in `index.html`. We use broad attribute selectors (`[id^="lightbox-"]`, `[class*="lightbox"]`) plus `!important` to beat Jotform's inline styles.
- No JS changes; the Jotform init call stays as-is.
- No impact on React/Tailwind code.

## Files to change
- `index.html` — extend the existing `<style>` block.
