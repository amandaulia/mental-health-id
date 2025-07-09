
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Globe, Instagram } from "lucide-react";
import { Bureau } from "@/types";

interface BureauContactProps {
  bureau: Bureau;
}

export const BureauContact = ({ bureau }: BureauContactProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Buttons */}
        <div className="flex flex-wrap gap-2">
          {bureau.contactDetails.whatsapp && (
            <Button size="sm" className="flex items-center gap-2" asChild>
              <a href={bureau.contactDetails.whatsapp} target="_blank" rel="noopener noreferrer">
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
        </div>
      </CardContent>
    </Card>
  );
};
