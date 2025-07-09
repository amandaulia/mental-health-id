
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";

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
}

export const BureauLocations = ({ locations }: BureauLocationsProps) => {
  const [expandedMaps, setExpandedMaps] = useState<Record<string, boolean>>({});

  const toggleMapExpansion = (locationId: string) => {
    setExpandedMaps(prev => ({
      ...prev,
      [locationId]: !prev[locationId]
    }));
  };

  const handleMapClick = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  if (locations.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location{locations.length > 1 ? 's' : ''} ({locations.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {locations.map((location) => (
          <Card key={location.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  {location.name && (
                    <p className="font-semibold text-lg mb-1">{location.name}</p>
                  )}
                  <p className="font-medium">{location.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {location.city}, {location.province}, {location.country}
                  </p>
                </div>
              </div>
              
              {/* Map Preview */}
              <div className="space-y-2">
                <div className={`bg-muted rounded-lg flex items-center justify-center transition-all duration-200 relative group ${
                  expandedMaps[location.id] ? 'h-96' : 'h-48'
                }`}>
                  <p className="text-muted-foreground">Map preview</p>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg cursor-pointer">
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => toggleMapExpansion(location.id)}
                      >
                        {expandedMaps[location.id] ? 'Collapse' : 'Expand'}
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleMapClick(location.address)}
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
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
