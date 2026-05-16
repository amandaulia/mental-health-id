import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Instagram, MessageCircle, ExternalLink } from "lucide-react";
import { PhoneCallButton } from "@/components/PhoneCallButton";
import { BureauLocations } from "@/components/BureauLocations";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageSEO } from "@/components/PageSEO";
import { databaseService } from "@/services/database";
import clinicPlaceholder from "@/assets/clinic-placeholder.png";
import { safeImageSrc } from "@/utils/imageUrl";

const getContactIcon = (type: string) => {
  switch (type) {
    case "WhatsApp": return MessageCircle;
    case "Phone": return Phone;
    case "Website": return Globe;
    case "Instagram": return Instagram;
    case "Email": return Mail;
    default: return ExternalLink;
  }
};

const OrganizationDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = id ? Number(id) : NaN;

  const { data, isLoading } = useQuery({
    queryKey: ["organization", numericId],
    queryFn: () => databaseService.getOrganizationById(numericId),
    enabled: !isNaN(numericId),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        {t("common.loading") || "Loading..."}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("organizationDetail.notFound")}</h1>
          <p className="text-muted-foreground">{t("organizationDetail.notFoundDesc")}</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            {t("common.goBack")}
          </Button>
        </div>
      </div>
    );
  }

  const rawLocations = (data.organization_locations || [])
    .map((rel: any) => rel.location)
    .filter(Boolean);
  const locations = rawLocations.map((loc: any) => ({
    id: String(loc.id),
    name: loc.name || "",
    address: loc.address || "",
    city: loc.city || "",
    province: loc.province || "",
    country: loc.country || "",
  }));
  const primaryLocation = rawLocations[0];
  const city = primaryLocation?.city || "";

  const contacts = (data.organization_contacts || [])
    .map((rel: any) => rel.contact_details)
    .filter(Boolean);

  const specializations: string[] = data.specialization || [];
  const orgType = specializations[0] || "";

  const getTypeColor = (type: string) => {
    switch ((type || "").toLowerCase()) {
      case "education": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "experience": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "community": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        pageKey="organizations"
        path={`/organizations/${id}`}
        title={`${data.name}${city ? " — " + city : ""} | Organisasi & Komunitas Kesehatan Mental`}
        description={`${data.name} — organisasi/komunitas kesehatan mental${city ? " di " + city : ""}${orgType ? " (" + orgType + ")" : ""}.`}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb + Back */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">{t("detail.home")}</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="outline" onClick={() => navigate("/organizations")} className="flex items-center gap-2 w-fit">
            <ArrowLeft className="h-4 w-4" />
            {t("detail.back")}
          </Button>
        </div>

        {/* Header card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <img
                  src={safeImageSrc(data.image) || clinicPlaceholder}
                  alt={data.name}
                  className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = clinicPlaceholder; }}
                />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold">{data.name}</h1>
                    {data.verified && (
                      <Badge className="bg-green-100 text-green-700">{t("common.verified")}</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specializations.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium text-sm">{t("organizationDetail.organizationType")}</p>
                        <div className="flex flex-wrap gap-2">
                          {specializations.map((s) => (
                            <Badge key={s} className={`text-xs ${getTypeColor(s)}`}>{s}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {city && (
                      <div className="space-y-2">
                        <p className="font-medium text-sm">{t("detail.location") || "Location"}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{city}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {data.last_updated_at && (
                <div className="text-sm text-muted-foreground flex-shrink-0">
                  {t("detail.lastUpdated")}: {new Date(data.last_updated_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Body grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {data.description && (
              <Card>
                <CardHeader><CardTitle>{t("organizationDetail.about")}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{data.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>{t("detail.contactInfo")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {contacts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">{t("detail.noContactInfo")}</p>
                ) : contacts.map((c: any, i: number) => {
                  const Icon = getContactIcon(c.contact_type);
                  const isPhone = c.contact_type === "Phone";
                  const href = c.link || (c.contact_type === "Email" ? `mailto:${c.value}` : c.contact_type === "Instagram" ? `https://instagram.com/${(c.value || "").replace(/^@/, "")}` : null);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{c.contact_type}</p>
                        {isPhone ? (
                          <PhoneCallButton phone={c.value} asLink>{c.value}</PhoneCallButton>
                        ) : href ? (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">{c.value}</a>
                        ) : (
                          <p className="text-sm">{c.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <BureauLocations locations={locations} bureauName={data.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail;
