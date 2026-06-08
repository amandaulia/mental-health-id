import { FilterState } from "@/types";

const norm = (v: any) => (v == null ? "" : String(v).toLowerCase());

const mapSessionMode = (raw: string): string => {
  const m = norm(raw).replace(/\s/g, "_");
  switch (m) {
    case "chat": return "text";
    case "voice_call": return "voice";
    case "video_call": return "video";
    case "offline": return "offline";
    case "online": return "video";
    default: return m;
  }
};

const mapInsurance = (raw: string): string => {
  const m = norm(raw);
  if (m === "bpjs") return "bpjs";
  if (m === "private insurance" || m === "private") return "private";
  return "none";
};

const cityMatchesLocations = (city: string, locations: string[]) => {
  if (!locations.length) return true;
  const c = norm(city);
  return locations.some(l => norm(l).split(",")[0].trim() && c.includes(norm(l).split(",")[0].trim()));
};

export const matchProfessional = (resource: any, filters: FilterState): boolean => {
  if (filters.search) {
    const s = filters.search.toLowerCase();
    const hay = [
      resource.name,
      resource.type === "practitioner" ? resource.bureauName : "",
      resource.city,
      ...(resource.specializations || []),
      ...(resource.professionTypes || []),
    ].map(norm).join(" ");
    if (!hay.includes(s)) return false;
  }

  if (!cityMatchesLocations(resource.city, filters.locations)) return false;

  if (filters.institutions.length > 0) {
    const name = resource.type === "practitioner" ? resource.bureauName : resource.name;
    if (!filters.institutions.some(i => norm(name) === norm(i))) return false;
  }

  if (filters.institutionTypes.length > 0) {
    if (filters.includePractitionersForInstitutionType === false && resource.type !== "bureau") return false;
    if (!filters.institutionTypes.includes(resource.bureauType)) return false;
  }

  if (filters.professionTypes.length > 0) {
    if (filters.includeInstitutionsForProfessionType === false && resource.type === "bureau") return false;
    if (!(resource.professionTypes || []).some((p: string) => filters.professionTypes.includes(p as any))) return false;
  }

  if (filters.specializations.length > 0) {
    if (!(resource.specializations || []).some((sp: string) => filters.specializations.includes(sp as any))) return false;
  }

  if (filters.modes.length > 0) {
    if (!(resource.modes || []).some((m: string) => filters.modes.includes(m as any))) return false;
  }

  if (filters.insurance.length > 0) {
    const ins = (resource.insurance || []).map(norm);
    if (!filters.insurance.some(i => ins.includes(norm(i)))) return false;
  }

  if (filters.priceRange && resource.services?.length) {
    const [min, max] = filters.priceRange;
    const prices = resource.services.map((s: any) => s.price).filter((p: any) => p != null);
    if (prices.length > 0) {
      const inRange = prices.some((p: number) => p >= min && p <= max);
      if (!inRange && !(filters.includeNullPrice && prices.length === 0)) return false;
    }
  }

  return true;
};

const getLocationCities = (item: any, key: string): string[] => {
  return (item?.[key] || [])
    .map((row: any) => row?.location?.city)
    .filter(Boolean);
};

export const matchPeer = (item: any, filters: FilterState): boolean => {
  const cities = getLocationCities(item, "peer_counseling_locations");
  const peerTypes: string[] = item.peer_type || [];
  const specs: string[] = item.specialization || [];

  if (filters.search) {
    const s = filters.search.toLowerCase();
    const hay = [item.name, ...cities, ...specs, ...peerTypes, ...(item.tags || [])]
      .map(norm).join(" ");
    if (!hay.includes(s)) return false;
  }

  if (filters.locations.length > 0) {
    if (!cities.some(c => cityMatchesLocations(c, filters.locations))) return false;
  }

  if (filters.specializations.length > 0) {
    if (!specs.some(sp => filters.specializations.includes(sp as any))) return false;
  }

  // Peer counseling has peer_type (online/offline) — map to modes
  if (filters.modes.length > 0) {
    const mapped = peerTypes.map(mapSessionMode);
    if (!filters.modes.some(m => mapped.includes(m))) return false;
  }

  return true;
};

export const matchActivity = (item: any, filters: FilterState): boolean => {
  const cities = getLocationCities(item, "activity_locations");
  const orgName: string = item.activity_organizations?.[0]?.organization?.name || "";
  const specs: string[] = item.specialization || [];
  const activityTypes: string[] = item.activity_type || [];
  const sessionModes: string[] = (item.session_mode || []).map(mapSessionMode);

  if (filters.search) {
    const s = filters.search.toLowerCase();
    const hay = [item.name, orgName, ...cities, ...specs, ...activityTypes].map(norm).join(" ");
    if (!hay.includes(s)) return false;
  }

  if (filters.locations.length > 0) {
    if (!cities.some(c => cityMatchesLocations(c, filters.locations))) return false;
  }

  if (filters.specializations.length > 0) {
    if (!specs.some(sp => filters.specializations.includes(sp as any))) return false;
  }

  if (filters.modes.length > 0 && sessionModes.length > 0) {
    if (!filters.modes.some(m => sessionModes.includes(m))) return false;
  }

  if (filters.priceRange && item.price != null) {
    const [min, max] = filters.priceRange;
    const price = typeof item.price === "string" ? parseInt(item.price) : item.price;
    if (!isNaN(price) && (price < min || price > max)) return false;
  }

  return true;
};

export const matchOrganization = (item: any, filters: FilterState): boolean => {
  const cities = getLocationCities(item, "organization_locations");
  const specs: string[] = item.specialization || [];

  if (filters.search) {
    const s = filters.search.toLowerCase();
    const hay = [item.name, ...cities, ...specs, item.description || ""].map(norm).join(" ");
    if (!hay.includes(s)) return false;
  }

  if (filters.locations.length > 0) {
    if (!cities.some(c => cityMatchesLocations(c, filters.locations))) return false;
  }

  if (filters.specializations.length > 0) {
    if (!specs.some(sp => filters.specializations.includes(sp as any))) return false;
  }

  return true;
};
