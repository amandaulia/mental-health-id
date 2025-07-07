
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterState, Resource } from "@/types";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { PractitionerCard } from "@/components/PractitionerCard";
import { BureauCard } from "@/components/BureauCard";
import { usePractitioners, useInstitutions } from "@/hooks/useDatabase";
import { transformPractitioner, transformInstitution } from "@/utils/dataTransform";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    bureauNames: [],
    professionTypes: [],
    specializations: [],
    priceRange: [0, 2000000],
    modes: [],
    types: [],
    insurance: []
  });

  const { data: dbPractitioners, isLoading: practitionersLoading } = usePractitioners();
  const { data: dbInstitutions, isLoading: institutionsLoading } = useInstitutions();

  // Transform database data to match frontend types
  const allResources: Resource[] = useMemo(() => {
    const resources: Resource[] = [];
    
    if (dbPractitioners) {
      const transformedPractitioners = dbPractitioners.map(p => transformPractitioner(p));
      resources.push(...transformedPractitioners);
    }
    
    if (dbInstitutions) {
      resources.push(...dbInstitutions.map(transformInstitution));
    }
    
    return resources;
  }, [dbPractitioners, dbInstitutions]);

  // Load filters from URL params on mount
  useEffect(() => {
    const urlFilters: Partial<FilterState> = {};
    
    for (const [key, value] of searchParams.entries()) {
      if (key in filters) {
        if (Array.isArray(filters[key as keyof FilterState])) {
          urlFilters[key as keyof FilterState] = [value] as any;
        } else {
          urlFilters[key as keyof FilterState] = value as any;
        }
      }
    }
    
    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }
  }, []);

  const bureauNames = useMemo(() => {
    const names = new Set<string>();
    allResources.forEach(resource => {
      if (resource.type === "practitioner") {
        names.add(resource.bureauName);
      } else {
        names.add(resource.name);
      }
    });
    return Array.from(names);
  }, [allResources]);

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

      // Profession types filter
      if (filters.professionTypes.length > 0) {
        const hasMatchingProfession = resource.professionTypes.some(type => 
          filters.professionTypes.includes(type)
        );
        if (!hasMatchingProfession) return false;
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
        const allPrices = resource.services.map(s => s.price).filter(Boolean);
        if (allPrices.length > 0) {
          const minPrice = Math.min(...allPrices);
          const maxPrice = Math.max(...allPrices);
          if (minPrice > filters.priceRange[1] || maxPrice < filters.priceRange[0]) {
            return false;
          }
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
  }, [filters, allResources]);

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.filter(item => item !== value);
    setFilters(prev => ({ ...prev, [type]: newArray }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      search: "",
      bureauNames: [],
      professionTypes: [],
      specializations: [],
      priceRange: [0, 2000000],
      modes: [],
      types: [],
      insurance: []
    });
  };

  const isLoading = practitionersLoading || institutionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="text-center">Loading resources...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2 sm:mb-4">
            Mental Health Resource Directory
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-center">
            Find qualified psychologists, psychiatrists, and mental health clinics
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <SearchAndFilters
            filters={filters}
            onFiltersChange={setFilters}
            bureauNames={bureauNames}
          />
          <FilterTags
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold">
              {filteredResources.length} Resources Found
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
              <p className="text-lg sm:text-xl text-muted-foreground">
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
