import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { AnalyticsWrapper } from "./AnalyticsWrapper";
import { useLanguage } from "@/contexts/LanguageContext";

interface Location {
  id: string;
  name?: string;
  address: string;
  city: string;
  province: string;
  country: string;
}

interface BureauLocationsProps {
  locations: Location[];
  bureauName?: string;
}

export const BureauLocations = ({ locations, bureauName = "Bureau" }: BureauLocationsProps) => {
  const { t } = useLanguage();
  const hasMeaningfulDetail = (loc: Location) => {
    const isMissing = (v?: string) => !v || v === "Address not available" || v === "Unknown Province" || v === "Unknown Country";
    return !!loc.name || !isMissing(loc.address) || !isMissing(loc.province) || !isMissing(loc.country);
  };
  const visibleLocations = locations.filter(hasMeaningfulDetail);
  if (visibleLocations.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
        {t('detail.locations')} ({visibleLocations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleLocations.map((location) => {
          const locationQuery = `${location.name || ''} ${location.address}`.trim();
          const encodedQuery = encodeURIComponent(locationQuery);
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
          
          console.log('Location data:', location);
          console.log('Maps URL:', mapsUrl);
          
          return (
            <Card key={location.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {location.name && <p className="font-semibold text-lg mb-1">{location.name}</p>}
                    <p className="font-medium">{location.address}</p>
                    <p className="text-sm text-muted-foreground">
                      {location.city}, {location.province}, {location.country}
                    </p>
                  </div>
                </div>

                {/* Open in Google Maps Button */}
                <AnalyticsWrapper
                  trackingType="external-link"
                  trackingData={{
                    linkUrl: mapsUrl,
                    linkText: `Google Maps - ${location.name || location.city}`,
                    context: `bureau-location-${bureauName}`
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                    {t('common.openInGoogleMaps')}
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </AnalyticsWrapper>
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};
