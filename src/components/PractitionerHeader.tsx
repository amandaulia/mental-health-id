
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ModeIcon } from "./ModeIcon";
import { Practitioner } from "@/types";

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
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <img
            src={practitioner.image}
            alt={practitioner.name}
            className="w-32 h-32 rounded-lg object-cover mx-auto lg:mx-0 flex-shrink-0"
          />
          <div className="flex-1 space-y-4">
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
            </div>
            
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">License Number:</span> {practitioner.licenseNumber}
            </div>

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
            
            <div>
              <h4 className="font-medium mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {practitioner.specializations.map((spec) => (
                  <Badge 
                    key={spec} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => onTagClick('specializations', spec)}
                  >
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Available Session Modes</h4>
              <div className="flex flex-wrap gap-2">
                {practitioner.modes.map((mode) => (
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
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Last updated:</span> {new Date(practitioner.lastUpdated).toLocaleDateString()}
                </p>
                <div className="mt-2 text-sm">
                  <div><span className="font-medium">Experience:</span> {practitioner.experience}</div>
                  <div><span className="font-medium">Education:</span> {practitioner.education}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
