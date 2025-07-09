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
    specializations: ["Clinical Psychology", "Anxiety Disorders"],
    city: "Jakarta",
    location: {
      address: "Jl. Sudirman No. 123, Jakarta Selatan",
      lat: -6.2088,
      lng: 106.8456
    },
    insurance: ["private", "bpjs"],
    modes: ["text", "video", "offline"],
    contactDetails: {
      whatsapp: "+6281234567890",
      website: "https://mindcare.com",
      instagram: "https://instagram.com/mindcare"
    },
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
    specializations: ["Child Psychology", "Family Therapy", "Art Therapy"],
    city: "Bandung",
    location: {
      address: "Jl. Braga No. 45, Bandung",
      lat: -6.9175,
      lng: 107.6191
    },
    insurance: ["private"],
    modes: ["voice", "video", "offline"],
    contactDetails: {
      whatsapp: "+6281987654321",
      website: "https://serenity-clinic.com"
    },
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
  "Eating Disorders",
  "Art Therapy"
];

export const professionTypes: ProfessionType[] = [
  "Psychologist",
  "Psychiatrist",
  "Art Therapist",
  "Music Therapist",
  "Counselor",
  "Social Worker"
];

export const mockPeerCounselingData = [
  {
    id: "pc1",
    type: "peer-counseling",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    name: "Jakarta Anxiety Support Circle",
    specialization: "Anxiety & Panic Disorders",
    serviceType: "Peer Counseling",
    city: "Jakarta",
    price: "Free",
    isVerified: true
  },
  {
    id: "pc2",
    type: "support-group",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=400&fit=crop",
    name: "Depression Warriors Community",
    specialization: "Depression & Mood Disorders",
    serviceType: "Support Group",
    city: "Bandung",
    price: "25000",
    isVerified: true
  },
  {
    id: "pc3",
    type: "peer-counseling",
    image: "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400&h=400&fit=crop",
    name: "Young Adults Mental Health",
    specialization: "General Mental Health",
    serviceType: "Peer Counseling",
    city: "Surabaya",
    price: "50000",
    isVerified: false
  }
];

export const mockActivitiesData = [
  {
    id: "act1",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    name: "Mindful Art Therapy",
    organizationName: "Creative Minds Studio",
    activityType: "Art Therapy",
    city: "Jakarta",
    price: "150000"
  },
  {
    id: "act2",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    name: "Nature Hiking Group",
    organizationName: "Outdoor Wellness",
    activityType: "Nature Therapy",
    city: "Bogor",
    price: "Free"
  },
  {
    id: "act3",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=400&fit=crop",
    name: "Meditation & Mindfulness",
    organizationName: "Inner Peace Center",
    activityType: "Meditation",
    city: "Yogyakarta",
    price: "75000"
  }
];

export const mockOrganizationsData = [
  {
    id: "org1",
    type: "organization",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=400&fit=crop",
    name: "Mental Health Indonesia Foundation",
    organizationType: "Non-Profit Organization",
    city: "Jakarta"
  },
  {
    id: "org2",
    type: "community",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
    name: "Student Mental Health Network",
    organizationType: "Student Community",
    city: "Bandung"
  },
  {
    id: "org3",
    type: "organization",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=400&fit=crop",
    name: "Workplace Wellness Initiative",
    organizationType: "Corporate Program",
    city: "Surabaya"
  }
];
