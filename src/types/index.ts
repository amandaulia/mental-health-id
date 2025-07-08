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
  bookingUrl?: string;
  learnMoreUrl?: string;
}

export interface ContactDetails {
  phone?: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
}

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
}

export type Resource = Practitioner | Bureau;

export interface FilterState {
  search: string;
  institutions: string[];
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
