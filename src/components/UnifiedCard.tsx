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
    switch (data.type) {
      case "practitioner":
        return (
          <div className="flex gap-4">
            {data.image && (
              <img
                src={data.image}
                alt={data.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            )}
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
                  <p className="text-sm text-muted-foreground mb-1 truncate">{data.institutionName}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {data.professionTypes.slice(0, 2).map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                    {data.professionTypes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{data.professionTypes.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {data.specializations.slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {data.specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{data.specializations.length - 2} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{data.city}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {data.modes.slice(0, 4).map((mode) => (
                      <ModeIcon key={mode} mode={mode} />
                    ))}
                  </div>
                </div>
                
                {data.priceRange && (
                  <div className="text-sm font-medium text-primary">
                    {data.priceRange}
                  </div>
                )}

                {data.insurance.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {data.insurance.map((insurance) => (
                      <Badge key={insurance} variant="secondary" className="text-xs">
                        {insurance === "private" ? "Private Insurance" : 
                         insurance === "bpjs" ? "BPJS" : 
                         insurance === "none" ? "No Insurance" : insurance}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "institution":
        return (
          <div className="space-y-3">
            {data.image && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg truncate">{data.name}</h3>
                  {data.isVerified && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 flex-shrink-0">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {data.professionTypes.slice(0, 3).map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                  {data.professionTypes.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{data.professionTypes.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {data.specializations.slice(0, 2).map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
                {data.specializations.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{data.specializations.length - 2} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{data.city}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {data.modes.slice(0, 4).map((mode) => (
                    <ModeIcon key={mode} mode={mode} />
                  ))}
                </div>
              </div>
              
              {data.priceRange && (
                <div className="text-sm font-medium text-primary">
                  {data.priceRange}
                </div>
              )}

              {data.insurance.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {data.insurance.map((insurance) => (
                    <Badge key={insurance} variant="secondary" className="text-xs">
                      {insurance === "private" ? "Private Insurance" : 
                       insurance === "bpjs" ? "BPJS" : 
                       insurance === "none" ? "No Insurance" : insurance}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "peer-counseling":
      case "support-group":
        return (
          <div className="space-y-3">
            {data.image && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg leading-tight flex-1">
                {data.name}
              </h3>
              <div className="flex items-center gap-2">
                {data.isVerified && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 flex-shrink-0">
                    Verified
                  </Badge>
                )}
                <Badge variant={data.serviceType === "Peer Counseling" ? "default" : "secondary"} className="shrink-0 text-xs">
                  {data.serviceType}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Specialization</h4>
                <p className="text-sm">{data.specialization}</p>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{data.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{data.price === "Free" ? "Free" : `Rp ${data.price}`}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="space-y-3">
            {data.image && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate mb-1">{data.name}</h3>
                <p className="text-sm text-muted-foreground mb-2 truncate">{data.organizationName}</p>
                <Badge variant="outline" className="text-xs mb-2">
                  {data.activityType}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{data.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{data.price === "Free" ? "Free" : `Rp ${data.price}`}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "organization":
      case "community":
        return (
          <div className="space-y-3">
            {data.image && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img 
                  src={data.image} 
                  alt={data.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
            )}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg truncate">{data.name}</h3>
                  {data.isVerified && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 flex-shrink-0">
                      Verified
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="text-xs mb-2">
                  {data.organizationType}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{data.city}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <CardWrapper>
      <CardContent className="p-4">
        {renderContent()}
      </CardContent>
    </CardWrapper>
  );
};