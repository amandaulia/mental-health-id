## Problem

On `/peer-counseling/:id`, the contact card shows the literal string `detail.type` instead of "Type".

In `src/pages/PeerCounselingDetail.tsx` line 132:
```tsx
<p className="font-medium text-sm">{t("detail.type") || "Type"}</p>
```

The `t()` helper returns the key itself when a translation is missing. `"detail.type"` is a truthy string, so the `|| "Type"` fallback never runs.

The `detail` block in `src/contexts/LanguageContext.tsx` (EN at line 297, ID at line 708) has no `type` entry.

## Fix

Add a `type` key in both language blocks of `src/contexts/LanguageContext.tsx`:

- EN `detail`: `type: "Type"`
- ID `detail`: `type: "Tipe"`

That's the entire change — no component edits needed.
