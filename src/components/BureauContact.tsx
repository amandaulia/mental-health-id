
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Globe, Instagram, MapPin, ExternalLink, Facebook } from "lucide-react";
import { Bureau } from "@/types";
import { useState } from "react";

interface BureauContactProps {
  bureau: Bureau;
}

export const BureauContact = ({ bureau }: BureauContactProps) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const handleMapClick = () => {
    const encodedAddress = encodeURIComponent(bureau.location.address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phone Number */}
        {bureau.contactDetails.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <p>{bureau.contactDetails.phone}</p>
          </div>
        )}
        
        {/* Contact Buttons */}
        <div className="flex flex-wrap gap-2">
          {bureau.contactDetails.whatsapp && (
            <Button size="sm" className="flex items-center gap-2" asChild>
              <a href={`https://wa.me/${bureau.contactDetails.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          )}
          
          {bureau.contactDetails.website && (
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <a href={bureau.contactDetails.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
                Website
              </a>
            </Button>
          )}
          
          {bureau.contactDetails.instagram && (
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <a href={bureau.contactDetails.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            </Button>
          )}

          {bureau.contactDetails.facebook && (
            <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
              <a href={bureau.contactDetails.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-4 w-4" />
                Facebook
              </a>
            </Button>
          )}
        </div>

        {/* Location */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{bureau.location.address}</p>
              <p className="text-sm text-muted-foreground">{bureau.city}, Indonesia</p>
            </div>
          </div>
          
          {/* Map Preview */}
          <div className="space-y-2">
            <div className={`bg-muted rounded-lg flex items-center justify-center transition-all duration-200 relative group ${
              isMapExpanded ? 'h-96' : 'h-48'
            }`}>
              <p className="text-muted-foreground">Map preview</p>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg cursor-pointer">
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                  >
                    {isMapExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleMapClick}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Google Maps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
