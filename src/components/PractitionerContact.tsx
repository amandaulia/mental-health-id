
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Globe, Instagram, Facebook } from "lucide-react";
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
        {/* Phone Number */}
        {(practitioner.contactDetails.phone || practitioner.contactDetails.whatsapp) && (
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <p>{practitioner.contactDetails.phone || practitioner.contactDetails.whatsapp || "N/A"}</p>
          </div>
        )}
        
        {/* Contact Buttons */}
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
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
