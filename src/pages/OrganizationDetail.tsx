import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Instagram } from "lucide-react";
import { PhoneCallButton } from "@/components/PhoneCallButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageSEO } from "@/components/PageSEO";
import { databaseService } from "@/services/database";

const OrganizationDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
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

  const locations = (data.organization_locations || [])
    .map((rel: any) => rel.location)
    .filter(Boolean);
  const primaryLocation = locations[0];
  const city = primaryLocation?.city || "";
  const address = primaryLocation?.address || "";

  const contacts = (data.organization_contacts || [])
    .map((rel: any) => rel.contact_details)
    .filter(Boolean);
  const findContact = (type: string) =>
    contacts.find((c: any) => c.contact_type?.toLowerCase() === type.toLowerCase());
  const phone = findContact("Phone") || findContact("WhatsApp");
  const email = findContact("Email");
  const website = findContact("Website");
  const instagram = findContact("Instagram");

  const orgType = data.specialization?.[0] || "";
  const fallbackImage =
    "https://images.unsplash.com/photo-1486312338219-ce68e2c77734?w=800&h=400&fit=crop";

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

      <div className="mb-8">
        <div className="aspect-[21/9] overflow-hidden rounded-xl">
          <img src={data.image || fallbackImage} alt={data.name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{data.name}</h1>
              {orgType && <Badge className={getTypeColor(orgType)}>{orgType}</Badge>}
            </div>
            {city && (
              <div className="flex items-center gap-1 text-muted-foreground mb-6">
                <MapPin className="h-4 w-4" />
                <span>{city}</span>
              </div>
            )}
          </div>

          {data.description && (
            <Card>
              <CardHeader>
                <CardTitle>{t("organizationDetail.about")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{data.description}</p>
              </CardContent>
            </Card>
          )}

          {data.specialization && data.specialization.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("organizationDetail.organizationType")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.specialization.map((s: string) => (
                    <Badge key={s} className={`text-base px-4 py-2 ${getTypeColor(s)}`}>{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("organizationDetail.contactInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("organizationDetail.address")}</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("organizationDetail.phone")}</p>
                    <PhoneCallButton phone={phone.value} asLink />
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("organizationDetail.email")}</p>
                    <a href={`mailto:${email.value}`} className="text-sm text-primary hover:text-primary-hover">{email.value}</a>
                  </div>
                </div>
              )}
              {website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("organizationDetail.website")}</p>
                    <a href={website.link || website.value} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">{t("common.visitWebsite")}</a>
                  </div>
                </div>
              )}
              {instagram && (
                <div className="flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("organizationDetail.instagram")}</p>
                    <a href={instagram.link || `https://instagram.com/${instagram.value.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">{instagram.value}</a>
                  </div>
                </div>
              )}
              {!address && !phone && !email && !website && !instagram && (
                <p className="text-sm text-muted-foreground">No contact information available.</p>
              )}
            </CardContent>
          </Card>

          {(phone || email || website) && (
            <Card>
              <CardHeader>
                <CardTitle>{t("organizationDetail.getInTouch")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {phone && <PhoneCallButton phone={phone.value} className="w-full" />}
                {email && (
                  <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:${email.value}`)}>
                    <Mail className="h-4 w-4 mr-2" />
                    {t("organizationDetail.email")}
                  </Button>
                )}
                {website && (
                  <Button variant="outline" className="w-full" onClick={() => window.open(website.link || website.value, "_blank", "noopener,noreferrer")}>
                    <Globe className="h-4 w-4 mr-2" />
                    {t("common.visitWebsite")}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail;
