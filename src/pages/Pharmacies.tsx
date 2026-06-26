import { useState, useMemo, useEffect } from "react";
import { AlertTriangle, MapPin, ExternalLink, ChevronDown, Phone, Instagram, Globe, Map as MapIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSEO } from "@/components/PageSEO";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { FilterState } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface PharmacyContact {
  contact_type: string;
  value: string;
  link: string | null;
}
interface Pharmacy {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  province: string | null;
  contacts: PharmacyContact[];
}

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("location")
        .select("id,name,address,city,province,location_contacts(contact_details(contact_type,value,link))")
        .eq("location_type", "Pharmacy")
        .order("name");
      if (!error && data) {
        setPharmacies(
          data.map((r: any) => ({
            id: r.id,
            name: r.name,
            address: r.address,
            city: r.city,
            province: r.province,
            contacts: (r.location_contacts ?? [])
              .map((lc: any) => lc.contact_details)
              .filter(Boolean),
          }))
        );
      }
      setLoading(false);
    })();
  }, []);

  const allCities = useMemo(
    () => Array.from(new Set(pharmacies.map((p) => p.city).filter(Boolean))) as string[],
    [pharmacies]
  );

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    locations: [],
    institutions: [],
    institutionTypes: [],
    professionTypes: [],
    specializations: [],
    priceRange: [0, 2000000],
    modes: [],
    insurance: [],
  });

  const filteredPharmacies = useMemo(() => {
    return pharmacies.filter((p) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(searchLower) &&
          !(p.address ?? "").toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      if (filters.locations.length > 0 && p.city) {
        if (!filters.locations.some((loc) => p.city!.includes(loc.split(",")[0]))) {
          return false;
        }
      }
      return true;
    });
  }, [filters, pharmacies]);

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.filter((item) => item !== value);
    setFilters((prev) => ({ ...prev, [type]: newArray }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      search: "",
      locations: [],
      institutions: [],
      institutionTypes: [],
      professionTypes: [],
      specializations: [],
      priceRange: [0, 2000000],
      modes: [],
      insurance: [],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageSEO
        pageKey="pharmacies"
        path="/pharmacies"
        title="Pharmacies for Psychiatric Medication"
        description="Pharmacies in Indonesia that dispense psychiatric medication. A valid prescription from a licensed doctor is always required."
      />

      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">Pharmacies</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          Pharmacies in Indonesia known to dispense psychiatric medication such as
          antidepressants, anxiolytics, mood stabilizers, and antipsychotics.
        </p>
      </div>

      {/* Search and Browse Section */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <SearchAndFilters
            filters={filters}
            onFiltersChange={setFilters}
            institutionNames={[]}
            hiddenFilters={["sessionMode", "priceRange", "insurance"]}
            filterOptions={{ cities: allCities.map((c) => `${c}, Indonesia`), specializations: [], sessionModes: [], insuranceTypes: [], minPrice: 0, maxPrice: 0 }}
          />
        </div>
        <div className="mt-4">
          <FilterTags
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        {filteredPharmacies.length} pharmacies
      </div>

      <Collapsible>
        <Alert className="mb-8 border-yellow-500/30 bg-yellow-500/10">
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer w-full">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0" />
              <div className="flex-1">
                <AlertTitle className="text-yellow-700 flex items-center justify-between gap-2">
                  <span>Prescription always required</span>
                  <ChevronDown className="h-4 w-4 text-yellow-600 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180" />
                </AlertTitle>
                <CollapsibleContent>
                  <AlertDescription className="text-yellow-700/80 mt-2">
                    Psychiatric medications listed here are prescription-only. Pharmacies will
                    not dispense them without a valid, signed prescription from a licensed
                    psychiatrist or doctor. Never self-medicate, share medication, or buy
                    psychiatric drugs from unverified online sellers.
                  </AlertDescription>
                </CollapsibleContent>
              </div>
            </div>
          </CollapsibleTrigger>
        </Alert>
      </Collapsible>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading && (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && filteredPharmacies.map((p) => {
          const phone = p.contacts.find((c) => c.contact_type === "Phone");
          const instagram = p.contacts.find((c) => c.contact_type === "Instagram");
          const website = p.contacts.find((c) => c.contact_type === "Website");
          const fullAddress = [p.address, p.city, p.province].filter(Boolean).join(", ");
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${fullAddress}`)}`;
          return (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="text-xl">{p.name}</CardTitle>
                {(p.address || p.city) && (
                  <CardDescription className="flex items-start gap-1">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>{fullAddress}</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(mapsUrl, "_blank", "noopener,noreferrer")}
                  >
                    <MapIcon className="mr-2 h-3.5 w-3.5" />
                    Google Maps
                  </Button>
                  {phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(phone.link || `tel:${phone.value}`, "_blank", "noopener,noreferrer")}
                    >
                      <Phone className="mr-2 h-3.5 w-3.5" />
                      {phone.value}
                    </Button>
                  )}
                  {instagram && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(instagram.link || `https://instagram.com/${instagram.value.replace("@","")}`, "_blank", "noopener,noreferrer")}
                    >
                      <Instagram className="mr-2 h-3.5 w-3.5" />
                      {instagram.value}
                    </Button>
                  )}
                  {website && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(website.link || website.value, "_blank", "noopener,noreferrer")}
                    >
                      <Globe className="mr-2 h-3.5 w-3.5" />
                      Website
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Stock availability varies by branch. Call ahead to confirm your specific
        medication is in stock before visiting.
      </p>
    </div>
  );
};

export default Pharmacies;
