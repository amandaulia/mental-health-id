import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PractitionerHeader } from "@/components/PractitionerHeader";
import { PractitionerServices } from "@/components/PractitionerServices";
import { PractitionerContact } from "@/components/PractitionerContact";
import { PractitionerLocations } from "@/components/PractitionerLocations";
import { usePractitioner, useServicesByPractitioner, useContactDetailsByPractitioner, useLocationsByPractitioner } from "@/hooks/useDatabase";
import { transformPractitioner, transformService, transformContactDetails } from "@/utils/dataTransform";
import { useEffect, useState } from "react";
import { Practitioner } from "@/types";
import { trackError } from "@/utils/analytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageSEO } from "@/components/PageSEO";

const PractitionerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  
  const practitionerId = parseInt(id || "0");
  const { data: dbPractitioner, isLoading: practitionerLoading, error: practitionerError } = usePractitioner(practitionerId);
  const { data: dbServices, isLoading: servicesLoading } = useServicesByPractitioner(practitionerId);
  const { data: dbContactDetails, isLoading: contactLoading } = useContactDetailsByPractitioner(practitionerId);
  const { data: dbLocations, isLoading: locationsLoading } = useLocationsByPractitioner(practitionerId);

  useEffect(() => {
    if (dbPractitioner && dbServices && dbContactDetails) {
      const transformedServices = dbServices.map(transformService);
      const transformedContactDetails = transformContactDetails(dbContactDetails);
      
      setPractitioner(transformPractitioner(dbPractitioner, transformedServices, transformedContactDetails));
    }
  }, [dbPractitioner, dbServices, dbContactDetails]);

  useEffect(() => {
    if (dbLocations) {
      const validLocations = (dbLocations as any[]).filter((loc: any) => 
        loc && typeof loc === 'object' && loc.id && loc.name && !loc.error
      );
      const transformedLocations = validLocations.map((loc: any) => ({
        id: loc.id.toString(),
        name: loc.name || "Unnamed Location", 
        address: loc.address || "Address not available",
        city: loc.city || "Unknown City",
        province: loc.province || "Unknown Province",
        country: loc.country || "Unknown Country"
      }));
      setLocations(transformedLocations);
    }
  }, [dbLocations]);

  useEffect(() => {
    if (practitionerError) {
      trackError(
        'Data Loading Error',
        'Failed to load practitioner details',
        `Practitioner ID: ${practitionerId}`
      );
    }
  }, [practitionerError, practitionerId]);

  if (practitionerLoading || servicesLoading || contactLoading || locationsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t('detail.loading')}</div>
      </div>
    );
  }

  if (practitionerError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          {t('detail.error')}
        </div>
      </div>
    );
  }

  if (!practitioner) {
    return <div className="container mx-auto px-4 py-8">{t('detail.notFound')}</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "text": return t('sessionModes.textChat');
      case "voice": return t('sessionModes.voiceCall');
      case "video": return t('sessionModes.videoCall');
      case "offline": return t('sessionModes.offlineSession');
      default: return mode;
    }
  };

  const getInsuranceLabel = (ins: string) => {
    switch (ins) {
      case "none": return t('insurance.noInsurance');
      case "PRIVATE": return t('insurance.privateInsurance');
      case "BPJS": return "BPJS";
      default: return ins;
    }
  };

  const handleTagClick = (type: string, value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(type, value);
    navigate(`/?${searchParams.toString()}`);
  };

  const handleBureauClick = () => {
    navigate(`/bureau/${practitioner.bureauId}`);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <PageSEO
        pageKey="practitioner"
        path={`/practitioner/${practitionerId}`}
        title={`${practitioner.name} — ${practitioner.professionTypes?.[0] || t('detail.practitionerDetails')}${locations[0]?.city ? ' di ' + locations[0].city : ''} | Direktori Kesehatan Mental Indonesia`}
        description={`Profil ${practitioner.name}${practitioner.professionTypes?.[0] ? ', ' + practitioner.professionTypes[0] : ''}${locations[0]?.city ? ' di ' + locations[0].city : ''}. Lihat layanan, biaya, asuransi, dan kontak konseling.`}
      />
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{t('detail.home')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('detail.practitionerDetails')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('detail.back')}
          </Button>
        </div>

        <PractitionerHeader
          practitioner={practitioner}
          onTagClick={handleTagClick}
          onBureauClick={handleBureauClick}
          getModeLabel={getModeLabel}
          getInsuranceLabel={getInsuranceLabel}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PractitionerServices
              practitioner={practitioner}
              formatPrice={formatPrice}
              getModeLabel={getModeLabel}
            />
          </div>

          <div className="space-y-6">
            <PractitionerContact practitioner={practitioner} />
            <PractitionerLocations locations={locations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PractitionerDetail;
