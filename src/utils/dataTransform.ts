import { Database } from "@/integrations/supabase/types";
import { Practitioner, Bureau, Service, ContactDetails, ProfessionType, Specialization, InsuranceType } from "@/types";

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
  contactDetails: ContactDetails = {}
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
  contactDetails: ContactDetails = {}
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
  const durationHours = dbService.duration ? Math.floor(dbService.duration / 60) : 0;
  const durationMinutes = dbService.duration ? dbService.duration % 60 : 0;
  
  let durationText = "";
  if (durationHours > 0) {
    durationText += `${durationHours} hour${durationHours > 1 ? 's' : ''}`;
  }
  if (durationMinutes > 0) {
    if (durationText) durationText += " ";
    durationText += `${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`;
  }
  if (!durationText) durationText = "Duration not specified";

  return {
    id: dbService.id.toString(),
    name: dbService.name,
    institutionName: dbService.institution?.name,
    duration: durationText,
    price: dbService.price ?? null,
    mode: mapSessionMode(dbService.session_mode?.[0] || "OFFLINE"),
    bookingUrl: dbService.book_cta ? dbService.book_cta.toString() : undefined,
    learnMoreUrl: dbService.learn_more_cta ? dbService.learn_more_cta.toString() : undefined,
  };
};

export const transformContactDetails = (dbContacts: any[]): ContactDetails => {
  // Filter out any error objects
  const validContacts = dbContacts.filter(contact => 
    contact && typeof contact === 'object' && 'contact_type' in contact && !('error' in contact)
  );
  
  const contactDetails: ContactDetails = {};
  
  validContacts.forEach(contact => {
    switch (contact.contact_type) {
      case 'WhatsApp':
        contactDetails.whatsapp = contact.value;
        break;
      case 'Website':
        contactDetails.website = contact.value;
        break;
      case 'Instagram':
        contactDetails.instagram = contact.value;
        break;
    }
  });
  
  return contactDetails;
};

// Helper functions to map database enums to frontend types
const mapInstitutionType = (dbType: string) => {
  switch (dbType?.toUpperCase()) {
    case "PRIVATE":
      return "independent";
    case "CLINIC":
      return "clinic";
    case "HOSPITAL":
      return "faskes2";
    default:
      return "clinic"; // Default to clinic since most are clinics
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
      case "PERSONALITY":
        return "Clinical Psychology";
      case "TRAUMA":
        return "Trauma Therapy";
      case "MOOD":
        return "Depression";
      case "ADHD":
        return "Anxiety Disorders";
      case "ANXIETY":
        return "Anxiety Disorders";
      case "RELATIONSHIP":
        return "Couples Therapy";
      case "CAREER":
        return "Couples Therapy";
      case "OCD":
        return "Anxiety Disorders";
      case "SELF_DEVELOPMENT":
        return "Clinical Psychology";
      case "GENDER":
        return "Family Therapy";
      case "FAMILY":
        return "Family Therapy";
      case "DEPRESSION":
        return "Depression";
      case "INTERPERSONAL":
        return "Family Therapy";
      case "EDUCATION":
        return "Child Psychology";
      default:
        return "Clinical Psychology";
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
        return "private";
      case "BPJS":
        return "bpjs";
      default:
        return "none";
    }
  }) as InsuranceType[];
};

const getUniqueModesFromServices = (services: Service[]) => {
  const modes = services.map(service => service.mode);
  return [...new Set(modes)];
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
