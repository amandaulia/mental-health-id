
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ModeIcon } from "./ModeIcon";
import { Practitioner } from "@/types";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {practitioner.services.map((service, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                {service.institutionName && (
                  <p className="text-sm text-muted-foreground">{service.institutionName}</p>
                )}
                <p className="text-sm text-muted-foreground mb-2">{service.duration}</p>
                <p className="font-medium text-primary text-lg">
                  {formatPrice(service.price)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <ModeIcon mode={service.mode} />
                  <span className="text-sm">{getModeLabel(service.mode)}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                {service.bookingUrl && (
                  <Button size="sm" asChild>
                    <a href={service.bookingUrl} target="_blank" rel="noopener noreferrer">
                      Book
                    </a>
                  </Button>
                )}
                {service.learnMoreUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={service.learnMoreUrl} target="_blank" rel="noopener noreferrer">
                      Learn More
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
