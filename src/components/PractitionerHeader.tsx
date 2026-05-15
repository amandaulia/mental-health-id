
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeIcon } from "./ModeIcon";
import { Practitioner } from "@/types";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProfessionLabel, getSpecializationLabel } from "@/utils/labels";

interface PractitionerHeaderProps {
  practitioner: Practitioner;
  onTagClick: (type: string, value: string) => void;
  onBureauClick: () => void;
  getModeLabel: (mode: string) => string;
  getInsuranceLabel: (ins: string) => string;
}

export const PractitionerHeader = ({ 
  practitioner, 
  onTagClick, 
  onBureauClick, 
  getModeLabel, 
  getInsuranceLabel 
}: PractitionerHeaderProps) => {
  const { t } = useLanguage();
  const [showAllSpecializations, setShowAllSpecializations] = useState(false);
  const [showAllModes, setShowAllModes] = useState(false);

  const maxItemsToShow = 4;

  const visibleSpecializations = showAllSpecializations 
    ? practitioner.specializations 
    : practitioner.specializations.slice(0, maxItemsToShow);

  const visibleModes = showAllModes 
    ? practitioner.modes 
    : practitioner.modes.slice(0, maxItemsToShow);

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* Header with Last Updated */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            <img
              src={practitioner.image}
              alt={practitioner.name}
              className="w-32 h-32 rounded-lg object-cover mx-auto lg:mx-0 flex-shrink-0"
            />
            <div className="space-y-3">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">{practitioner.name}</h1>
                  {practitioner.isVerified && (
                    <Badge className="bg-green-100 text-green-700 w-fit">{t('common.verified')}</Badge>
                  )}
                </div>
                <button
                  onClick={onBureauClick}
                  className="text-lg sm:text-xl text-primary hover:text-primary/80 transition-colors cursor-pointer underline"
                >
                  {practitioner.bureauName}
                </button>
                
                {/* Experience & Education moved here */}
                <div className="space-y-2 text-sm mt-3">
                  {practitioner.experience && practitioner.experience !== "Not specified" && (
                    <div><span className="font-medium">{t('detail.experience')}:</span> {practitioner.experience}</div>
                  )}
                  {practitioner.education && practitioner.education !== "Not specified" && (
                    <div><span className="font-medium">{t('detail.education')}:</span> {practitioner.education}</div>
                  )}
                </div>
              </div>
              
              {practitioner.licenseNumber && practitioner.licenseNumber !== "N/A" && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{t('detail.licenseNumber')}:</span> {practitioner.licenseNumber}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex-shrink-0">
            {t('detail.lastUpdated')}: {new Date(practitioner.lastUpdated).toLocaleDateString()}
          </div>
        </div>

        {/* Content in Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Profession Types */}
            {practitioner.professionTypes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{t('detail.professionTypes')}</h4>
                <div className="flex flex-wrap gap-2">
                  {practitioner.professionTypes.map((type) => (
                    <Badge 
                      key={type} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => onTagClick('professionTypes', type)}
                    >
                      {getProfessionLabel(t, type)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Specializations */}
            {practitioner.specializations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{t('detail.specializations')}</h4>
                <div className="flex flex-wrap gap-2">
                  {visibleSpecializations.map((spec) => (
                    <Badge 
                      key={spec} 
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => onTagClick('specializations', spec)}
                    >
                      {getSpecializationLabel(t, spec)}
                    </Badge>
                  ))}
                  {practitioner.specializations.length > maxItemsToShow && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllSpecializations(!showAllSpecializations)}
                      className="h-6 px-2 text-xs"
                    >
                      {showAllSpecializations ? t('detail.showLess') : `+${practitioner.specializations.length - maxItemsToShow}`}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Available Session Modes */}
            {practitioner.modes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{t('detail.sessionModes')}</h4>
                <div className="flex flex-wrap gap-2">
                  {visibleModes.map((mode) => (
                    <Badge 
                      key={mode} 
                      variant="outline" 
                      className="flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
                      onClick={() => onTagClick('modes', mode)}
                    >
                      <ModeIcon mode={mode} />
                      {getModeLabel(mode)}
                    </Badge>
                  ))}
                  {practitioner.modes.length > maxItemsToShow && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllModes(!showAllModes)}
                      className="h-6 px-2 text-xs"
                    >
                      {showAllModes ? t('detail.showLess') : `+${practitioner.modes.length - maxItemsToShow}`}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Insurance Accepted */}
            {practitioner.insurance.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{t('detail.insurance')}</h4>
                <div className="flex flex-wrap gap-2">
                  {practitioner.insurance.map((ins) => (
                    <Badge 
                      key={ins} 
                      variant={ins === "bpjs" ? "bpjs" : ins === "private" ? "private" : "outline"}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => onTagClick('insurance', ins)}
                    >
                      {getInsuranceLabel(ins)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
