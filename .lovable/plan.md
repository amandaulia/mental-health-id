## Issue

The "Professional Counseling" preview on the homepage currently iterates `filteredProfessionalResources`, which is `[...allPractitioners, ...allBureaus]`. That's why institutions sneak into the top 6. The Clinics & Hospitals section already covers bureaus separately via `filteredClinics`.

## Fix

In `src/pages/Index.tsx`:

1. Add a new memo `filteredPractitioners` that runs `matchProfessional` over `allPractitioners` only (then `sortByCompleteness`).
2. Replace the data source of the Professional Counseling section's `.map(...)` from `filteredProfessionalResources.slice(0, 6)` to `filteredPractitioners.slice(0, 6)`. The branching inside the map (practitioner vs institution card) becomes unnecessary — collapse it to the practitioner card shape.
3. Update the empty-state check below that section to use `filteredPractitioners.length === 0`.
4. Update the `useEffect` that tracks search totals to use `filteredPractitioners` + `filteredClinics` + peer + activities + organizations so the analytics count reflects what's actually rendered.

No changes needed to filter logic, options, or other sections.
