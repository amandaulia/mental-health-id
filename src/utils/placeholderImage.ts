import clinicPlaceholder from "@/assets/clinic-placeholder.png";

const BASE = "https://vvvsefzarzfisxrpfygw.supabase.co/storage/v1/object/public/placeholders";

const PLACEHOLDERS = {
  institution: `${BASE}/Health%20Institutions.png`,
  practitioner: `${BASE}/Practitioners.png`,
  "support-group": `${BASE}/Support%20Group.png`,
  "peer-counseling": `${BASE}/Peer%20Counseling.png`,
  organization: `${BASE}/Organizations.png`,
} as const;

export type PlaceholderCategory = keyof typeof PLACEHOLDERS;

// Priority order when an entity could resolve to multiple categories.
const PRIORITY: PlaceholderCategory[] = [
  "institution",
  "practitioner",
  "support-group",
  "peer-counseling",
  "organization",
];

export function getPlaceholderImage(
  category: PlaceholderCategory | string | Array<PlaceholderCategory | string> | undefined,
): string {
  if (!category) return clinicPlaceholder;
  const list = Array.isArray(category) ? category : [category];
  for (const key of PRIORITY) {
    if (list.includes(key)) return PLACEHOLDERS[key];
  }
  return clinicPlaceholder;
}