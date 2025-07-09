import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Phone, Video, User, Building2, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export type CardType = 
  | "practitioner" 
  | "institution" 
  | "peer-counseling" 
  | "support-group" 
  | "activity" 
  | "organization" 
  | "community";

interface BaseCardData {
  id: string;
  image?: string;
  name: string;
  city: string;
  isVerified?: boolean;
}

interface PractitionerCardData extends BaseCardData {
  type: "practitioner";
  institutionName: string;
  professionTypes: string[];
  specializations: string[];
  priceRange?: string;
  insurance: string[];
  modes: string[];
}

interface InstitutionCardData extends BaseCardData {
  type: "institution";
  professionTypes: string[];
  specializations: string[];
  priceRange?: string;
  insurance: string[];
  modes: string[];
}

interface PeerCounselingCardData extends BaseCardData {
  type: "peer-counseling" | "support-group";
  specialization: string;
  serviceType: string;
  price: string;
}

interface ActivityCardData extends BaseCardData {
  type: "activity";
  organizationName: string;
  activityType: string;
  price: string;
}

interface OrganizationCardData extends BaseCardData {
  type: "organization" | "community";
  organizationType: string;
}

export type UnifiedCardData = 
  | PractitionerCardData 
  | InstitutionCardData 
  | PeerCounselingCardData 
  | ActivityCardData 
  | OrganizationCardData;

interface UnifiedCardProps {
  data: UnifiedCardData;
  linkTo?: string;
  onClick?: () => void;
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

export const UnifiedCard = ({ data, linkTo, onClick }: UnifiedCardProps) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (linkTo) {
      return (
        <Link to={linkTo}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            {children}
          </Card>
        </Link>
      );
    }
    
