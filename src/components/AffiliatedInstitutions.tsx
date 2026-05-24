import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { getPlaceholderImage } from "@/utils/placeholderImage";

export interface AffiliatedInstitution {
  id: string;
  name: string;
  image?: string;
  locations: { id: string; name?: string; address?: string; city?: string; province?: string; country?: string }[];
}

interface Props {
  institutions: AffiliatedInstitution[];
}

export const AffiliatedInstitutions = ({ institutions }: Props) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  const allCities = useMemo(() => {
    const set = new Set<string>();
    institutions.forEach(inst =>
      inst.locations.forEach(loc => {
        if (loc.city && loc.city !== "Unknown City") set.add(loc.city);
      })
    );
    return Array.from(set).sort();
  }, [institutions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return institutions.filter(inst => {
      if (q) {
        const hay = [
          inst.name,
          ...inst.locations.flatMap(l => [l.name, l.address, l.city, l.province, l.country]),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (selectedCities.length > 0) {
        if (!inst.locations.some(l => l.city && selectedCities.includes(l.city))) return false;
      }
      return true;
    });
  }, [institutions, search, selectedCities]);

  if (institutions.length === 0) return null;
  const placeholder = getPlaceholderImage("institution");

  const toggleCity = (city: string) =>
    setSelectedCities(prev => (prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {t('detail.affiliatedInstitutions') || 'Affiliated Institutions'} ({filtered.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t('detail.searchInstitutions') || 'Search institutions...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 rounded-full border-gray-200"
            />
          </div>
          {allCities.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-4 py-2 h-auto text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{t('filters.location') || 'Location'}</span>
                  {selectedCities.length > 0 && (
                    <Badge className="ml-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedCities.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('filters.location') || 'Location'}</h3>
                  <div className="flex flex-wrap gap-2">
                    {allCities.map(city => (
                      <button
                        key={city}
                        onClick={() => toggleCity(city)}
                        className={`px-3 py-1.5 rounded-full border transition-colors text-sm ${
                          selectedCities.includes(city)
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                  {selectedCities.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCities([])} className="h-auto text-xs">
                      {t('filters.clearAll') || 'Clear all'}
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {t('detail.noResults') || 'No institutions match your filters.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(inst => {
              const cities = Array.from(
                new Set(
                  inst.locations
                    .map(l => l.city)
                    .filter((c): c is string => !!c && c !== 'Unknown City')
                )
              );
              return (
                <button
                  key={inst.id}
                  onClick={() => navigate(`/bureau/${inst.id}`)}
                  className="text-left flex items-center gap-3 p-3 rounded-lg border hover:border-primary hover:bg-accent/40 transition-colors"
                >
                  <ImageWithFallback
                    src={inst.image}
                    fallbackSrc={placeholder}
                    alt={inst.name}
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-medium text-primary truncate">{inst.name}</div>
                    {cities.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{cities.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};