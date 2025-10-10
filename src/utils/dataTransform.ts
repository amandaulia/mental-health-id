import { Database } from "@/integrations/supabase/types";
import { Practitioner, Bureau, Service, ContactDetails, ProfessionType, Specialization, InsuranceType, BureauType } from "@/types";

type DBPractitioner = Database['public']['Tables']['practitioner']['Row'] & {
  institution?: Database['public']['Tables']['institution']['Row'];
};

type DBInstitution = Database['public']['Tables']['institution']['Row'];

type DBService = Database['public']['Tables']['service']['Row'] & {
  institution?: { name: string };
};

type DBContactDetail = Database['public']['Tables']['contact_details']['Row'];

export const transformPractitioner = (
  dbPractitioner: any, 
  services: Service[] = [], 
  contactDetails: ContactDetails = []
): Practitioner => {
  const institution = dbPractitioner.institution;
  
  // Combine practitioner and institution insurance
  const practitionerInsurance = dbPractitioner.insurance || [];
  const institutionInsurance = institution?.insurance || [];
  const combinedInsurance = [...new Set([...practitionerInsurance, ...institutionInsurance])];

  return {
    id: dbPractitioner.id.toString(),
    type: "practitioner",
    image: "/placeholder.svg",
    name: dbPractitioner.name,
    bureauName: institution?.name || "Unknown Bureau",
    bureauId: "1", // Will be set from institution relationship
    professionTypes: mapProfessionTypes(dbPractitioner.profession_type || []),
    licenseNumber: dbPractitioner.license_number,
    specializations: mapSpecializations(dbPractitioner.specialization || []),
    experience: dbPractitioner.experience ? `${dbPractitioner.experience} years` : undefined,
    education: Array.isArray(dbPractitioner.education) ? dbPractitioner.education.join(", ") : undefined,
    city: "Unknown City", // Will be set from location data separately
    location: {
      address: "Address not available", // Will be set from location data separately
      lat: 0,
      lng: 0,
    },
    services,
    modes: getUniqueModesFromServices(services),
    contactDetails,
    insurance: mapInsuranceTypes(combinedInsurance),
    isVerified: false, // Will need to add this field to DB
    lastUpdated: dbPractitioner.last_updated_at,
    priceRange: calculatePriceRange(services), // Add price range calculation
  };
};

export const transformInstitution = (
  dbInstitution: any, 
  services: Service[] = [], 
  contactDetails: ContactDetails = []
): Bureau => {
  return {
    id: dbInstitution.id.toString(),
    type: "bureau",
    image: dbInstitution.image || "/placeholder.svg",
    name: dbInstitution.name,
    businessHours: "Not specified",
    bureauType: mapInstitutionType(dbInstitution.institution_type),
    professionTypes: mapProfessionTypes(dbInstitution.profession_type || []),
    specializations: mapSpecializations(dbInstitution.specialization || []),
    city: "Jakarta", // Default city for now
    location: {
      address: "Jakarta, Indonesia",
      lat: -6.2088,
      lng: 106.8456,
    },
    insurance: mapInsuranceTypes(dbInstitution.insurance || []),
    modes: getUniqueModesFromServices(services),
    contactDetails,
    isVerified: dbInstitution.verified || false,
    lastUpdated: dbInstitution.last_updated_at,
    priceRange: calculatePriceRange(services),
  };
};

export const transformService = (dbService: any): Service => {
  // Handle nested service structure from database joins
  const service = dbService.service || dbService;
  
  const durationHours = service.duration ? Math.floor(service.duration / 60) : 0;
  const durationMinutes = service.duration ? service.duration % 60 : 0;
  
  let durationText = "";
  if (durationHours > 0) {
    durationText += `${durationHours} hour${durationHours > 1 ? 's' : ''}`;
  }
  if (durationMinutes > 0) {
    if (durationText) durationText += " ";
    durationText += `${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`;
  }
  if (!durationText) durationText = "Duration not specified";

  // Handle multiple session modes
  const sessionModes = service.session_mode || ["OFFLINE"];
  const mappedModes = sessionModes.map((mode: string) => mapSessionMode(mode));
  
  return {
    id: service.id?.toString() || 'unknown',
    name: service.name || "Unnamed Service",
    institutionName: service.institution?.name,
    duration: durationText,
    price: service.price ?? 0,
    mode: mappedModes[0], // Keep first mode for backward compatibility
    modes: mappedModes, // All modes for display
    bookingUrl: service.book_cta ? service.book_cta.toString() : undefined,
    learnMoreUrl: service.learn_more_cta ? service.learn_more_cta.toString() : undefined,
  };
};

