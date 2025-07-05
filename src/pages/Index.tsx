
import { useState, useMemo } from "react";
import { FilterState, Resource } from "@/types";
import { allResources, mockPractitioners, mockBureaus } from "@/data/mockData";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { PractitionerCard } from "@/components/PractitionerCard";
import { BureauCard } from "@/components/BureauCard";

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    bureauNames: [],
    specializations: [],
    priceRange: [0, 2000000],
    modes: [],
    types: [],
    insurance: []
  });

  const bureauNames = useMemo(() => {
    const names = new Set<string>();
    mockPractitioners.forEach(p => names.add(p.bureauName));
    mockBureaus.forEach(b => names.add(b.name));
    return Array.from(names);
  }, []);

  const filteredResources = useMemo(() => {
    return allResources.filter((resource) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchName = resource.type === "practitioner" 
          ? resource.name.toLowerCase().includes(searchLower)
          : resource.name.toLowerCase().includes(searchLower);
        const matchBureau = resource.type === "practitioner"
          ? resource.bureauName.toLowerCase().includes(searchLower)
          : resource.name.toLowerCase().includes(searchLower);
        
        if (!matchName && !matchBureau) return false;
      }

      // Bureau names filter
      if (filters.bureauNames.length > 0) {
        const bureauName = resource.type === "practitioner" ? resource.bureauName : resource.name;
        if (!filters.bureauNames.includes(bureauName)) return false;
      }

      // Type-specific filters
      if (resource.type === "practitioner") {
        // Specializations filter
        if (filters.specializations.length > 0) {
          const hasMatchingSpec = resource.specializations.some(spec => 
            filters.specializations.includes(spec)
          );
          if (!hasMatchingSpec) return false;
        }

        // Price range filter
        if (resource.priceRange.min > filters.priceRange[1] || 
            resource.priceRange.max < filters.priceRange[0]) {
          return false;
        }

        // Modes filter
        if (filters.modes.length > 0) {
          const hasMatchingMode = resource.modes.some(mode => 
            filters.modes.includes(mode)
          );
          if (!hasMatchingMode) return false;
        }
      }

      if (resource.type === "bureau") {
        // Bureau types filter
        if (filters.types.length > 0) {
          if (!filters.types.includes(resource.bureauType)) return false;
        }
      }

      // Insurance filter (applies to both)
      if (filters.insurance.length > 0) {
        const hasMatchingInsurance = resource.insurance.some(ins => 
          filters.insurance.includes(ins)
        );
        if (!hasMatchingInsurance) return false;
      }

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">
            Mental Health Resource Directory
          </h1>
          <p className="text-xl text-muted-foreground text-center">
            Find qualified psychologists, psychiatrists, and mental health clinics
          </p>
        </div>

        <div className="mb-8">
          <SearchAndFilters
            filters={filters}
            onFiltersChange={setFilters}
            bureauNames={bureauNames}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              {filteredResources.length} Resources Found
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id}>
                {resource.type === "practitioner" ? (
                  <PractitionerCard practitioner={resource} />
                ) : (
                  <BureauCard bureau={resource} />
                )}
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                No resources found matching your criteria.
              </p>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
