## Why "Unknown Bureau" appears

The detail page (`/practitioner/:id`) calls `usePractitioner(id)` → `databaseService.getPractitioner(id)`, which only does:

```ts
supabase.from("practitioner").select("*").eq("id", id).single()
```

No join to `practitioner_institutions`/`institution`. `transformPractitioner` then reads `dbPractitioner.institution`, doesn't find it, and falls back to the hardcoded `"Unknown Bureau"` (and `bureauId: "1"`).

The listing page works because it uses `usePractitionersWithRelations`, which does join those tables — that's why the same fix we applied to `ProfessionalCounseling.tsx` made the cards correct.

## Fix

1. **`src/services/database.ts` — `getPractitioner`**
   Change the query to also fetch the linked institution:
   ```ts
   .select(`
     *,
     practitioner_institutions(
       institution(*)
     )
   `)
   ```

2. **`src/utils/dataTransform.ts` — `transformPractitioner`**
   Resolve the institution from the joined relation:
   ```ts
   const institution = dbPractitioner.institution
     ?? dbPractitioner.practitioner_institutions?.[0]?.institution;
   ```
   And populate `bureauId` from it so the "Visit Bureau" link works:
   ```ts
   bureauId: institution?.id ? institution.id.toString() : "",
   ```
   Keep the `"Unknown Bureau"` fallback only for true independents (or change to `"Independent"` to match the listing — please confirm which you prefer).

No schema or RLS changes needed. No other call sites of `transformPractitioner` are affected (the listing builds its own object and doesn't go through this path).

## Open question

On the detail page, should solo practitioners (no `practitioner_institutions` row) show **"Independent"** (matches the listing card) or just hide the bureau line entirely? Default in this plan: show **"Independent"**.