export const transformContactDetails = (dbContacts: any[]): ContactDetails => {
  // Filter out any error objects
  const validContacts = dbContacts.filter(contact => 
    contact && typeof contact === 'object' && 'contact_type' in contact && !('error' in contact)
  );
  
  return validContacts.map(contact => ({
    type: contact.contact_type,
    value: contact.value,
    link: contact.link
  }));
};

// Helper functions to map database enums to frontend types
const mapInstitutionType = (dbType: string): BureauType => {
  switch (dbType) {
    case "Private Practice":
      return "independent";
    case "Clinic":
      return "clinic";
    case "Faskes 1":
      return "faskes1";
    case "Faskes 2":
      return "faskes2";
    case "Faskes 3":
    case "Private Hospital":
      return "faskes2";
    default:
      return "clinic";
  }
};

const mapSessionMode = (dbMode: string) => {
  const normalizedMode = dbMode?.toUpperCase().replace(/\s/g, '_');
  switch (normalizedMode) {
    case "Chat":
      return "Text/Chat";
    case "Voice Call":
      return "Voice Call";
    case "Video Call":
      return "Video Call";
    case "Offline":
      return "In-Person";
    default:
      return "Others";
  }
};

const mapProfessionTypes = (dbTypes: string[]): ProfessionType[] => {
  return dbTypes.map(type => {
    switch (type) {
      case "PSYCHOLOGIST":
        return "Psychologist";
      case "PSCYHIATRIST":
        return "Psychiatrist";
      case "ART THERAPIST":
        return "Art Therapist";
      default:
        return "Psychologist";
    }
  }) as ProfessionType[];
};

const mapSpecializations = (dbSpecs: string[]): Specialization[] => {
  const mapped = dbSpecs.map(spec => {
    switch (spec) {
      case "Personality Disorders":
        return "Personality Disorders";
      case "Trauma":
        return "Trauma";
      case "Mood Disorders":
        return "Mood Disorders";
      case "ADHD":
        return "ADHD";
      case "Anxiety":
        return "Anxiety";
      case "Relationship":
        return "Relationship";
      case "Career":
        return "Career";
      case "OCD":
        return "OCD";
      case "Self Development":
        return "Self Development";
      case "Gender":
        return "Gender";
      case "Family":
        return "Family";
      case "Depression":
        return "Depression";
      case "Interpersonal":
        return "Interpersonal";
      case "Education":
        return "Education";
      case "Children/Adolescence":
        return "Children/Adolescence";
      case "Hypnotherapy":
        return "Hypnotherapy";
      default:
        return "Others";
    }
  });
  
  // Remove duplicates
  return Array.from(new Set(mapped)) as Specialization[];
};

const mapInsuranceTypes = (dbInsurance: string[]): InsuranceType[] => {
  if (!dbInsurance || dbInsurance.length === 0) return ["none"];
  return dbInsurance.map(ins => {
    switch (ins?.toUpperCase()) {
      case "PRIVATE INSURANCE":
      case "PRIVATE":
        return "Private Insurance";
      case "BPJS":
        return "BPJS";
      default:
        return "none";
    }
  }) as InsuranceType[];
};

const getUniqueModesFromServices = (services: Service[]) => {
  const allModes = services.flatMap(service => service.modes || [service.mode]);
  return [...new Set(allModes)];
};

// Helper function to calculate price range from services
const calculatePriceRange = (services: Service[]): string | undefined => {
  const prices = services.map(s => s.price).filter(price => price && price > 0);
  
  if (prices.length === 0) return undefined;
  
  if (prices.length === 1) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(prices[0]);
  }
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  if (minPrice === maxPrice) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(minPrice);
  }
  
  return `${new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(minPrice)} - ${new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(maxPrice)}`;
};
