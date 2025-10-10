
export type Specialization = 
  | "Clinical Psychology"
  | "Child Psychology"
  | "Cognitive Behavioral Therapy"
  | "Family Therapy"
  | "Trauma Therapy"
  | "Anxiety Disorders"
  | "Depression"
  | "Addiction Counseling"
  | "Couples Therapy"
  | "Eating Disorders"
  | "Art Therapy";

export type ProfessionType = 
  | "Psychologist"
  | "Psychiatrist"
  | "Art Therapist"
  | "Music Therapist"
  | "Counselor"
  | "Social Worker";

export type Mode = "text" | "voice" | "video" | "offline";

export type InsuranceType = "none" | "private" | "bpjs";

export type BureauType = "independent" | "clinic" | "faskes1" | "faskes2";

export interface Service {
  id: string;
  name: string;
  institutionName?: string;
  duration: string;
  price: number;
  mode: Mode;
  modes?: Mode[]; // For services with multiple session modes
  bookingUrl?: string;
  learnMoreUrl?: string;
}

export interface ContactDetail {
  type: "WhatsApp" | "Phone" | "Website" | "Instagram" | "Email" | "Application";
  value: string;
  link?: string;
}

export type ContactDetails = ContactDetail[];

export interface Practitioner {
  id: string;
  type: "practitioner";
  image: string;
  name: string;
  bureauName: string;
  bureauId: string;
  professionTypes: ProfessionType[];
  licenseNumber?: string;
  specializations: Specialization[];
  experience?: string;
  education?: string;
  city: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  services: Service[];
  modes: Mode[];
  contactDetails: ContactDetails;
  insurance: InsuranceType[];
  isVerified: boolean;
  lastUpdated: string;
  priceRange?: string;
}

export interface Bureau {
  id: string;
  type: "bureau";
  image?: string;
  name: string;
  businessHours: string;
  bureauType: BureauType;
  professionTypes: ProfessionType[];
  specializations: Specialization[];
  city: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  insurance: InsuranceType[];
  modes: Mode[];
  contactDetails: ContactDetails;
  isVerified: boolean;
  lastUpdated: string;
  priceRange?: string;
}

export interface Institution {
  id: string;
  type: "institution";
  image?: string;
  name: string;
  businessHours?: string;
  professionTypes: ProfessionType[];
  specializations: Specialization[];
  city: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  insurance: InsuranceType[];
  modes: Mode[];
  contactDetails: ContactDetails;
  isVerified: boolean;
  lastUpdated: string;
}

export interface PeerCounselingData {
  id: string;
  type: "peer-counseling" | "support-group";
  image: string;
  name: string;
  city: string;
  isVerified: boolean;
  specialization: string;
  serviceType: string;
  price: number | string;
}

export type Resource = Practitioner | Bureau;

export interface FilterState {
  search: string;
  locations: string[]; // Cities/Countries
  institutions: string[]; // Institution names
  institutionTypes: BureauType[]; // Institution types
  professionTypes: ProfessionType[];
  specializations: Specialization[];
  priceRange: [number, number];
  modes: Mode[];
  insurance: InsuranceType[];
}

export interface FilterTag {
  type: keyof FilterState;
  value: string;
  label: string;
}

export interface UnifiedCardData {
  type: "practitioner" | "institution" | "peer-counseling" | "support-group" | "activity";
  id: string;
  image?: string;
  name: string;
  city: string;
  isVerified?: boolean;
  institutionName?: string;
  organizationName?: string;
  professionTypes?: ProfessionType[];
  specializations?: Specialization[];
  specialization?: string;
  serviceType?: string;
  activityType?: string;
  priceRange?: string;
  price?: number;
  insurance?: InsuranceType[];
  modes?: Mode[];
}