    return (
      <Card 
        className={`hover:shadow-lg transition-shadow h-full ${onClick ? 'cursor-pointer' : ''}`}
        onClick={handleClick}
      >
        {children}
      </Card>
    );
  };

  const renderContent = () => {
    // Common horizontal layout for all card types
    return (
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
          {data.image ? (
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{data.name}</h3>
                {data.isVerified && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 flex-shrink-0">
                    Verified
                  </Badge>
                )}
              </div>
              
              {/* Institution/Organization name - second line */}
              {(data.type === "practitioner" && (data as PractitionerCardData).institutionName) && (
                <p className="text-sm text-muted-foreground mb-2 truncate">
                  {(data as PractitionerCardData).institutionName}
                </p>
              )}
              {(data.type === "activity" && (data as ActivityCardData).organizationName) && (
                <p className="text-sm text-muted-foreground mb-2 truncate">
                  {(data as ActivityCardData).organizationName}
                </p>
              )}
              
              {/* Profession types / Activity type / Organization type */}
              <div className="flex flex-wrap gap-1 mb-2">
                {data.type === "practitioner" && (
                  <>
                    {(data as PractitionerCardData).professionTypes.slice(0, 2).map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                    {(data as PractitionerCardData).professionTypes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{(data as PractitionerCardData).professionTypes.length - 2}
                      </Badge>
                    )}
                  </>
                )}
                
                {data.type === "institution" && (
                  <>
                    {(data as InstitutionCardData).professionTypes.slice(0, 2).map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                    {(data as InstitutionCardData).professionTypes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{(data as InstitutionCardData).professionTypes.length - 2}
                      </Badge>
                    )}
                  </>
                )}
                
                {(data.type === "peer-counseling" || data.type === "support-group") && (
                  <Badge variant={data.type === "peer-counseling" ? "default" : "secondary"} className="text-xs">
                    {(data as PeerCounselingCardData).serviceType}
                  </Badge>
                )}
                
                {data.type === "activity" && (
                  <Badge variant="outline" className="text-xs">
                    {(data as ActivityCardData).activityType}
                  </Badge>
                )}
                
                {(data.type === "organization" || data.type === "community") && (
                  <Badge variant="outline" className="text-xs">
                    {(data as OrganizationCardData).organizationType}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Specializations */}
          {(data.type === "practitioner" || data.type === "institution") && (
            <div className="flex flex-wrap gap-1 mb-2">
              {data.type === "practitioner" && (
                <>
                  {(data as PractitionerCardData).specializations.slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {(data as PractitionerCardData).specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{(data as PractitionerCardData).specializations.length - 2} more
                    </Badge>
                  )}
                </>
              )}
              
              {data.type === "institution" && (
                <>
                  {(data as InstitutionCardData).specializations.slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {(data as InstitutionCardData).specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{(data as InstitutionCardData).specializations.length - 2} more
                    </Badge>
                  )}
                </>
              )}
            </div>
          )}
          
          {/* Specialization for peer counseling */}
          {(data.type === "peer-counseling" || data.type === "support-group") && (
            <div className="mb-2">
              <Badge variant="outline" className="text-xs">
                {(data as PeerCounselingCardData).specialization}
              </Badge>
            </div>
          )}
          
          {/* Location and modes/price row */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{data.city}</span>
            </div>
            
            {/* Session modes for practitioners/institutions */}
            {(data.type === "practitioner" || data.type === "institution") && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {data.type === "practitioner" && (data as PractitionerCardData).modes.slice(0, 4).map((mode) => (
                  <ModeIcon key={mode} mode={mode} />
                ))}
                {data.type === "institution" && (data as InstitutionCardData).modes.slice(0, 4).map((mode) => (
                  <ModeIcon key={mode} mode={mode} />
                ))}
              </div>
            )}
          </div>
          
          {/* Price information */}
          {(data.type === "practitioner" && (data as PractitionerCardData).priceRange) && (
            <div className="text-sm font-medium text-primary mb-2">
              {(data as PractitionerCardData).priceRange}
            </div>
          )}
          
          {(data.type === "institution" && (data as InstitutionCardData).priceRange) && (
            <div className="text-sm font-medium text-primary mb-2">
              {(data as InstitutionCardData).priceRange}
            </div>
          )}
          
          {(data.type === "peer-counseling" || data.type === "support-group" || data.type === "activity") && (
            <div className="text-sm font-medium text-primary mb-2">
              {data.type === "activity" 
                ? ((data as ActivityCardData).price === "Free" ? "Free" : `Rp ${(data as ActivityCardData).price}`)
                : ((data as PeerCounselingCardData).price === "Free" ? "Free" : `Rp ${(data as PeerCounselingCardData).price}`)
              }
            </div>
          )}
          
          {((data.type === "practitioner" && (data as PractitionerCardData).priceRange === undefined) || 
            (data.type === "institution" && (data as InstitutionCardData).priceRange === undefined)) && (
            <div className="text-sm font-medium text-orange-500 mb-2">
              Price not available
            </div>
          )}

          {/* Insurance for practitioners/institutions */}
          {(data.type === "practitioner" || data.type === "institution") && (
            <div className="flex flex-wrap gap-1">
              {data.type === "practitioner" && (data as PractitionerCardData).insurance.length > 0 && 
                (data as PractitionerCardData).insurance.map((insurance) => (
                  <Badge key={insurance} variant="secondary" className="text-xs">
                    {insurance === "private" ? "Private Insurance" : 
                     insurance === "bpjs" ? "BPJS" : 
                     insurance === "none" ? "No Insurance" : insurance}
                  </Badge>
                ))
              }
              
              {data.type === "institution" && (data as InstitutionCardData).insurance.length > 0 && 
                (data as InstitutionCardData).insurance.map((insurance) => (
                  <Badge key={insurance} variant="secondary" className="text-xs">
                    {insurance === "private" ? "Private Insurance" : 
                     insurance === "bpjs" ? "BPJS" : 
                     insurance === "none" ? "No Insurance" : insurance}
                  </Badge>
                ))
              }
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <CardWrapper>
      <CardContent className="p-4">
        {renderContent()}
      </CardContent>
    </CardWrapper>
  );
};