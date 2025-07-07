
import { Database } from "@/integrations/supabase/types";
import { Practitioner, Bureau, Service, ContactDetails, ProfessionType, Specialization, InsuranceType } from "@/types";

type DBPractitioner = Database['public']['Tables']['practitioner']['Row'] & {
  institution?: Database['public']['Tables']['institution']['Row'] & {
    location?: Database['public']['Tables']['location']['Row'];
  };
};

type DBInstitution = Database['public']['Tables']['institution']['Row'] & {
  location?: Database['public']['Tables']['location']['Row'];
};

type DBService = Database['public']['Tables']['services']['Row'] & {
  institution?: { name: string };
};

type DBContactDetail = Database['public']['Tables']['contact_details']['Row'];

export const transformPractitioner = (
  dbPractitioner: DBPractitioner, 
  services: Service[] = [], 
  contactDetails: ContactDetails = {}
): Practitioner => {
  const institution = dbPractitioner.institution;
  const location = institution?.location;

  return {
    id: dbPractitioner.id.toString(),
    type: "practitioner",
    image: "/placeholder.svg",
    name: dbPractitioner.name,
    bureauName: institution?.name || "Unknown Bureau",
    bureauId: dbPractitioner.institution_id?.toString() || "",
    professionTypes: mapProfessionTypes(dbPractitioner.profession_type || []),
    licenseNumber: dbPractitioner.license_number,
    specializations: mapSpecializations(dbPractitioner.specialization || []),
    experience: dbPractitioner.experience ? `${dbPractitioner.experience} years` : undefined,
    education: Array.isArray(dbPractitioner.education) ? dbPractitioner.education.join(", ") : undefined,
    city: location?.city || "Unknown City",
    location: {
      address: location?.address || "Address not available",
      lat: 0,
      lng: 0,
    },
    services,
    modes: getUniqueModesFromServices(services),
    contactDetails,
    insurance: mapInsuranceTypes(dbPractitioner.insurance || []),
    isVerified: false, // Will need to add this field to DB
    lastUpdated: dbPractitioner.last_updated_at,
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
    price: dbService.price || 0,
    mode: mapSessionMode(dbService.session_mode?.[0] || "OFFLINE"),
    bookingUrl: dbService.book_cta || undefined,
    learnMoreUrl: dbService.learn_more_cta || undefined,
  };
};

export const transformContactDetails = (dbContactDetails: DBContactDetail[]): ContactDetails => {
  const contacts: ContactDetails = {};
  
  dbContactDetails.forEach(contact => {
    switch (contact.contact_type) {
      case 'WHATSAPP':
        contacts.whatsapp = contact.value;
        break;
      case 'WEBSITE':
        contacts.website = contact.link || contact.value;
        break;
      case 'INSTAGRAM':
        contacts.instagram = contact.link || contact.value;
        break;
      // Add phone and facebook when they're added to the enum
    }
  });
  
  return contacts;
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
  return dbSpecs.map(spec => {
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
  }) as Specialization[];
};

const mapInsuranceTypes = (dbInsurance: string[]): InsuranceType[] => {
  return dbInsurance.map(ins => {
    switch (ins) {
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
