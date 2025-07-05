
import { Practitioner } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Phone, Video, User } from "lucide-react";
import { Link } from "react-router-dom";

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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link to={`/practitioner/${practitioner.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <img
              src={practitioner.image}
              alt={practitioner.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg truncate">{practitioner.name}</h3>
                    {practitioner.isVerified && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{practitioner.bureauName}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {practitioner.specializations.slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {practitioner.specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{practitioner.specializations.length - 2} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{practitioner.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {practitioner.modes.map((mode) => (
                      <ModeIcon key={mode} mode={mode} />
                    ))}
                  </div>
                </div>
                
                <div className="text-sm font-medium text-primary">
                  {formatPrice(practitioner.priceRange.min)} - {formatPrice(practitioner.priceRange.max)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
