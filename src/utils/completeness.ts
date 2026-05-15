// Generic "information completeness" score used to sort cards so that
// the most complete entries surface first across all listings.
const isFilled = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return Boolean(value);
};

const FIELDS = [
  "image",
  "name",
  "city",
  "description",
  "specialization",
  "specializations",
  "professionTypes",
  "profession_type",
  "insurance",
  "modes",
  "session_mode",
  "priceRange",
  "price",
  "education",
  "experience",
  "license_number",
  "verified",
  "isVerified",
  "institutionName",
  "bureauName",
  "organizationName",
  "activityType",
  "activity_type",
  "organizationType",
  "serviceType",
  "peer_type",
  "tags",
  "activity_locations",
  "activity_organizations",
  "organization_locations",
  "institution_locations",
  "practitioner_locations",
  "peer_counseling_locations",
  "services",
  "contacts",
  "locations",
];

export const completenessScore = (item: any): number => {
  if (!item || typeof item !== "object") return 0;
  let score = 0;
  for (const field of FIELDS) {
    if (isFilled(item[field])) score += 1;
  }
  return score;
};

export function sortByCompleteness<T>(items: T[]): T[] {
  return [...items].sort((a, b) => completenessScore(b) - completenessScore(a));
}
