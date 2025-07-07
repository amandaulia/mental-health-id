import { Practitioner, Bureau, Specialization, ProfessionType } from "@/types";

export const mockPractitioners: Practitioner[] = [
  {
    id: "1",
    type: "practitioner",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop",
    name: "Dr. Sarah Johnson",
    bureauName: "MindCare Psychology Center",
    bureauId: "b1",
    professionTypes: ["Psychologist", "Counselor"],
    licenseNumber: "PSY-2024-001",
    specializations: ["Clinical Psychology", "Anxiety Disorders"],
    experience: "8 years",
    education: "PhD in Clinical Psychology, University of Indonesia",
    city: "Jakarta",
    location: {
      address: "Jl. Sudirman No. 123, Jakarta Selatan",
      lat: -6.2088,
      lng: 106.8456
    },
    services: [
      { 
        id: "1",
        name: "Individual Therapy", 
        duration: "60 minutes", 
        price: 500000,
        mode: "offline",
        bookingUrl: "https://booking.example.com/sarah/individual",
        learnMoreUrl: "https://example.com/services/individual-therapy"
      },
      { 
        id: "2",
        name: "Online Counseling", 
        duration: "45 minutes", 
        price: 400000,
        mode: "video",
        bookingUrl: "https://booking.example.com/sarah/online",
        learnMoreUrl: "https://example.com/services/online-counseling"
      }
    ],
    modes: ["text", "video", "offline"],
    contactDetails: {
      phone: "+6281234567890",
      whatsapp: "+6281234567890",
      website: "https://mindcare.com",
      instagram: "https://instagram.com/drsarahjohnson"
    },
    insurance: ["private", "bpjs"],
    isVerified: true,
    lastUpdated: "2024-01-15"
  },
  {
    id: "2",
    type: "practitioner",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop",
    name: "Dr. Ahmad Rizky",
    bureauName: "Serenity Mental Health Clinic",
    bureauId: "b2",
    professionTypes: ["Psychiatrist"],
    licenseNumber: "PST-2024-002",
    specializations: ["Child Psychology", "Family Therapy"],
    experience: "12 years",
    education: "Master in Psychology, Gadjah Mada University",
    city: "Bandung",
    location: {
      address: "Jl. Braga No. 45, Bandung",
      lat: -6.9175,
      lng: 107.6191
    },
    services: [
      { 
        id: "3",
        name: "Child Counseling", 
        duration: "45 minutes", 
        price: 400000,
        mode: "offline",
        bookingUrl: "https://booking.example.com/ahmad/child",
        learnMoreUrl: "https://example.com/services/child-counseling"
      },
      { 
        id: "4",
        name: "Family Therapy", 
        duration: "90 minutes", 
        price: 800000,
        mode: "offline",
        bookingUrl: "https://booking.example.com/ahmad/family",
        learnMoreUrl: "https://example.com/services/family-therapy"
      }
    ],
    modes: ["voice", "video", "offline"],
    contactDetails: {
      phone: "+6281987654321",
      whatsapp: "+6281987654321",
      website: "https://serenity-clinic.com"
    },
    insurance: ["private"],
    isVerified: true,
    lastUpdated: "2024-01-10"
  }
];

export const mockBureaus: Bureau[] = [
  {
    id: "b1",
    type: "bureau",
    name: "MindCare Psychology Center",
    businessHours: "Mon-Fri: 8:00-17:00, Sat: 8:00-13:00",
    bureauType: "clinic",
    professionTypes: ["Psychologist", "Counselor"],
    city: "Jakarta",
    location: {
      address: "Jl. Sudirman No. 123, Jakarta Selatan",
      lat: -6.2088,
      lng: 106.8456
    },
    insurance: ["private", "bpjs"],
    isVerified: true,
    lastUpdated: "2024-01-15"
  },
  {
    id: "b2",
    type: "bureau",
    name: "Serenity Mental Health Clinic",
    businessHours: "Mon-Sun: 9:00-21:00",
    bureauType: "independent",
    professionTypes: ["Psychiatrist", "Art Therapist"],
    city: "Bandung",
    location: {
      address: "Jl. Braga No. 45, Bandung",
      lat: -6.9175,
      lng: 107.6191
    },
    insurance: ["private"],
    isVerified: true,
    lastUpdated: "2024-01-10"
  }
];

export const allResources = [...mockPractitioners, ...mockBureaus];

export const specializations: Specialization[] = [
  "Clinical Psychology",
  "Child Psychology",
  "Cognitive Behavioral Therapy",
  "Family Therapy",
  "Trauma Therapy",
  "Anxiety Disorders",
  "Depression",
  "Addiction Counseling",
  "Couples Therapy",
  "Eating Disorders"
];

export const professionTypes: ProfessionType[] = [
  "Psychologist",
  "Psychiatrist",
  "Art Therapist",
  "Music Therapist",
  "Counselor",
  "Social Worker"
];