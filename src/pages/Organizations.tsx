import React, { useState, useMemo, useEffect } from "react";
import { FilterState } from "@/types";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { UnifiedCard, UnifiedCardData } from "@/components/UnifiedCard";
import { useOrganizations } from "@/hooks/useDatabase";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackSearch, trackFilter } from "@/utils/analytics";
import { PageSEO } from "@/components/PageSEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { sortByCompleteness } from "@/utils/completeness";

const Organizations = () => {
  const { t } = useLanguage();
  const { data: dbOrganizations, isLoading } = useOrganizations();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    locations: [],
    institutions: [],
    institutionTypes: [],
    professionTypes: [],
    specializations: [],
    priceRange: [0, 2000000],
    modes: [],
    insurance: []
  });

  const filteredData = useMemo(() => {
    if (!dbOrganizations) return [];
    const filtered = (dbOrganizations as any[]).filter((item) => {
      const city = item.organization_locations?.[0]?.location?.city || "";
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!item.name.toLowerCase().includes(searchLower) &&
            !city.toLowerCase().includes(searchLower)) return false;
      }

      if (filters.locations.length > 0) {
        const cityCountry = `${city}, Indonesia`;
        if (!filters.locations.some(loc => cityCountry.includes(loc.split(',')[0]))) return false;
      }

      return true;
    });
    return sortByCompleteness(filtered);
  }, [filters, dbOrganizations]);

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.filter(item => item !== value);
    setFilters(prev => ({ ...prev, [type]: newArray }));
    
    trackFilter(type, value, 'Organizations');
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
      insurance: []
    });
    
    trackFilter('clear_all', 'all_filters', 'Organizations');
  };

  useEffect(() => {
    if (filters.search) {
      trackSearch(filters.search, filteredData.length, 'Organizations');
    }
  }, [filters.search, filteredData]);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageSEO pageKey="organizations" path="/organizations" />
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">{t("pages.organizations.heroTitleA")}</span>{t("pages.organizations.heroTitleB")}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          {t("pages.organizations.heroLead")}
        </p>
      </div>

      {/* Search and Browse Section */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
            {t('organizations.browse')}
          </h2>
          <SearchAndFilters
            filters={filters}
            onFiltersChange={setFilters}
            institutionNames={[]}
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

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            {t('organizations.all')}
          </h2>
          <Button variant="outline" asChild>
            <a href="/organizations">
              {t('common.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((item: any) => {
            const cardData: UnifiedCardData = {
              type: "organization",
              id: item.id.toString(),
              image: item.image ?? undefined,
              name: item.name,
              city: item.organization_locations?.[0]?.location?.city || "",
              organizationType: item.specialization?.[0] || ""
            };

            return (
              <div key={item.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                <UnifiedCard 
                  data={cardData} 
                  linkTo={`/organizations/${item.id}`}
                />
              </div>
            );
          })}
        </div>
        {isLoading && (
          <div className="text-center text-muted-foreground mt-8">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
