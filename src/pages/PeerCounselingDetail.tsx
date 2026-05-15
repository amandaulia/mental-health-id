import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Instagram, MessageCircle } from "lucide-react";
import { PhoneCallButton } from "@/components/PhoneCallButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageSEO } from "@/components/PageSEO";
import { databaseService } from "@/services/database";

const PeerCounselingDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const numericId = id ? Number(id) : NaN;

  const { data, isLoading } = useQuery({
    queryKey: ["peer-counseling", numericId],
    queryFn: () => databaseService.getPeerCounselingById(numericId),
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
          <h1 className="text-2xl font-bold mb-4">{t("peerDetail.notFound")}</h1>
          <p className="text-muted-foreground">{t("peerDetail.notFoundDesc")}</p>
          <Button onClick={() => window.history.back()} className="mt-4">
            {t("common.goBack")}
          </Button>
        </div>
      </div>
    );
  }

  const locations = (data.peer_counseling_locations || [])
    .map((rel: any) => rel.location)
    .filter(Boolean);
  const primaryLocation = locations[0];
  const city = primaryLocation?.city || "";
  const address = primaryLocation?.address || "";

  const contacts = (data.peer_counseling_contacts || [])
    .map((rel: any) => rel.contact_details)
    .filter(Boolean);
  const findContact = (type: string) =>
    contacts.find((c: any) => c.contact_type?.toLowerCase() === type.toLowerCase());

  const phone = findContact("Phone") || findContact("WhatsApp");
  const email = findContact("Email");
  const website = findContact("Website");
  const instagram = findContact("Instagram");

  const peerType = data.peer_type?.[0] || "Peer Counseling";
  const specialization = data.specialization?.[0] || "";
  const fallbackImage =
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop";

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        pageKey="peer"
        path={`/peer-counseling/${id}`}
        title={`${data.name}${city ? " — " + city : ""} | Konseling Sebaya & Kelompok Dukungan`}
        description={`${data.name}${specialization ? " — " + specialization : ""}. Konseling sebaya dan kelompok dukungan kesehatan mental${city ? " di " + city : ""}.`}
      />

      <div className="mb-8">
        <div className="aspect-[21/9] overflow-hidden rounded-xl">
          <img
            src={data.image || fallbackImage}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{data.name}</h1>
              <Badge variant={peerType === "Peer Counseling" ? "default" : "secondary"} className="shrink-0">
                {peerType}
              </Badge>
            </div>
            {(city || specialization) && (
              <div className="flex items-center gap-4 text-muted-foreground mb-6">
                {city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{city}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {specialization && (
            <Card>
              <CardHeader>
                <CardTitle>{t("peerDetail.specialization")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(data.specialization || []).map((s: string) => (
                    <Badge key={s} variant="outline" className="text-base px-4 py-2">
                      {s}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {data.tags && data.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("peerDetail.contactInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("peerDetail.address")}</p>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("peerDetail.phone")}</p>
                    <PhoneCallButton phone={phone.value} asLink />
                  </div>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("peerDetail.email")}</p>
                    <a href={`mailto:${email.value}`} className="text-sm text-primary hover:text-primary-hover">
                      {email.value}
                    </a>
                  </div>
                </div>
              )}
              {website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("peerDetail.website")}</p>
                    <a href={website.link || website.value} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
                      {t("common.visitWebsite")}
                    </a>
                  </div>
                </div>
              )}
              {instagram && (
                <div className="flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{t("peerDetail.instagram")}</p>
                    <a href={instagram.link || `https://instagram.com/${instagram.value.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
                      {instagram.value}
                    </a>
                  </div>
                </div>
              )}
              {!phone && !email && !website && !instagram && !address && (
                <p className="text-sm text-muted-foreground">No contact information available.</p>
              )}
            </CardContent>
          </Card>

          {(phone || email || website) && (
            <Card>
              <CardHeader>
                <CardTitle>{t("peerDetail.getSupport")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {phone && <PhoneCallButton phone={phone.value} className="w-full" />}
                {email && (
                  <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:${email.value}`)}>
                    <Mail className="h-4 w-4 mr-2" />
                    {t("peerDetail.email")}
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

export default PeerCounselingDetail;
