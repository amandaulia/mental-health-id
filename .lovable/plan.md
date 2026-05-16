## Changes to `src/pages/About.tsx` — Contact Details section

**1. Reorganize the two-column layout**
- **Right column** (was left): Email card + Phone card stacked on top, followed by the Instagram block below them.
- **Left column** (new): Embedded JotForm "Contact & Inquiry Form".

**2. Embed JotForm**
- Add a React `useEffect` that injects the JotForm embed handler script (`https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js`) once on mount, then calls `window.jotformEmbedHandler(...)`.
- Render the iframe:
  - `id="JotFormIFrame-261353904089057"`
  - `title="Contact & Inquiry Form"`
  - `src="https://form.jotform.com/261353904089057"`
  - `allow="geolocation; microphone; camera; fullscreen; payment"`
  - `style={{ minWidth: '100%', maxWidth: '100%', height: '539px', border: 'none' }}`
  - `scrolling="no"`, `frameBorder="0"`, `allowTransparency`
- Wrap in a card/container consistent with existing `bg-muted/50 rounded-lg` styling, with a small heading (e.g., "Send us a message").

**3. No other sections changed.** Existing translations and styling tokens remain.

### Technical notes
- Declare `jotformEmbedHandler` on `window` via a small `declare global` to satisfy TS.
- Guard against double-injecting the script (check by id before appending).
