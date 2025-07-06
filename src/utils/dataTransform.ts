
import { Database } from "@/integrations/supabase/types";
import { Practitioner, Bureau, Service } from "@/types";

type DBPractitioner = Database['public']['Tables']['practitioner']['Row'] & {
  institution?: Database['public']['Tables']['institution']['Row'] & {
    location?: Database['public']['Tables']['location']['Row'];
  };
};

type DBInstitution = Database['public']['Tables']['institution']['Row'] & {
  location?: Database['public']['Tables']['location']['Row'];
};

type DBService = Database['public']['Tables']['services']['Row'];

export const transformPractitioner = (dbPractitioner: DBPractitioner): Practitioner => {
  const institution = dbPractitioner.institution;
  const location = institution?.location;

  return {
    id: dbPractitioner.id.toString(),
    type: "practitioner",
    image: "/placeholder.svg", // Default placeholder, can be updated later
    name: dbPractitioner.name,
    bureauName: institution?.name || "Unknown Bureau",
    bureauId: dbPractitioner.institution_id?.toString() || "",
    professionTypes: dbPractitioner.profession_type as any[] || [],
    licenseNumber: dbPractitioner.license_number || "N/A",
    specializations: dbPractitioner.specialization as any[] || [],
    experience: dbPractitioner.experience?.toString() || "Not specified",
    education: Array.isArray(dbPractitioner.education) ? dbPractitioner.education.join(", ") : "Not specified",
    city: location?.city || "Unknown City",
    location: {
      address: location?.address || "Address not available",
      lat: 0, // Will need to be added to location table later
      lng: 0, // Will need to be added to location table later
    },
    services: [], // Will be populated separately via services query
    modes: dbPractitioner.session_mode as any[] || [],
    phoneNumber: "N/A", // Will get from contact_details
    website: undefined,
    instagram: undefined,
    insurance: dbPractitioner.insurance as any[] || [],
    isVerified: false, // Can be added to schema later
    lastUpdated: dbPractitioner.last_updated_at,
    priceRange: {
      min: 0, // Will be calculated from services
      max: 0, // Will be calculated from services
    },
  };
};

export const transformInstitution = (dbInstitution: DBInstitution): Bureau => {
  const location = dbInstitution.location;

  return {
    id: dbInstitution.id.toString(),
    type: "bureau",
    name: dbInstitution.name,
    businessHours: "Not specified", // Can be added to schema later
    bureauType: mapInstitutionType(dbInstitution.type),
    professionTypes: dbInstitution.profession_type as any[] || [],
    city: location?.city || "Unknown City",
    location: {
      address: location?.address || "Address not available",
      lat: 0, // Will need to be added to location table later
      lng: 0, // Will need to be added to location table later
    },
    insurance: dbInstitution.insurance as any[] || [],
    isVerified: dbInstitution.verified,
    lastUpdated: dbInstitution.last_updated_at,
  };
};

export const transformService = (dbService: DBService): Service => {
  return {
    name: dbService.name,
    duration: dbService.duration ? `${dbService.duration} minutes` : "Duration not specified",
    minPrice: dbService.price || 0,
    maxPrice: dbService.price || 0, // For now, using same price for min/max
    mode: mapSessionMode(dbService.session_mode?.[0] || "OFFLINE"),
    bookingUrl: dbService.book_cta || undefined,
    learnMoreUrl: dbService.learn_more_cta || undefined,
  };
};

// Helper functions to map database enums to frontend types
const mapInstitutionType = (dbType: string) => {
  switch (dbType) {
    case "PRIVATE":
      return "independent";
    case "CLINIC":
      return "clinic";
    case "HOSPITAL":
      return "faskes2";
    default:
      return "independent";
  }
};

const mapSessionMode = (dbMode: string) => {
  switch (dbMode) {
    case "TEXT":
      return "text";
    case "VOICE":
      return "voice";
    case "VIDEO":
      return "video";
    case "OFFLINE":
      return "offline";
    default:
      return "offline";
  }
};

export const calculatePriceRange = (services: Service[]) => {
  if (services.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = services.flatMap(service => [service.minPrice, service.maxPrice]);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};
