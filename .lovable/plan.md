## Goal
Restyle the Jotform "Feedback" button so it visually matches the Mental Health Directory design system instead of the default lavender (#ceb0dc) look.

## Current state
In `index.html`, the Jotform widget is initialized with:
- `background: "#ceb0dc"` (lavender, off-brand)
- `fontColor: "#FFFFFF"`
- `buttonSide: "left"`, `buttonAlign: "center"`
- Default Jotform pill button styling (font, padding, radius)

The site's brand uses a warm coral/orange primary (`--primary: 15 85% 55%`) with a primary→lavender gradient (`--gradient-primary`), rounded corners (`--radius: 0.75rem`), and a warm shadow.

## Plan

1. **Update Jotform init options** in `index.html`:
   - `background: "#EE5B2B"` (matches `--primary` warm coral)
   - `fontColor: "#FFFFFF"` (keep)
   - Keep `buttonSide: "left"`, `buttonAlign: "center"`

2. **Inject a small CSS override** in `index.html` `<head>` targeting the Jotform-injected button (`.feedback-link`, `a.btnX`, or the generated anchor) to align with the design system:
   - Font family: inherit from site (Inter / system stack used by Tailwind)
   - Font weight: 500, letter-spacing tightened slightly
   - Border-radius: `0.75rem 0.75rem 0 0` on the left-side vertical tab so corners match `--radius`
   - Background: use the brand gradient (`linear-gradient(135deg, hsl(275 45% 79%), hsl(15 85% 55%))`) instead of flat lavender, with `!important` to beat Jotform inline styles
   - Box-shadow: `0 4px 20px -4px hsl(15 50% 70% / 0.4)` (matches `--shadow-warm`)
   - Padding bumped to feel consistent with site buttons
   - Hover: slight scale + shadow lift, smooth `transition`

3. **Verify** in the preview that:
   - Button still opens the feedback iframe
   - Colors/shape match the site's primary buttons
   - It remains readable on the warm background and doesn't clash with the header

## Technical notes
Jotform's feedback button is rendered as an `<a>` injected into `<body>` with an inline `background-color` style and a class like `feedback-link`. The CSS override must use `!important` on `background` and `border-radius` to win against those inline styles. No app-level React/Tailwind changes are needed — all edits stay in `index.html`.

## Files to change
- `index.html` — update Jotform options + add a small `<style>` block scoped to the feedback button.
