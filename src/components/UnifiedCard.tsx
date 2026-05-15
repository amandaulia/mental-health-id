import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Building2, Heart, Star, CheckCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeIcon } from "./ModeIcon";
import { trackCardClick } from "@/utils/analytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProfessionLabel } from "@/utils/labels";
import clinicPlaceholder from "@/assets/clinic-placeholder.png";

export interface UnifiedCardData {
  type: "practitioner" | "institution" | "peer-counseling" | "support-group" | "activity" | "organization" | "community";
  id: string;
  image?: string;
  name: string;
  city: string;
  isVerified?: boolean;
  
  // Professional/Institution specific
  institutionName?: string;
  professionTypes?: string[];
  specializations?: string[];
  priceRange?: string;
  insurance?: string[];
  modes?: string[];
  
  // Peer counseling specific
  specialization?: string;
  serviceType?: string;
  price?: number;
  
  // Activity specific
  organizationName?: string;
  activityType?: string;
  
  // Organization specific
  organizationType?: string;
}

interface UnifiedCardProps {
  data: UnifiedCardData;
  linkTo?: string;
  onClick?: () => void;
}

export const UnifiedCard = ({ data, linkTo, onClick }: UnifiedCardProps) => {
  const { t } = useLanguage();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCardClick = () => {
    trackCardClick(data.type, data.id, data.name);
    if (onClick) {
      onClick();
    }
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (linkTo) {
      return (
        <Link to={linkTo} onClick={handleCardClick}>
          {children}
        </Link>
      );
    }
    return <div onClick={handleCardClick}>{children}</div>;
  };

  return (
    <CardWrapper>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 flex-shrink-0">
                  <img 
                    src={data.image || clinicPlaceholder} 
                    alt={`${data.name} logo`}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = clinicPlaceholder;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg truncate">{data.name}</h3>
                    {data.isVerified && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 flex-shrink-0">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t('common.verified')}
                      </Badge>
                    )}
                  </div>
                
                {data.type === "practitioner" && (
                  <>
                    {data.institutionName && (
                      <p className="text-sm text-muted-foreground mb-2">{data.institutionName}</p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {data.professionTypes?.slice(0, 2).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {getProfessionLabel(t, type)}
                        </Badge>
                      ))}
                      {data.professionTypes && data.professionTypes.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{data.professionTypes.length - 2}
                        </Badge>
                      )}
                      {data.insurance && data.insurance.filter(ins => ins?.toLowerCase() !== "none").length > 0 && (
                        <>
                          {Array.from(new Set(data.insurance.filter(ins => ins?.toLowerCase() !== "none"))).slice(0, 2).map((ins) => {
                            const n = ins.toLowerCase();
                            const isBpjs = n === "bpjs";
                            const isPrivate = n === "private" || n === "private insurance";
                            return (
                              <Badge
                                key={ins}
                                variant={isBpjs ? "bpjs" : isPrivate ? "private" : "outline"}
                                className="text-xs"
                              >
                                {isBpjs ? "BPJS" : isPrivate ? t('insurance.privateInsurance') : ins}
                              </Badge>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </>
                )}

                {data.type === "institution" && (
                  <>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {data.professionTypes?.slice(0, 2).map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {getProfessionLabel(t, type)}
                        </Badge>
                      ))}
                      {data.professionTypes && data.professionTypes.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{data.professionTypes.length - 2}
                        </Badge>
                      )}
                      {data.insurance && data.insurance.filter(ins => ins?.toLowerCase() !== "none").length > 0 && (
                        <>
                          {Array.from(new Set(data.insurance.filter(ins => ins?.toLowerCase() !== "none"))).slice(0, 2).map((ins) => {
                            const n = ins.toLowerCase();
                            const isBpjs = n === "bpjs";
                            const isPrivate = n === "private" || n === "private insurance";
                            return (
                              <Badge
                                key={ins}
                                variant={isBpjs ? "bpjs" : isPrivate ? "private" : "outline"}
                                className="text-xs"
                              >
                                {isBpjs ? "BPJS" : isPrivate ? t('insurance.privateInsurance') : ins}
                              </Badge>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </>
                )}

                {(data.type === "peer-counseling" || data.type === "support-group") && (
                  <>
                    {data.specialization && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {data.specialization}
                      </Badge>
                    )}
                    {data.serviceType && (
                      <p className="text-sm text-muted-foreground mb-2">{data.serviceType}</p>
                    )}
                    {data.price !== undefined && (
                      <p className="font-medium text-primary text-sm">
                        {data.price === 0 ? t('common.free') : formatPrice(data.price)}
                      </p>
                    )}
                  </>
                )}

                {data.type === "activity" && (
                  <>
                    {data.organizationName && (
                      <p className="text-sm text-muted-foreground mb-2">{data.organizationName}</p>
                    )}
                    {data.activityType && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {data.activityType}
                      </Badge>
                    )}
                    {data.price !== undefined && (
                      <p className="font-medium text-primary text-sm">
                        {data.price === 0 ? t('common.free') : formatPrice(data.price)}
                      </p>
                    )}
                  </>
                )}

                {(data.type === "organization" || data.type === "community") && (
                  <>
                    {data.organizationType && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {data.organizationType}
                      </Badge>
                    )}
                  </>
                )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {data.specializations && data.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {[...new Set(data.specializations)].slice(0, 2).map((spec, index) => (
                    <Badge key={`${spec}-${index}`} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {data.specializations.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{data.specializations.length - 2}
                    </Badge>
                  )}
                </div>
              )}
              
              {data.modes && data.modes.length > 0 && (
                <div className="flex items-center gap-2">
                  {data.modes.slice(0, 4).map((mode) => (
                    <div key={mode} className="text-muted-foreground">
                      <ModeIcon mode={mode} />
                    </div>
                  ))}
                </div>
              )}
              
              {data.priceRange && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rp</span>
                  <span className="text-sm font-medium">{data.priceRange}</span>
                </div>
              )}
              
              {data.city && data.city !== "Unknown City" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{data.city}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};
