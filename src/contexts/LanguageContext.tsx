import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "en";
  });

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value ?? key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
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
        about: "About",
      },
    },
    search: {
      placeholder: "Search by practitioner or clinic name...",
      placeholderOrganization: "Search based on the name of organization or community",
      placeholderPeerCounseling: "Search based on the name of peer counselor or support group",
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
        maximum: "Maximum",
      },
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
      telegram: "Telegram",
      callNow: "Call Now",
      openInGoogleMaps: "Open in Google Maps",
      clickOpenGoogleMaps: "Click to open in Google Maps",
      priceNotAvailable: "Price not available",
      free: "Free",
      viewAll: "View All",
      goBack: "Go Back",
      visitWebsite: "Visit Website",
      more: "more",
      location: "Location",
      durationNotSpecified: "Duration not specified",
    },
    professionTypes: {
      psychologist: "Psychologist",
      psychiatrist: "Psychiatrist",
      artTherapist: "Art Therapist",
      musicTherapist: "Music Therapist",
      counselor: "Counselor",
      socialWorker: "Social Worker",
    },
    specializations: {
      depression: "Depression",
      anxiety: "Anxiety",
      trauma: "Trauma",
      relationshipIssues: "Relationship",
      adhd: "ADHD",
      ocd: "OCD",
      personalityDisorders: "Personality Disorders",
      familyTherapy: "Family",
      career: "Career",
      childrenAdolescence: "Children/Adolescence",
      education: "Education",
      gender: "Gender",
      hypnotherapy: "Hypnotherapy",
      interpersonal: "Interpersonal",
      moodDisorders: "Mood Disorders",
      selfDevelopment: "Self Development",
      eatingDisorders: "Eating Disorders",
      grief: "Grief",
      psychiatry: "Psychiatry",
      others: "Others",
    },
    sessionModes: {
      chat: "Chat",
      voiceCall: "Voice Call",
      videoCall: "Video Call",
      offline: "Offline",
      textChat: "Text Chat",
      inPerson: "In-Person",
      offlineSession: "Offline Session",
    },
    insurance: {
      private: "Private Insurance",
      bpjs: "BPJS",
      none: "None",
      privateInsurance: "Private Insurance",
      noInsurance: "No Insurance",
    },
    institutionTypes: {
      clinic: "Clinic",
      faskes1: "Faskes 1",
      faskes2: "Faskes 2",
      faskes3: "Faskes 3",
      privateHospital: "Private Hospital",
      privatePractice: "Private Practice",
    },
    contactTypes: {
      application: "Application",
      email: "Email",
      instagram: "Instagram",
      phone: "Phone",
      website: "Website",
      whatsapp: "WhatsApp",
    },
    pages: {
      professional: {
        heroTitleA: "Professional Counseling",
        heroTitleB: "",
        heroLead:
          "Find licensed mental health professionals — psychologists, psychiatrists, and clinics ready to support you. 🌟",
      },
      peer: {
        heroTitleA: "Peer & Group",
        heroTitleB: " Counseling",
        heroLead: "Connect with peers and find support groups for shared experiences and guidance. 🤝",
      },
      stressRelief: {
        heroTitleA: "Stress Relief",
        heroTitleB: " Activities",
        heroLead: "Explore a variety of activities designed to help you relax and de-stress.",
      },
      organizations: {
        heroTitleA: "Organizations & Communities",
        heroTitleB: " Directory",
        heroLead:
          "Find local organizations and communities dedicated to mental health support. Connect with others and discover resources that can help you thrive. 🤝",
      },
    },
    seo: {
      home: {
        title: "Find Psychologists, Psychiatrists & Mental Health Resources in Indonesia",
        description:
          "A free directory of verified psychologists, psychiatrists, peer counselors, support groups and wellness activities across Indonesia.",
      },
      professional: {
        title: "Find Psychologists, Psychiatrists & Counseling Services in Indonesia",
        description:
          "Browse a verified directory of licensed psychologists, psychiatrists, and mental health clinics across Indonesia. Filter by city, specialization, insurance (including BPJS) and session mode.",
      },
      peer: {
        title: "Peer & Group Counseling in Indonesia | Mental Health Directory",
        description:
          "Connect with peer counselors and support groups across Indonesia for shared mental health experiences and community-based guidance.",
      },
      stressRelief: {
        title: "Stress Relief Activities in Indonesia | Mental Health Directory",
        description:
          "Art therapy, music, sports, and wellness activities across Indonesia to help you relax, de-stress, and improve mental wellbeing.",
      },
      organizations: {
        title: "Mental Health Organizations & Communities in Indonesia",
        description:
          "Discover mental health organizations, communities, and advocacy groups across Indonesia working to support and raise awareness about mental wellbeing.",
      },
      about: {
        title: "About Mental Health Directory Indonesia",
        description:
          "Learn about the Mental Health Directory Indonesia — a free, comprehensive guide to mental health professionals, peer counseling, and wellness resources across Indonesia.",
      },
    },
    footer: {
      description:
        "Your directory for mental health resources. Connecting you with psychologists, psychiatrists, and mental health clinics across Indonesia.",
      copyright: "© 2025 Elysium Mentalcare. Made with ❤️ for mental wellness.",
    },
    home: {
      hero: {
        title1: "Mental Health",
        title2: "Resource Directory",
        subtitle: "Your trusted companion in finding qualified mental health resources and support.",
      },
      feelings: {
        title: "How are you feeling today?",
        cta: "Get Personalized Recommendations",
        analyzing: "Analyzing...",
        recommendationsTitle: "Personalized Recommendations for You",
      },
      toast: {
        shareFeelings: "Please share your feelings",
        recommendationsReady: "Recommendations Ready",
        analysisFailed: "Analysis Failed",
      },
      sectionHeading: {
        professional: "Professional Counseling",
        clinics: "Clinics & Hospitals",
        peer: "Peer Counseling & Support Groups",
        stressRelief: "Stress Relief Activities",
        organizations: "Organizations & Communities",
      },
      comingSoon: "Coming Soon",
      fallback: {
        unknownCity: "Unknown City",
        addressUnavailable: "Address not available",
      },
      sections: {
        professional: {
          title: "Professional Counseling",
          description:
            "Find licensed mental health professionals — psychologists, psychiatrists, and clinics ready to support you.",
          cta: "Search & Filter",
        },
        peer: {
          title: "Peer Counseling",
          description: "Connect with peer counselors and support groups who care.",
          cta: "Find Peer Support",
        },
        stressRelief: {
          title: "Stress Relief",
          description: "Discover self-help and wellness programs that support your mental health.",
          cta: "Find Activities",
        },
        organizations: {
          title: "Organizations",
          description: "Connect with communities and discover resources that help you grow.",
          ctaRecent: "Recent Organizations & Communities",
          ctaAll: "All Organizations & Communities",
        },
        about: {
          title: "About Mental Health Directory",
          subtitle: "Your comprehensive guide to mental health resources and support in Indonesia.",
          q1: "What is the Mental Health Directory?",
          q2: "What information will Mental Health Directory provide?",
          a1: "The Mental Health Directory is a comprehensive platform designed to help individuals find qualified mental health professionals, support groups, and wellness resources across Indonesia. We understand our platform serves as a bridge between those seeking help and qualified professionals, providing detailed information about specializations, accommodations, counseling centers, and various Professional Counseling Services.",
          professionalTitle: "Professional Counseling Services",
          professionalDesc:
            "Licensed psychologists, psychiatrists, and mental health clinics with detailed profiles, specializations, and contact information.",
          peerTitle: "Peer & Support Counseling",
          peerBadge: "Coming Soon",
          peerDesc:
            "Community-based support groups and peer counseling services for various mental health conditions and life challenges.",
          stressReliefTitle: "Stress Relief Activities",
          stressReliefBadge: "Coming Soon",
          stressReliefDesc:
            "Art therapy, music therapy, sports activities, and other wellness programs designed to promote mental well-being.",
          organizationsTitle: "Organizations",
          organizationsBadge: "Coming Soon",
          organizationsDesc:
            "Mental health organizations, educational institutions, and community groups dedicated to mental health awareness and support.",
        },
      },
    },
    detail: {
      back: "Back",
      home: "Home",
      practitionerDetails: "Practitioner Details",
      bureauDetails: "Bureau Details",
      type: "Type",
      loading: "Loading...",
      notFound: "Not found",
      error: "An error occurred. Please try again.",
      experience: "Experience",
      education: "Education",
      licenseNumber: "License Number",
      lastUpdated: "Last updated",
      professionTypes: "Profession Types",
      specializations: "Specializations",
      sessionModes: "Session Modes",
      insurance: "Insurance",
      services: "Services",
      contactInfo: "Contact Information",
      locations: "Locations",
      noContactInfo: "No contact information available",
      noServices: "No services available",
      book: "Book",
      learnMore: "Learn More",
      showAll: "Show all",
      showLess: "Show less",
      practitioners: "Practitioners",
      noInsurance: "No Insurance",
      privateInsurance: "Private Insurance",
      ourServices: "Our Services",
      ourPractitioners: "Our Practitioners",
      searchServices: "Search services...",
      noServicesMatch: "No services match the selected filters.",
      includePriceUponRequest: "Include price upon request",
      priceUponRequest: "Price available upon request",
      free: "Free",
      bookNow: "Book Now",
      activeFiltersLabel: "Active filters:",
    },
    filters: {
      activeFilters: "Active Filters",
      clearAll: "Clear all",
      clearFilters: "Clear Filters",
      noResults: "No results found",
      noActivities: "No activities found matching your criteria.",
      loadMore: "Load More",
      city: "City",
      institution: "Institution",
      institutionType: "Institution Type",
      profession: "Profession",
      specialization: "Specialization",
      sessionMode: "Session Mode",
      priceRange: "Price Range (IDR)",
      insurance: "Insurance",
      sessionCost: "Session Cost (IDR)",
      loadMoreCount: "Load More",
    },
    about: {
      hero: {
        title1: "About",
        title2: "Mental Health Directory",
        subtitle: "Your comprehensive guide to mental health resources and support in Indonesia",
      },
      what: {
        title: "What is the Mental Health Directory?",
        p1: "The Mental Health Directory is a comprehensive platform designed to help individuals find qualified mental health professionals, support groups, and wellness resources across Indonesia. We understand that seeking mental health support can be overwhelming, and our mission is to make this process easier and more accessible for everyone.",
        p2: "Our platform serves as a bridge between those seeking help and qualified professionals, providing detailed information about psychologists, psychiatrists, counseling centers, and various mental health support services available in your area.",
      },
      info: {
        title: "What information will Mental Health Directory cover?",
        professional: {
          title: "Professional Counseling Services",
          desc: "Licensed psychologists, psychiatrists, and mental health clinics with detailed profiles, specializations, and contact information.",
        },
        peer: {
          title: "Peer & Group Counseling",
          desc: "Community-based support groups and peer counseling services for various mental health conditions and life challenges.",
        },
        stressRelief: {
          title: "Stress Relief Activities",
          desc: "Art therapy, music therapy, sports activities, and other wellness programs designed to promote mental well-being.",
        },
        organizations: {
          title: "Organizations",
          desc: "Mental health organizations, educational institutions, and community groups dedicated to mental health awareness and support.",
        },
      },
      contribute: {
        title: "How can I contribute to the project?",
        intro:
          "We believe in the power of community and welcome contributions from mental health professionals, organizations, and individuals passionate about mental health advocacy.",
        professionals: {
          title: "Mental Health Professionals",
          desc: "Join our directory to help more people find the support they need",
        },
        organizations: {
          title: "Organizations",
          desc: "Partner with us to expand mental health resources and awareness",
        },
        community: {
          title: "Community Members",
          desc: "Share feedback, suggest improvements, or help spread awareness",
        },
      },
      contact: {
        title: "Contact Details",
        email: "Email",
        phone: "Phone",
        followInstagram: "Follow us on Instagram",
        instagramDesc: "Stay updated with our latest resources and mental health tips",
      },
    },
    peerDetail: {
      notFound: "Resource Not Found",
      notFoundDesc: "The resource you're looking for doesn't exist.",
      about: "About",
      specialization: "Specialization",
      additionalInfo: "Additional Information",
      schedule: "Schedule",
      groupSize: "Group Size",
      facilitator: "Facilitator",
      languages: "Languages",
      contactInfo: "Contact Information",
      address: "Address",
      phone: "Phone",
      email: "Email",
      website: "Website",
      instagram: "Instagram",
      getSupport: "Get Support",
      followDesc: "Follow us for updates and mental health tips",
    },
    organizationDetail: {
      notFound: "Organization Not Found",
      notFoundDesc: "The organization you're looking for doesn't exist.",
      about: "About",
      organizationType: "Organization Type",
      contactInfo: "Contact Information",
      address: "Address",
      phone: "Phone",
      email: "Email",
      website: "Website",
      instagram: "Instagram",
      getInTouch: "Get in Touch",
      followDesc: "Follow us for updates and insights",
    },
    organizations: {
      browse: "Browse Organizations & Communities",
      all: "All Organizations & Communities",
    },
    peerCounseling: {
      findPeerSupport: "Find Peer Support",
    },
    stressRelief: {
      findActivities: "Find Activities",
      noActivities: "No activities found matching your criteria.",
    },
    notFound: {
      title: "Oops! Page not found",
      return: "Return to Home",
    },
    phoneDialog: {
      title: "Call this number",
      description:
        "Phone calls can't be placed directly from a desktop browser. Please dial this number from your phone.",
      copy: "Copy",
      copied: "Copied",
      copiedToast: "Phone number copied",
      copyFailed: "Could not copy",
    },
    errors: {
      somethingWrong: "Something went wrong",
      unexpected: "We're sorry, something unexpected happened. Please try refreshing the page.",
      tryAgain: "Try Again",
      refresh: "Refresh Page",
    },
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
        about: "Tentang",
      },
    },
    search: {
      placeholder: "Cari berdasarkan nama praktisi atau klinik...",
      placeholderOrganization: "Cari berdasarkan nama organisasi atau komunitas",
      placeholderPeerCounseling: "Cari berdasarkan nama konselor sebaya atau kelompok dukungan",
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
        maximum: "Maksimum",
      },
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
      telegram: "Telegram",
      callNow: "Hubungi Sekarang",
      openInGoogleMaps: "Buka di Google Maps",
      clickOpenGoogleMaps: "Klik untuk buka di Google Maps",
      priceNotAvailable: "Harga tidak tersedia",
      free: "Gratis",
      viewAll: "Lihat Semua",
      goBack: "Kembali",
      visitWebsite: "Kunjungi Website",
      more: "lainnya",
      location: "Lokasi",
      durationNotSpecified: "Durasi tidak ditentukan",
    },
    professionTypes: {
      psychologist: "Psikolog",
      psychiatrist: "Psikiater",
      artTherapist: "Terapis Seni",
      musicTherapist: "Terapis Musik",
      counselor: "Konselor",
      socialWorker: "Pekerja Sosial",
    },
    specializations: {
      depression: "Depresi",
      anxiety: "Gangguan Kecemasan",
      trauma: "Trauma",
      relationshipIssues: "Hubungan",
      adhd: "ADHD",
      ocd: "OCD",
      personalityDisorders: "Gangguan Kepribadian",
      familyTherapy: "Keluarga",
      career: "Karir",
      childrenAdolescence: "Anak/Remaja",
      education: "Pendidikan",
      gender: "Gender",
      hypnotherapy: "Hipnoterapi",
      interpersonal: "Interpersonal",
      moodDisorders: "Gangguan Mood",
      selfDevelopment: "Pengembangan Diri",
      eatingDisorders: "Gangguan Makan",
      grief: "Duka",
      psychiatry: "Psikiatri",
      others: "Lainnya",
    },
    sessionModes: {
      chat: "Chat",
      voiceCall: "Voice Call",
      videoCall: "Video Call",
      offline: "Tatap Muka",
      textChat: "Obrolan Teks",
      inPerson: "Tatap Muka",
      offlineSession: "Sesi Tatap Muka",
    },
    insurance: {
      private: "Asuransi Pribadi",
      bpjs: "BPJS",
      none: "Tidak Ada",
      privateInsurance: "Asuransi Pribadi",
      noInsurance: "Tanpa Asuransi",
    },
    institutionTypes: {
      clinic: "Klinik",
      faskes1: "Faskes 1",
      faskes2: "Faskes 2",
      faskes3: "Faskes 3",
      privateHospital: "Rumah Sakit Swasta",
      privatePractice: "Praktik Mandiri",
    },
    contactTypes: {
      application: "Aplikasi",
      email: "Email",
      instagram: "Instagram",
      phone: "Telepon",
      website: "Website",
      whatsapp: "WhatsApp",
    },
    pages: {
      professional: {
        heroTitleB: "Konseling",
        heroTitleA: " Profesional",
        heroLead:
          "Temukan psikolog, psikiater, dan klinik kesehatan mental berlisensi di Indonesia yang siap mendampingi Anda. 🌟",
      },
      peer: {
        heroTitleB: "Konseling",
        heroTitleA: "Sebaya & Kelompok",
        heroLead:
          "Terhubung dengan konselor sebaya dan kelompok dukungan untuk berbagi pengalaman dan saling menguatkan. 🤝",
      },
      stressRelief: {
        heroTitleA: "Aktivitas",
        heroTitleB: "Stress Relief",
        heroLead: "Jelajahi berbagai aktivitas untuk membantu Anda rileks dan mengurangi stres.",
      },
      organizations: {
        heroTitleB: "Direktori",
        heroTitleA: "Organisasi & Komunitas",
        heroLead:
          "Temukan organisasi dan komunitas kesehatan mental di sekitar Anda. Terhubung dengan orang lain dan dapatkan dukungan untuk berkembang. 🤝",
      },
    },
    seo: {
      home: {
        title: "Direktori Kesehatan Mental Indonesia — Psikolog, Psikiater & Konseling",
        description:
          "Direktori gratis psikolog, psikiater, konselor sebaya, kelompok dukungan, dan aktivitas wellness terverifikasi di seluruh Indonesia.",
      },
      professional: {
        title: "Cari Psikolog, Psikiater & Konseling Online di Indonesia",
        description:
          "Direktori psikolog, psikiater, dan klinik kesehatan mental terverifikasi di Indonesia. Filter berdasarkan kota, spesialisasi, asuransi (termasuk BPJS), dan mode sesi.",
      },
      peer: {
        title: "Konseling Sebaya & Kelompok Dukungan di Indonesia",
        description:
          "Terhubung dengan konselor sebaya dan kelompok dukungan kesehatan mental di Indonesia untuk berbagi pengalaman dan saling menguatkan.",
      },
      stressRelief: {
        title: "Aktivitas Pereda Stres & Kesehatan Mental di Indonesia",
        description:
          "Terapi seni, musik, olahraga, dan aktivitas wellness di Indonesia untuk membantu Anda rileks, mengurangi stres, dan meningkatkan kesejahteraan mental.",
      },
      organizations: {
        title: "Organisasi & Komunitas Kesehatan Mental di Indonesia",
        description:
          "Jelajahi organisasi, komunitas, dan kelompok advokasi kesehatan mental di Indonesia yang mendukung dan meningkatkan kesadaran akan kesehatan mental.",
      },
      about: {
        title: "Tentang Direktori Kesehatan Mental Indonesia",
        description:
          "Pelajari tentang Direktori Kesehatan Mental Indonesia — panduan gratis dan komprehensif untuk menemukan psikolog, konseling sebaya, dan sumber daya kesehatan mental di Indonesia.",
      },
    },
    footer: {
      description:
        "Direktori informasi kesehatan mental kamu. Menghubungkan kamu dengan psikolog, psikiater, dan klinik kesehatan mental di seluruh Indonesia.",
      copyright: "© 2025 Elysium Mentalcare. Made with ❤️ for mental wellness.",
    },
    home: {
      hero: {
        title1: "Mental Health",
        title2: "Resource Directory",
        subtitle: "Teman terpercaya kamu dalam menemukan sumber daya dan dukungan kesehatan mental yang berkualitas.",
      },
      feelings: {
        title: "Bagaimana perasaan kamu hari ini?",
        cta: "Dapatkan Rekomendasi Personal",
        analyzing: "Menganalisis...",
        recommendationsTitle: "Rekomendasi Personal untuk kamu",
      },
      toast: {
        shareFeelings: "Silakan ceritakan perasaan kamu",
        recommendationsReady: "Rekomendasi Siap",
        analysisFailed: "Analisis Gagal",
      },
      sectionHeading: {
        professional: "Konseling Profesional",
        clinics: "Klinik & Rumah Sakit",
        peer: "Konseling Sebaya & Kelompok Dukungan",
        stressRelief: "Aktivitas Stress Relief",
        organizations: "Organisasi & Komunitas",
      },
      comingSoon: "Segera Hadir",
      fallback: {
        unknownCity: "Kota Tidak Diketahui",
        addressUnavailable: "Alamat tidak tersedia",
      },
      sections: {
        professional: {
          title: "Konseling Profesional",
          description:
            "Temukan profesional kesehatan mental berlisensi — psikolog, psikiater, dan klinik yang siap mendampingi Anda.",
          cta: "Cari & Filter",
        },
        peer: {
          title: "Konseling Sebaya",
          description: "Terhubung dengan konselor sebaya dan kelompok dukungan yang peduli.",
          cta: "Cari Dukungan Sebaya",
        },
        stressRelief: {
          title: "Pereda Stres",
          description: "Temukan program bantuan diri dan kesejahteraan yang mendukung kesehatan mental Anda.",
          cta: "Cari Aktivitas",
        },
        organizations: {
          title: "Organisasi",
          description: "Terhubung dengan komunitas dan temukan sumber daya yang membantu pertumbuhan Anda.",
          ctaRecent: "Organisasi & Komunitas Terbaru",
          ctaAll: "Semua Organisasi & Komunitas",
        },
        about: {
          title: "Tentang Mental Health Directory",
          subtitle: "Panduan komprehensif untuk sumber daya dan dukungan kesehatan mental di Indonesia.",
          q1: "Apa itu Mental Health Directory?",
          q2: "Informasi apa yang akan disediakan Mental Health Directory?",
          a1: "Mental Health Directory adalah platform komprehensif yang dirancang untuk membantu individu menemukan profesional kesehatan mental, kelompok dukungan, dan sumber daya kesejahteraan yang berkualitas di seluruh Indonesia. Kami menjadi jembatan antara mereka yang mencari bantuan dan profesional yang berkualitas, dengan menyediakan informasi rinci tentang spesialisasi, akomodasi, pusat konseling, dan berbagai Layanan Konseling Profesional.",
          professionalTitle: "Layanan Konseling Profesional",
          professionalDesc:
            "Psikolog, psikiater, dan klinik kesehatan mental berlisensi dengan profil terperinci, spesialisasi, dan informasi kontak.",
          peerTitle: "Konseling Sebaya & Kelompok",
          peerBadge: "Segera Hadir",
          peerDesc:
            "Kelompok dukungan berbasis komunitas dan layanan konseling sebaya untuk berbagai kondisi kesehatan mental dan tantangan kehidupan.",
          stressReliefTitle: "Aktivitas Pereda Stres",
          stressReliefBadge: "Segera Hadir",
          stressReliefDesc:
            "Terapi seni, terapi musik, aktivitas olahraga, dan program kesejahteraan lainnya yang dirancang untuk meningkatkan kesehatan mental.",
          organizationsTitle: "Organisasi",
          organizationsBadge: "Segera Hadir",
          organizationsDesc:
            "Organisasi kesehatan mental, lembaga pendidikan, dan kelompok komunitas yang berdedikasi pada kesadaran dan dukungan kesehatan mental.",
        },
      },
    },
    detail: {
      back: "Kembali",
      home: "Beranda",
      practitionerDetails: "Detail Praktisi",
      bureauDetails: "Detail Institusi",
      type: "Tipe",
      loading: "Memuat...",
      notFound: "Tidak ditemukan",
      error: "Terjadi kesalahan. Silakan coba lagi.",
      experience: "Pengalaman",
      education: "Pendidikan",
      licenseNumber: "Nomor Lisensi",
      lastUpdated: "Terakhir diperbarui",
      professionTypes: "Tipe Profesi",
      specializations: "Spesialisasi",
      sessionModes: "Mode Sesi",
      insurance: "Asuransi",
      services: "Layanan",
      contactInfo: "Informasi Kontak",
      locations: "Lokasi",
      noContactInfo: "Tidak ada informasi kontak",
      noServices: "Tidak ada layanan tersedia",
      book: "Pesan",
      learnMore: "Pelajari Lebih Lanjut",
      showAll: "Tampilkan semua",
      showLess: "Tampilkan lebih sedikit",
      practitioners: "Praktisi",
      noInsurance: "Tanpa Asuransi",
      privateInsurance: "Asuransi Pribadi",
      ourServices: "Layanan Kami",
      ourPractitioners: "Praktisi Kami",
      searchServices: "Cari layanan...",
      noServicesMatch: "Tidak ada layanan yang sesuai dengan filter.",
      includePriceUponRequest: "Termasuk harga sesuai permintaan",
      priceUponRequest: "Harga tersedia sesuai permintaan",
      free: "Gratis",
      bookNow: "Pesan Sekarang",
      activeFiltersLabel: "Filter aktif:",
    },
    filters: {
      activeFilters: "Filter Aktif",
      clearAll: "Hapus semua",
      clearFilters: "Hapus Filter",
      noResults: "Tidak ada hasil ditemukan",
      noActivities: "Tidak ada aktivitas yang sesuai dengan kriteria Anda.",
      loadMore: "Muat Lebih Banyak",
      city: "Kota",
      institution: "Institusi",
      institutionType: "Tipe Institusi",
      profession: "Profesi",
      specialization: "Spesialisasi",
      sessionMode: "Mode Sesi",
      priceRange: "Rentang Harga (IDR)",
      insurance: "Asuransi",
      sessionCost: "Biaya Sesi (IDR)",
      loadMoreCount: "Muat Lebih Banyak",
    },
    about: {
      hero: {
        title1: "Tentang",
        title2: "Mental Health Directory",
        subtitle: "Panduan lengkap sumber daya dan dukungan kesehatan mental di Indonesia",
      },
      what: {
        title: "Apa itu Mental Health Directory?",
        p1: "Mental Health Directory adalah platform komprehensif yang dirancang untuk membantu kamu menemukan profesional, kelompok dukungan, dan sumber daya kesehatan mental di seluruh Indonesia. Kami memahami bahwa mencari dukungan kesehatan mental bisa terasa berat, dan misi kami adalah menjadikan proses ini lebih mudah dan terjangkau bagi semua orang.",
        p2: "Platform kami menjadi jembatan antara mereka yang mencari bantuan dengan para profesional berkualifikasi, menyediakan informasi lengkap tentang psikolog, psikiater, pusat konseling, dan berbagai layanan dukungan kesehatan mental di area kamu.",
      },
      info: {
        title: "Informasi apa yang akan dicakup Mental Health Directory?",
        professional: {
          title: "Layanan Konseling Profesional",
          desc: "Psikolog, psikiater, dan klinik kesehatan mental berlisensi dengan profil lengkap, spesialisasi, dan informasi kontak.",
        },
        peer: {
          title: "Konseling Sebaya & Kelompok",
          desc: "Kelompok dukungan berbasis komunitas dan layanan konseling sebaya untuk berbagai kondisi kesehatan mental dan tantangan kehidupan.",
        },
        stressRelief: {
          title: "Aktivitas Penghilang Stres",
          desc: "Terapi seni, terapi musik, olahraga, dan program lainnya yang dirancang untuk meningkatkan kesehatan mental.",
        },
        organizations: {
          title: "Organisasi",
          desc: "Organisasi kesehatan mental, lembaga pendidikan, dan kelompok komunitas yang berdedikasi pada kesadaran dan dukungan kesehatan mental.",
        },
      },
      contribute: {
        title: "Bagaimana cara saya berkontribusi pada proyek ini?",
        intro:
          "Kami percaya pada kekuatan komunitas dan menyambut kontribusi dari para profesional kesehatan mental, organisasi, dan individu yang peduli pada advokasi kesehatan mental.",
        professionals: {
          title: "Profesional Kesehatan Mental",
          desc: "Bergabunglah dengan direktori kami untuk membantu lebih banyak orang menemukan dukungan yang mereka butuhkan",
        },
        organizations: {
          title: "Organisasi",
          desc: "Bermitra dengan kami untuk memperluas sumber daya dan kesadaran kesehatan mental",
        },
        community: {
          title: "Anggota Komunitas",
          desc: "Bagikan masukan, sarankan perbaikan, atau bantu menyebarkan informasi",
        },
      },
      contact: {
        title: "Informasi Kontak",
        email: "Email",
        phone: "Telepon",
        followInstagram: "Ikuti kami di Instagram",
        instagramDesc: "Tetap terkini dengan sumber daya terbaru dan tips kesehatan mental kami",
      },
    },
    peerDetail: {
      notFound: "Informasi Tidak Ditemukan",
      notFoundDesc: "Informasi yang kamu cari tidak ada.",
      about: "Tentang",
      specialization: "Spesialisasi",
      additionalInfo: "Informasi Tambahan",
      schedule: "Jadwal",
      groupSize: "Ukuran Kelompok",
      facilitator: "Fasilitator",
      languages: "Bahasa",
      contactInfo: "Informasi Kontak",
      address: "Alamat",
      phone: "Telepon",
      email: "Email",
      website: "Website",
      instagram: "Instagram",
      getSupport: "Dapatkan Dukungan",
      followDesc: "Ikuti kami untuk pembaruan dan tips kesehatan mental",
    },
    organizationDetail: {
      notFound: "Organisasi Tidak Ditemukan",
      notFoundDesc: "Organisasi yang kamu cari tidak ada.",
      about: "Tentang",
      organizationType: "Tipe Organisasi",
      contactInfo: "Informasi Kontak",
      address: "Alamat",
      phone: "Telepon",
      email: "Email",
      website: "Website",
      instagram: "Instagram",
      getInTouch: "Hubungi Kami",
      followDesc: "Ikuti kami untuk pembaruan dan wawasan terbaru",
    },
    organizations: {
      browse: "Telusuri Organisasi & Komunitas",
      all: "Semua Organisasi & Komunitas",
    },
    peerCounseling: {
      findPeerSupport: "Cari Dukungan Sebaya",
    },
    stressRelief: {
      findActivities: "Cari Aktivitas",
      noActivities: "Tidak ada aktivitas yang sesuai dengan kriteria kamu.",
    },
    notFound: {
      title: "Ups! Halaman tidak ditemukan",
      return: "Kembali ke Beranda",
    },
    phoneDialog: {
      title: "Hubungi nomor ini",
      description:
        "Panggilan telepon tidak dapat dilakukan langsung dari browser desktop. Silakan hubungi nomor ini dari ponsel kamu.",
      copy: "Salin",
      copied: "Tersalin",
      copiedToast: "Nomor telepon tersalin",
      copyFailed: "Gagal menyalin",
    },
    errors: {
      somethingWrong: "Terjadi Kesalahan",
      unexpected: "Maaf, terjadi sesuatu yang tidak terduga. Silakan coba muat ulang halaman.",
      tryAgain: "Coba Lagi",
      refresh: "Muat Ulang Halaman",
    },
  },
};
