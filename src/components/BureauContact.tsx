
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Globe, Instagram } from "lucide-react";
import { Bureau } from "@/types";

interface BureauContactProps {
  bureau: Bureau;
}

export const BureauContact = ({ bureau }: BureauContactProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bureau.contactDetails.whatsapp && (
          <div className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium text-sm">WhatsApp</p>
              <a href={bureau.contactDetails.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
                Contact via WhatsApp
              </a>
            </div>
          </div>
        )}
        
        {bureau.contactDetails.website && (
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium text-sm">Website</p>
              <a href={bureau.contactDetails.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
                Visit Website
              </a>
            </div>
          </div>
        )}
        
        {bureau.contactDetails.instagram && (
          <div className="flex items-center gap-3">
            <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium text-sm">Instagram</p>
              <a href={bureau.contactDetails.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
                View Instagram
              </a>
            </div>
          </div>
        )}

        {!bureau.contactDetails.whatsapp && !bureau.contactDetails.website && !bureau.contactDetails.instagram && (
          <p className="text-muted-foreground text-sm">No contact information available</p>
        )}
      </CardContent>
    </Card>
  );
};
