
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
  | "Eating Disorders";

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
  name: string;
  duration: string;
  minPrice: number;
  maxPrice: number;
  mode: Mode;
  bookingUrl?: string;
  learnMoreUrl?: string;
}

export interface Practitioner {
  id: string;
  type: "practitioner";
  image: string;
  name: string;
  bureauName: string;
  bureauId: string;
  professionTypes: ProfessionType[];
  licenseNumber: string;
  specializations: Specialization[];
  experience: string;
  education: string;
  city: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  services: Service[];
  modes: Mode[];
  phoneNumber: string;
  website?: string;
  instagram?: string;
  insurance: InsuranceType[];
  isVerified: boolean;
  lastUpdated: string;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface Bureau {
  id: string;
  type: "bureau";
  name: string;
  businessHours: string;
  bureauType: BureauType;
  professionTypes: ProfessionType[];
  city: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  insurance: InsuranceType[];
  isVerified: boolean;
  lastUpdated: string;
}

export type Resource = Practitioner | Bureau;

export interface FilterState {
  search: string;
  bureauNames: string[];
  professionTypes: ProfessionType[];
  specializations: Specialization[];
  priceRange: [number, number];
  modes: Mode[];
  types: BureauType[];
  insurance: InsuranceType[];
}

export interface FilterTag {
  type: keyof FilterState;
  value: string;
  label: string;
}
