import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Location {
  id: string;
  name?: string;
  address: string;
  city: string;
  province: string;
  country: string;
}

interface PractitionerLocationsProps {
  locations: Location[];
}

export const PractitionerLocations = ({ locations }: PractitionerLocationsProps) => {
  const { t } = useLanguage();
  if (locations.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Location{locations.length > 1 ? "s" : ""} ({locations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {locations.map((location) => {
          const encodedAddress = encodeURIComponent(location.address);
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
          
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

                {/* Map Preview - Click to open in Google Maps */}
                <a
                  href={mapsUrl}
                  target="_top"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    console.log('Link clicked!', mapsUrl);
                  }}
                  className="block bg-muted rounded-lg h-48 hover:bg-muted/80 transition-colors group no-underline"
                >
                  <div className="h-full flex flex-col items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-foreground transition-colors" />
                    <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors flex items-center gap-1">
                      {t('common.clickOpenGoogleMaps')}
                      <ExternalLink className="h-3 w-3" />
                    </p>
                  </div>
                </a>
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};
