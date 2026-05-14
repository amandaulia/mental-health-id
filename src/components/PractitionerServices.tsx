
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeIcon } from "./ModeIcon";
import { Clock } from "lucide-react";
import { Practitioner } from "@/types";
import { trackBookingClick } from "@/utils/analytics";

interface PractitionerServicesProps {
  practitioner: Practitioner;
  formatPrice: (price: number) => string;
  getModeLabel: (mode: string) => string;
}

export const PractitionerServices = ({ 
  practitioner, 
  formatPrice, 
  getModeLabel 
}: PractitionerServicesProps) => {
  const handleBookingClick = (serviceName: string, price?: number) => {
    trackBookingClick(serviceName, practitioner.name, price);
  };

  const handleLearnMoreClick = (serviceName: string) => {
    trackBookingClick(`${serviceName} - Learn More`, practitioner.name);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {practitioner.services.map((service, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  {service.institutionName && (
                    <p className="text-sm text-muted-foreground">{service.institutionName}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ModeIcon mode={service.mode} />
                      <span>{getModeLabel(service.mode)}</span>
                    </div>
                  </div>
                  <p
                    className={`mt-2 ${
                      service.price == null
                        ? "text-sm text-muted-foreground italic"
                        : "font-medium text-primary text-lg"
                    }`}
                  >
                    {service.price == null
                      ? "Price available upon request"
                      : service.price === 0
                      ? "Free"
                      : formatPrice(service.price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {service.bookingUrl && (
                    <Button 
                      size="sm" 
                      asChild
                      onClick={() => handleBookingClick(service.name, service.price)}
                    >
                      <a href={service.bookingUrl} target="_blank" rel="noopener noreferrer">
                        Book Now
                      </a>
                    </Button>
                  )}
                  {service.learnMoreUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      onClick={() => handleLearnMoreClick(service.name)}
                    >
                      <a href={service.learnMoreUrl} target="_blank" rel="noopener noreferrer">
                        Learn More
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
