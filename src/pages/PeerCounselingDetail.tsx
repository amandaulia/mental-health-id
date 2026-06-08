import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Instagram, MessageCircle, ExternalLink, Search } from "lucide-react";
import { PhoneCallButton } from "@/components/PhoneCallButton";
import { BureauLocations } from "@/components/BureauLocations";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageSEO } from "@/components/PageSEO";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { databaseService } from "@/services/database";
import { getPlaceholderImage } from "@/utils/placeholderImage";
import {
  SITE_URL,
  buildPostalAddress,
  buildGeo,
  phoneFromContacts,
  sameAsFromContacts,
  buildBreadcrumbList,
} from "@/utils/jsonLd";

const clinicPlaceholder = getPlaceholderImage("peer-counseling");
const practitionerPlaceholder = getPlaceholderImage("practitioner");

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

const PeerCounselingDetail = () => {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = id ? Number(id) : NaN;

  const { data, isLoading } = useQuery({
    queryKey: ["peer-counseling", numericId],
    queryFn: () => databaseService.getPeerCounselingById(numericId),
    enabled: !isNaN(numericId),
  });

  const rawLocations = (data?.peer_counseling_locations || [])
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

  const contacts = (data?.peer_counseling_contacts || [])
    .map((rel: any) => rel.contact_details)
    .filter(Boolean);

  const institutions = (data?.institution_peer_counselings || [])
    .map((rel: any) => rel.institution)
    .filter(Boolean);

  const counselors = (data?.practitioner_peer_counselings || [])
    .map((rel: any) => rel.practitioner)
    .filter((p: any) => Array.isArray(p?.profession_type) && p.profession_type.includes("Counselor"));

  const services = (() => {
    const map = new Map<number, any>();
    counselors.forEach((p: any) => {
      (p.practitioner_services || []).forEach((rel: any) => {
        const s = rel.service;
        if (s && !map.has(s.id)) {
          map.set(s.id, { ...s, _practitionerName: p.name, _practitionerId: p.id });
        }
      });
    });
    return Array.from(map.values());
  })();

  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceMode, setServiceMode] = useState<string[]>([]);

  const serviceModeOptions = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s: any) => {
      (s.session_mode || []).forEach((m: string) => m && set.add(m));
    });
    return Array.from(set).sort();
  }, [services]);

  const filteredServices = useMemo(() => {
    const q = serviceSearch.trim().toLowerCase();
    return services.filter((s: any) => {
      if (q && !(s.name || "").toLowerCase().includes(q)) return false;
      if (serviceMode.length > 0) {
        const modes: string[] = Array.isArray(s.session_mode) ? s.session_mode : [];
        if (!serviceMode.some((m) => modes.includes(m))) return false;
      }
      return true;
    });
  }, [services, serviceSearch, serviceMode]);

  const [counselorSearch, setCounselorSearch] = useState("");
  const [counselorSpec, setCounselorSpec] = useState<string[]>([]);

  const counselorSpecOptions = useMemo(() => {
    const set = new Set<string>();
    counselors.forEach((p: any) => {
      (p.specialization || []).forEach((s: string) => s && set.add(s));
    });
    return Array.from(set).sort();
  }, [counselors]);

  const filteredCounselors = useMemo(() => {
    const q = counselorSearch.trim().toLowerCase();
    return counselors.filter((p: any) => {
      if (q && !(p.name || "").toLowerCase().includes(q)) return false;
      if (counselorSpec.length > 0) {
        const specs: string[] = Array.isArray(p.specialization) ? p.specialization : [];
        if (!counselorSpec.some((s) => specs.includes(s))) return false;
      }
      return true;
    });
  }, [counselors, counselorSearch, counselorSpec]);

  const peerTypes: string[] = data?.peer_type || [];
  const specializations: string[] = data?.specialization || [];
  const tags: string[] = data?.tags || [];

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

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        pageKey="peer"
        path={`/peer-counseling/${id}`}
        title={`${data.name}${city ? " — " + city : ""} | Konseling Sebaya & Kelompok Dukungan`}
        description={`${data.name}${specializations[0] ? " — " + specializations[0] : ""}. Konseling sebaya dan kelompok dukungan kesehatan mental${city ? " di " + city : ""}.`}
        jsonLd={(() => {
          const pageUrl = `${SITE_URL}/peer-counseling/${id}`;
          const primary = primaryLocation;
          const transformedContacts = contacts.map((c: any) => ({
            type: c.type,
            value: c.value,
            link: c.link,
          }));
          const phone = phoneFromContacts(transformedContacts as any);
          const sameAs = sameAsFromContacts(transformedContacts as any);
          const serviceNode: Record<string, unknown> = {
            "@type": "MedicalBusiness",
            "@id": `${pageUrl}#business`,
            name: data.name,
            url: pageUrl,
            ...(data.image && { image: data.image }),
            ...(phone && { telephone: phone }),
            ...(buildPostalAddress(primary) && { address: buildPostalAddress(primary) }),
            ...(buildGeo(primary) && { geo: buildGeo(primary) }),
            ...(specializations.length && { medicalSpecialty: specializations }),
            ...(sameAs.length && { sameAs }),
            ...(city && { areaServed: city }),
          };
          const breadcrumbNode = buildBreadcrumbList([
            { name: t("detail.home"), path: "/" },
            { name: t("nav.peerCounseling") || "Peer Counseling", path: "/peer-counseling" },
            { name: data.name, path: `/peer-counseling/${id}` },
          ]);
          return [serviceNode, breadcrumbNode];
        })()}
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
          <Button variant="outline" onClick={() => navigate("/peer-counseling")} className="flex items-center gap-2 w-fit">
            <ArrowLeft className="h-4 w-4" />
            {t("detail.back")}
          </Button>
        </div>

        {/* Header card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <ImageWithFallback
                  src={data.image}
                  fallbackSrc={clinicPlaceholder}
                  alt={data.name}
                  className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold">{data.name}</h1>
                    {data.verified && (
                      <Badge className="bg-green-100 text-green-700">{t("common.verified")}</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {peerTypes.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-medium text-sm">{t("detail.type") || "Type"}</p>
                        <div className="flex flex-wrap gap-2">
                          {peerTypes.map((pt) => (
                            <Badge key={pt} variant="outline" className="text-xs">{pt}</Badge>
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
                  {specializations.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">{t("detail.specializations")}</p>
                      <div className="flex flex-wrap gap-2">
                        {specializations.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
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

        {/* Hosted By — directly under the name */}
        {institutions.length > 0 && (
          <Card>
            <CardHeader><CardTitle>{t("peerDetail.hostedBy") || "Hosted By"}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                {institutions.map((inst: any) => (
                  <Link
                    key={inst.id}
                    to={`/bureau/${inst.id}`}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <ImageWithFallback
                      src={inst.image}
                      fallbackSrc={clinicPlaceholder}
                      alt={inst.name}
                      className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                    />
                    <span className="font-medium text-sm">{inst.name}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Body grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {data.description && (
              <Card>
                <CardHeader><CardTitle>{t("peerDetail.about")}</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{data.description}</p>
                </CardContent>
              </Card>
            )}

            {tags.length > 0 && (
              <Card>
                <CardHeader><CardTitle>{t('common.tags')}</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {services.length > 0 && (
              <Card>
                <CardHeader><CardTitle>{t('detail.services')} ({services.length})</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        placeholder="Search services by name"
                        className="pl-9"
                      />
                    </div>
                    {serviceModeOptions.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {serviceModeOptions.map((m) => (
                          <div key={m} className="flex items-center gap-1.5">
                            <Checkbox
                              id={`service-mode-${m}`}
                              checked={serviceMode.includes(m)}
                              onCheckedChange={(checked) => {
                                setServiceMode((prev) =>
                                  checked ? [...prev, m] : prev.filter((x) => x !== m)
                                );
                              }}
                            />
                            <Label htmlFor={`service-mode-${m}`} className="text-sm cursor-pointer">{m}</Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {filteredServices.map((s: any) => (
                      <div key={s.id} className="p-3 rounded-md border">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{s.name}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                              {s.duration != null && (
                                <span>{s.duration} {t('common.minutes') || 'min'}</span>
                              )}
                              {Array.isArray(s.session_mode) && s.session_mode.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {s.session_mode.map((m: string) => (
                                    <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <p
                            className={
                              s.price == null
                                ? "text-xs text-muted-foreground italic"
                                : "font-medium text-primary text-sm"
                            }
                          >
                            {s.price == null
                              ? t('detail.priceUponRequest')
                              : Number(s.price) === 0
                              ? t('detail.free')
                              : `Rp ${Number(s.price).toLocaleString('id-ID')}`}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filteredServices.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {t("common.noResults") || "No results found"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {counselors.length > 0 && (
              <Card>
                <CardHeader><CardTitle>{t("peerDetail.counselors") || "Counselors"}</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={counselorSearch}
                        onChange={(e) => setCounselorSearch(e.target.value)}
                        placeholder="Search counselors by name"
                        className="pl-9"
                      />
                    </div>
                    {counselorSpecOptions.length > 0 && (
                      <Select value={counselorSpec} onValueChange={setCounselorSpec}>
                        <SelectTrigger className="sm:w-64">
                          <SelectValue placeholder="Filter by specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All specializations</SelectItem>
                          {counselorSpecOptions.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredCounselors.map((p: any) => (
                      <Link
                        key={p.id}
                        to={`/practitioner/${p.id}`}
                        className="flex items-start gap-3 p-3 rounded-md border hover:bg-muted transition-colors"
                      >
                        <ImageWithFallback
                          src={p.image}
                          fallbackSrc={practitionerPlaceholder}
                          alt={p.name}
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-medium text-sm truncate">{p.name}</p>
                          {Array.isArray(p.specialization) && p.specialization.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {p.specialization.slice(0, 3).map((s: string) => (
                                <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                  {filteredCounselors.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {t("common.noResults") || "No results found"}
                    </p>
                  )}
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

export default PeerCounselingDetail;
