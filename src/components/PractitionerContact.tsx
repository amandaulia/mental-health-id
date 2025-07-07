
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Globe, Instagram, MapPin, ExternalLink } from "lucide-react";
import { Practitioner } from "@/types";

interface PractitionerContactProps {
  practitioner: Practitioner;
}

export const PractitionerContact = ({ practitioner }: PractitionerContactProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <p>{practitioner.contactDetails.phone || practitioner.contactDetails.whatsapp || "N/A"}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {practitioner.contactDetails.whatsapp && (
            <Button size="sm" className="flex items-center gap-2" asChild>
              <a href={`https://wa.me/${practitioner.contactDetails.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          )}
          
          {practitioner.contactDetails.website && (
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <a href={practitioner.contactDetails.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
                Website
              </a>
            </Button>
          )}
          
          {practitioner.contactDetails.instagram && (
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <a href={practitioner.contactDetails.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            </Button>
          )}

          {practitioner.contactDetails.facebook && (
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <a href={practitioner.contactDetails.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{practitioner.location.address}</p>
              <p className="text-sm text-muted-foreground">{practitioner.city}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="h-48 bg-muted rounded-lg flex items-center justify-center relative group">
              <p className="text-muted-foreground">Map preview</p>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg cursor-pointer">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  asChild
                >
                  <a 
                    href={`https://www.google.com/maps?q=${practitioner.location.lat},${practitioner.location.lng}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open in Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
