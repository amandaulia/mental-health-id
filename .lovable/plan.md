## Findings — filter scope

Re-verified `src/pages/Index.tsx`. Each section filters across the full dataset before slicing to the top 6:

- Professional: `allProfessionalResources.filter(matchProfessional) → sortByCompleteness → .slice(0, 6)`
- Clinics: `allBureaus.filter(matchProfessional) → sortByCompleteness → .slice(0, 6)`
- Peer Counseling: `dbPeerCounseling.filter(matchPeer) → sortByCompleteness → .slice(0, 6)`
- Activities: `dbActivities.filter(matchActivity) → sortByCompleteness → .slice(0, 6)`
- Organizations: `dbOrganizations.filter(matchOrganization) → sortByCompleteness → .slice(0, 6)`

So a card that doesn't appear in the default top 6 will surface once a search/filter narrows the set — the preview stays filled with up to 6 matching results pulled from anywhere in the dataset. No code change needed here; I'll just confirm in the response.

## Change — search placeholder

`SearchAndFilters` already accepts an optional `searchPlaceholder` prop. `Index.tsx` doesn't pass one, so it falls back to `t('search.placeholder')`.

Update `Index.tsx` to pass `searchPlaceholder={t('search.allResources') || 'Search all resources'}` and add the translation key `search.allResources` to both English ("Search all resources") and Indonesian ("Cari semua sumber") sections of `src/contexts/LanguageContext.tsx`.

That's the entire change.
