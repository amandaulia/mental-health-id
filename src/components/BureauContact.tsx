
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Globe, Instagram, Phone, Mail, ExternalLink } from "lucide-react";
import { Bureau } from "@/types";
import { AnalyticsWrapper } from "./AnalyticsWrapper";
import { PhoneCallButton } from "./PhoneCallButton";

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
  // Group contacts by location for Phone and WhatsApp
  const groupedContacts: { [key: string]: typeof bureau.contactDetails } = {};
  const otherContacts: typeof bureau.contactDetails = [];

  bureau.contactDetails?.forEach((contact: any) => {
    if ((contact.type === 'Phone' || contact.type === 'WhatsApp') && contact.location) {
      const locationKey = contact.location.name || contact.location.city || 'Other Location';
      if (!groupedContacts[locationKey]) {
        groupedContacts[locationKey] = [];
      }
      groupedContacts[locationKey].push(contact);
    } else {
      otherContacts.push(contact);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {bureau.contactDetails && bureau.contactDetails.length > 0 ? (
          <>
            {/* Other contacts not grouped by location (Website, Instagram, etc.) - shown first */}
            {otherContacts.map((contact, index) => {
              const Icon = getContactIcon(contact.type);
              const displayText = contact.type === 'Application' ? 'Application' : contact.value;
              const shouldHaveLink = contact.type !== 'Phone' && contact.link;

              return (
                <AnalyticsWrapper
                  key={`other-${index}`}
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
                      ) : contact.type === 'Phone' ? (
                        <PhoneCallButton phone={contact.value} asLink>
                          {displayText}
                        </PhoneCallButton>
                      ) : (
                        <p className="text-sm">{displayText}</p>
                      )}
                    </div>
                  </div>
                </AnalyticsWrapper>
              );
            })}

            {/* Grouped Phone/WhatsApp by Location - shown after */}
            {Object.entries(groupedContacts).map(([locationName, contacts]) => (
              <div key={locationName} className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground">{locationName}</h4>
                <div className="space-y-4 pl-2">
                  {contacts.map((contact, index) => {
                    const Icon = getContactIcon(contact.type);
                    const displayText = contact.type === 'Application' ? 'Application' : contact.value;
                    const shouldHaveLink = contact.type !== 'Phone' && contact.link;

                    return (
                      <AnalyticsWrapper
                        key={`${locationName}-${index}`}
                        trackingType={shouldHaveLink ? "external-link" : "contact"}
                        trackingData={{
                          contactType: contact.type.toLowerCase(),
                          resourceName: bureau.name,
                          resourceType: "bureau",
                          linkUrl: contact.link,
                          linkText: displayText,
                          context: `bureau-${bureau.name}-${locationName}`
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
                            ) : contact.type === 'Phone' ? (
                              <PhoneCallButton phone={contact.value} asLink>
                                {displayText}
                              </PhoneCallButton>
                            ) : (
                              <p className="text-sm">{displayText}</p>
                            )}
                          </div>
                        </div>
                      </AnalyticsWrapper>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-muted-foreground text-sm">No contact information available</p>
        )}
      </CardContent>
    </Card>
  );
};
