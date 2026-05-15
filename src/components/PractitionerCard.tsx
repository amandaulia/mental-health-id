
import { Practitioner } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Phone, Video, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProfessionLabel } from "@/utils/labels";

interface PractitionerCardProps {
  practitioner: Practitioner;
}

const ModeIcon = ({ mode }: { mode: string }) => {
  switch (mode) {
    case "text":
      return <MessageCircle className="h-4 w-4" />;
    case "voice":
      return <Phone className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "offline":
      return <User className="h-4 w-4" />;
    default:
      return null;
  }
};

export const PractitionerCard = ({ practitioner }: PractitionerCardProps) => {
  const { t } = useLanguage();
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPriceRange = () => {
    const prices = practitioner.services.map(s => s.price).filter(Boolean);
    if (prices.length === 0) return t('common.priceNotAvailable');
    if (prices.length === 1) return formatPrice(prices[0]);
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  const getDisplaySpecializations = () => {
    if (practitioner.specializations.length <= 3) {
      return practitioner.specializations;
    }
    return practitioner.specializations.slice(0, 2);
  };

  const getSpecializationMoreCount = () => {
    if (practitioner.specializations.length > 3) {
      return practitioner.specializations.length - 2;
    }
    return 0;
  };

  const getUniqueInsurance = () => {
    return [...new Set(practitioner.insurance)];
  };

  const getUniqueModes = () => {
    return [...new Set(practitioner.modes)];
  };

  return (
    <Link to={`/practitioner/${practitioner.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <img
              src={practitioner.image}
              alt={practitioner.name}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg truncate">{practitioner.name}</h3>
                    {practitioner.isVerified && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 flex-shrink-0">
                        {t('common.verified')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 truncate">{practitioner.bureauName}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {practitioner.professionTypes.slice(0, 2).map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {getProfessionLabel(t, type)}
                      </Badge>
                    ))}
                    {practitioner.professionTypes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{practitioner.professionTypes.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {getDisplaySpecializations().map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {getSpecializationMoreCount() > 0 && (
                    <Badge variant="outline" className="text-xs">
                      +{getSpecializationMoreCount()} {t('common.more')}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{practitioner.city}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {getUniqueModes().slice(0, 4).map((mode) => (
                      <ModeIcon key={mode} mode={mode} />
                    ))}
                  </div>
                </div>
                
                <div className="text-sm font-medium text-primary">
                  {getPriceRange()}
                </div>

                {getUniqueInsurance().length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {getUniqueInsurance().map((insurance) => (
                      <Badge 
                        key={insurance} 
                        variant={insurance === "bpjs" ? "bpjs" : insurance === "private" ? "private" : "secondary"} 
                        className="text-xs"
                      >
                        {insurance === "private" ? t('insurance.privateInsurance') :
                         insurance === "bpjs" ? "BPJS" :
                         insurance === "none" ? t('insurance.noInsurance') : insurance}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
