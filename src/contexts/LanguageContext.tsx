import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    header: {
      title: "Mental Health Resource Directory",
      navigation: {
        home: "Home",
        professional: "Professional Counseling",
        peer: "Peer Counseling", 
        organizations: "Organizations",
        stressRelief: "Stress Relief",
        about: "About"
      }
    },
    search: {
      placeholder: "Search by practitioner or clinic name...",
      filters: {
        location: "Location",
        institution: "Institution", 
        profession: "Profession",
        specializations: "Specializations",
        sessionMode: "Session Mode",
        advanced: "Advanced",
        insurance: "Insurance",
        priceRange: "Session Cost (IDR)",
        minimum: "Minimum",
        maximum: "Maximum"
      }
    },
    common: {
      verified: "Verified",
      experience: "years experience",
      priceRange: "Price Range",
      city: "City",
      viewDetails: "View Details",
      contact: "Contact",
      website: "Website",
      phone: "Phone",
      email: "Email",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      facebook: "Facebook",
      telegram: "Telegram"
    },
    professionTypes: {
      psychologist: "Psychologist",
      psychiatrist: "Psychiatrist", 
      artTherapist: "Art Therapist",
      musicTherapist: "Music Therapist",
      counselor: "Counselor",
      socialWorker: "Social Worker"
    },
    specializations: {
      depression: "Depression",
      anxiety: "Anxiety",
      trauma: "Trauma",
      relationshipIssues: "Relationship Issues",
      adhd: "ADHD",
      ocd: "OCD",
      personalityDisorders: "Personality Disorders",
      familyTherapy: "Family Therapy"
    },
    sessionModes: {
      textChat: "Text Chat",
      voiceCall: "Voice Call", 
      videoCall: "Video Call",
      inPerson: "In-Person"
    },
    insurance: {
      private: "Private",
      bpjs: "BPJS",
      none: "None"
    }
  },
  id: {
    header: {
      title: "Direktori Sumber Daya Kesehatan Mental",
      navigation: {
        home: "Beranda",
        professional: "Konseling Profesional",
        peer: "Konseling Sebaya",
        organizations: "Organisasi", 
        stressRelief: "Penghilang Stres",
        about: "Tentang"
      }
    },
    search: {
      placeholder: "Cari...",
      filters: {
        location: "Lokasi",
        institution: "Institusi",
        profession: "Profesi", 
        specializations: "Spesialisasi",
        sessionMode: "Mode Sesi",
        advanced: "Lanjutan",
        insurance: "Asuransi",
        priceRange: "Biaya Sesi (IDR)",
        minimum: "Minimum",
        maximum: "Maksimum"
      }
    },
    common: {
      verified: "Terverifikasi",
      experience: "tahun pengalaman",
      priceRange: "Rentang Harga",
      city: "Kota",
      viewDetails: "Lihat Detail",
      contact: "Kontak",
      website: "Website",
      phone: "Telepon",
      email: "Email", 
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      facebook: "Facebook",
      telegram: "Telegram"
    },
    professionTypes: {
      psychologist: "Psikolog",
      psychiatrist: "Psikiater",
      artTherapist: "Terapis Seni", 
      musicTherapist: "Terapis Musik",
      counselor: "Konselor",
      socialWorker: "Pekerja Sosial"
    },
    specializations: {
      depression: "Depresi",
      anxiety: "Kecemasan",
      trauma: "Trauma",
      relationshipIssues: "Masalah Hubungan",
      adhd: "ADHD", 
      ocd: "OCD",
      personalityDisorders: "Gangguan Kepribadian",
      familyTherapy: "Terapi Keluarga"
    },
    sessionModes: {
      textChat: "Chat Teks",
      voiceCall: "Panggilan Suara",
      videoCall: "Panggilan Video", 
      inPerson: "Tatap Muka"
    },
    insurance: {
      private: "Swasta",
      bpjs: "BPJS",
      none: "Tidak Ada"
    }
  }
};