## Changes

**1. Re-enable feature flags** (`src/config/features.ts`)
Set `peerCounseling`, `stressRelief`, and `organizations` all to `true`. This re-shows the Peer Counseling, Stress Relief, and Organizations links in the desktop and mobile navigation in `Header.tsx` (already wired behind these flags), and also re-enables their preview sections inside `Index.tsx`.

**2. Restore the directory home page** (`src/App.tsx`)
Replace the current redirect:
```
<Route path="/" element={<Navigate to="/professional-counseling" replace />} />
```
with:
```
<Route path="/" element={<Index />} />
```
so visiting `/` renders the full Mental Health Resource Directory landing (`src/pages/Index.tsx`), which already aggregates Professional Counseling, Peer Counseling, Stress Relief, and Organizations previews.

## Out of scope
- No content, copy, or styling changes.
- No changes to the individual section pages or routes.
- The "Home" link in the header already points to `/`, so it will now correctly land on the directory.
