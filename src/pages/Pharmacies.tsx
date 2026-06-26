import { useState, useMemo } from "react";
import { AlertTriangle, MapPin, ExternalLink, ChevronDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSEO } from "@/components/PageSEO";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { FilterState } from "@/types";

interface Pharmacy {
  name: string;
  description: string;
  city: string;
  website?: string;
  tags?: string[];
}

const pharmacies: Pharmacy[] = [
  {
    name: "Kimia Farma",
    description:
      "National pharmacy chain with broad availability of psychiatric medications across most cities in Indonesia.",
    city: "Nationwide",
    website: "https://www.kimiafarmaapotek.co.id/",
    tags: ["Chain", "Nationwide"],
  },
  {
    name: "Apotek K-24",
    description:
      "24-hour pharmacy chain that commonly stocks antidepressants, anxiolytics, and antipsychotics.",
    city: "Nationwide",
    website: "https://www.k24klik.com/",
    tags: ["Chain", "24 hours"],
  },
  {
    name: "Century Healthcare",
    description:
      "Pharmacy and health store chain found in major malls; carries common psychiatric prescriptions.",
    city: "Nationwide",
    website: "https://century-healthcare.co.id/",
    tags: ["Chain"],
  },
  {
    name: "Guardian Pharmacy",
    description:
      "Health and beauty retailer with pharmacy counters in major cities for prescription fulfillment.",
    city: "Nationwide",
    website: "https://www.guardian.co.id/",
    tags: ["Chain"],
  },
];

const allCities = Array.from(new Set(pharmacies.map((p) => p.city)));

const Pharmacies = () => {
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
          !p.description.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      if (filters.locations.length > 0) {
        if (!filters.locations.some((loc) => p.city.includes(loc.split(",")[0]))) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

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
            <div className="flex items-start gap-2 cursor-pointer w-full">
              <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
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
        {filteredPharmacies.map((p) => (
          <Card key={p.name}>
            <CardHeader>
              <CardTitle className="text-xl">{p.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {p.city}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{p.description}</p>
              {p.tags && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              )}
              {p.website && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(p.website, "_blank", "noopener,noreferrer")}
                >
                  Visit website
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-8">
        Stock availability varies by branch. Call ahead to confirm your specific
        medication is in stock before visiting.
      </p>
    </div>
  );
};

export default Pharmacies;
