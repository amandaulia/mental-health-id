Add an optional `hiddenFilters?: Array<"sessionMode" | "priceRange" | "insurance" | ...>` prop to `SearchAndFilters`. Wrap the Session Mode, Price Range, and Insurance filter sections (both desktop and mobile panels) with a conditional that skips rendering when included in `hiddenFilters`.

Pass `hiddenFilters={["sessionMode", "priceRange", "insurance"]}` from `Organizations.tsx`. No state/logic changes — filters remain in `FilterState` but stay at their defaults for Organizations, so they don't affect filtering.
