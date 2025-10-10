
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Globe, Instagram, Phone, Mail, ExternalLink } from "lucide-react";
import { Bureau } from "@/types";
import { AnalyticsWrapper } from "./AnalyticsWrapper";

interface BureauContactProps {
  bureau: Bureau;
}

const getContactIcon = (type: string) => {
  switch (type) {
    case 'WhatsApp':
      return MessageCircle;
    case 'Phone':
      return Phone;
    case 'Website':
      return Globe;
    case 'Instagram':
      return Instagram;
    case 'Email':
      return Mail;
    case 'Application':
      return ExternalLink;
    default:
      return MessageCircle;
  }
};

export const BureauContact = ({ bureau }: BureauContactProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bureau.contactDetails && bureau.contactDetails.length > 0 ? (
          bureau.contactDetails.map((contact, index) => {
            const Icon = getContactIcon(contact.type);
            const displayText = contact.type === 'Application' ? 'Application' : contact.value;
            const shouldHaveLink = contact.type !== 'Phone' && contact.link;

            return (
              <AnalyticsWrapper
                key={index}
                trackingType={shouldHaveLink ? "external-link" : "contact"}
                trackingData={{
                  contactType: contact.type.toLowerCase(),
                  resourceName: bureau.name,
                  resourceType: "bureau",
                  linkUrl: contact.link,
                  linkText: displayText,
                  context: `bureau-${bureau.name}`
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{contact.type}</p>
                    {shouldHaveLink ? (
                      <a href={contact.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-primary-hover">
                        {displayText}
                      </a>
                    ) : (
                      <p className="text-sm">{displayText}</p>
                    )}
                  </div>
                </div>
              </AnalyticsWrapper>
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm">No contact information available</p>
        )}
      </CardContent>
    </Card>
  );
};
