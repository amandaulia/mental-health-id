
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeIcon } from "./ModeIcon";
import { Practitioner } from "@/types";
import { useState } from "react";

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
                    <Badge className="bg-green-100 text-green-700 w-fit">Verified</Badge>
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
                    <div><span className="font-medium">Experience:</span> {practitioner.experience}</div>
                  )}
                  {practitioner.education && practitioner.education !== "Not specified" && (
                    <div><span className="font-medium">Education:</span> {practitioner.education}</div>
                  )}
                </div>
              </div>
              
              {practitioner.licenseNumber && practitioner.licenseNumber !== "N/A" && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">License Number:</span> {practitioner.licenseNumber}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex-shrink-0">
            Last updated: {new Date(practitioner.lastUpdated).toLocaleDateString()}
          </div>
        </div>

        {/* Content in Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Profession Types */}
            {practitioner.professionTypes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Profession Types</h4>
                <div className="flex flex-wrap gap-2">
                  {practitioner.professionTypes.map((type) => (
                    <Badge 
                      key={type} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => onTagClick('professionTypes', type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Specializations */}
            {practitioner.specializations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  {visibleSpecializations.map((spec) => (
                    <Badge 
                      key={spec} 
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => onTagClick('specializations', spec)}
                    >
                      {spec}
                    </Badge>
                  ))}
                  {practitioner.specializations.length > maxItemsToShow && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllSpecializations(!showAllSpecializations)}
                      className="h-6 px-2 text-xs"
                    >
                      {showAllSpecializations ? 'See less' : `+${practitioner.specializations.length - maxItemsToShow} more`}
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
                <h4 className="font-medium mb-2">Available Session Modes</h4>
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
                      {showAllModes ? 'See less' : `+${practitioner.modes.length - maxItemsToShow} more`}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Insurance Accepted */}
            {practitioner.insurance.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Insurance Accepted</h4>
                <div className="flex flex-wrap gap-2">
                  {practitioner.insurance.map((ins) => (
                    <Badge 
                      key={ins} 
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary/80"
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
