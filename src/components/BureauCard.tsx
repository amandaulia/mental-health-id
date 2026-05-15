
import { Bureau } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProfessionLabel, getInstitutionTypeLabel } from "@/utils/labels";

interface BureauCardProps {
  bureau: Bureau;
}

export const BureauCard = ({ bureau }: BureauCardProps) => {
  const { t } = useLanguage();

  return (
    <Link to={`/bureau/${bureau.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg truncate">{bureau.name}</h3>
                  {bureau.isVerified && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 flex-shrink-0">
                      {t('common.verified')}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {bureau.professionTypes.slice(0, 3).map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {getProfessionLabel(t, type)}
                    </Badge>
                  ))}
                  {bureau.professionTypes.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{bureau.professionTypes.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{getInstitutionTypeLabel(t, bureau.bureauType)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{bureau.city}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{bureau.businessHours}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {bureau.insurance.map((ins) => (
                  <Badge key={ins} variant="outline" className="text-xs">
                    {ins === "bpjs" ? "BPJS" : ins === "private" ? t('insurance.privateInsurance') : t('insurance.noInsurance')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
