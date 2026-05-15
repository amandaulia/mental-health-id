## Goal
Replace the icon-only session mode row on resource cards with the rounded pill style used in the details page filter popover.

## Change
In `src/components/UnifiedCard.tsx` (lines ~241-249), replace the `<ModeIcon />` loop with rounded pill chips matching the details page style:

```tsx
{data.modes && data.modes.length > 0 && (
  <div className="flex flex-wrap gap-2">
    {data.modes.slice(0, 4).map((mode) => (
      <span
        key={mode}
        className="px-3 py-1 rounded-full border border-border bg-background text-xs text-foreground whitespace-nowrap"
      >
        {getModeLabel(t, mode)}
      </span>
    ))}
  </div>
)}
```

- Drop the `ModeIcon` import (if no longer used elsewhere in the file).
- Use the existing label helper from `src/utils/labels.ts` (or add a small local `getModeLabel` mirroring `PractitionerDetail.getModeLabel`) so chips show "Online", "In-Person", "Phone", "Chat" instead of the raw enum.
- Use semantic tokens (`border-border`, `bg-background`, `text-foreground`) — no hardcoded purple, since cards appear across many sections.

## Out of scope
- Details pages stay as-is.
- No changes to filter logic or data shape.