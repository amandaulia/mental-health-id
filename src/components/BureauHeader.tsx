
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeIcon } from "./ModeIcon";
import { Bureau } from "@/types";
import { useState } from "react";
import { getPlaceholderImage } from "@/utils/placeholderImage";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProfessionLabel, getSpecializationLabel } from "@/utils/labels";

const clinicPlaceholder = getPlaceholderImage("institution");

interface BureauHeaderProps {
  bureau: Bureau;
  getModeLabel: (mode: string) => string;
  getInsuranceLabel: (ins: string) => string;
}

export const BureauHeader = ({ bureau, getModeLabel, getInsuranceLabel }: BureauHeaderProps) => {
  const { t } = useLanguage();
  const [showMoreProfessions, setShowMoreProfessions] = useState(false);
  const [showMoreSpecializations, setShowMoreSpecializations] = useState(false);
  const [showMoreModes, setShowMoreModes] = useState(false);
  const [showMoreInsurance, setShowMoreInsurance] = useState(false);

  const renderToggleableTags = (
    items: string[],
    showMore: boolean,
    setShowMore: (show: boolean) => void,
    renderTag: (item: string) => React.ReactNode,
    maxItems = 2
  ) => {
    const visibleItems = showMore ? items : items.slice(0, maxItems);
    const hasMore = items.length > maxItems;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {visibleItems.map((item, index) => (
          <span key={index}>{renderTag(item)}</span>
        ))}
        {hasMore && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showMore ? t('detail.showLess') : `+${items.length - maxItems} ${t('detail.showAll').toLowerCase()}`}
          </button>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header with Last Updated */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            {/* Left side - Image and Basic Info */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src={bureau.image}
                  fallbackSrc={clinicPlaceholder}
                  alt={bureau.name}
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold">{bureau.name}</h1>
                    {bureau.isVerified && (
                      <Badge className="bg-green-100 text-green-700">{t('common.verified')}</Badge>
                    )}
                  </div>
                </div>

                {/* Three-column layout for compact display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Profession Types */}
                  {bureau.professionTypes.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">{t('detail.professionTypes')}</p>
                      {renderToggleableTags(
                        bureau.professionTypes,
                        showMoreProfessions,
                        setShowMoreProfessions,
                        (type) => (
                          <Badge variant="outline" className="text-xs">
                            {getProfessionLabel(t, type)}
                          </Badge>
                        )
                      )}
                    </div>
                  )}

                  {/* Available Modes */}
                  {bureau.modes.length > 0 && (
                    <div className="space-y-2 md:col-span-2">
                      <p className="font-medium text-sm">{t('detail.sessionModes')}</p>
                      <div className="flex flex-wrap gap-2 items-center">
                        {bureau.modes.map((mode, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                            <ModeIcon mode={mode} />
                            {getModeLabel(mode)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Accepted Insurance */}
                  {bureau.insurance.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium text-sm">{t('detail.insurance')}</p>
                      {renderToggleableTags(
                        bureau.insurance,
                        showMoreInsurance,
                        setShowMoreInsurance,
                        (ins) => (
                          <Badge variant="outline" className="text-xs">
                            {getInsuranceLabel(ins)}
                          </Badge>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Specializations - moved below the grid */}
                {bureau.specializations.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-sm">{t('detail.specializations')}</p>
                    <div className="flex flex-wrap gap-2">
                      {bureau.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {getSpecializationLabel(t, spec)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Last Updated - moved to top right */}
          <div className="text-sm text-muted-foreground flex-shrink-0">
            {t('detail.lastUpdated')}: {new Date(bureau.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
