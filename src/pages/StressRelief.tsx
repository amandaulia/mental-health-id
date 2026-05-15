import { useState, useMemo, useEffect } from "react";
import React from "react";
import { FilterState } from "@/types";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { UnifiedCard, UnifiedCardData } from "@/components/UnifiedCard";
import { useActivities } from "@/hooks/useDatabase";
import { sortByCompleteness } from "@/utils/completeness";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackSearch, trackFilter } from "@/utils/analytics";
import { PageSEO } from "@/components/PageSEO";
import { useLanguage } from "@/contexts/LanguageContext";

const StressRelief = () => {
  const { t } = useLanguage();
  const { data: dbActivities, isLoading } = useActivities();
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
    if (!dbActivities) return [];
    const filtered = (dbActivities as any[]).filter((item) => {
      const orgName = item.activity_organizations?.[0]?.organization?.name || "";
      const city = item.activity_locations?.[0]?.location?.city || "";
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!item.name.toLowerCase().includes(searchLower) &&
            !orgName.toLowerCase().includes(searchLower) &&
            !city.toLowerCase().includes(searchLower)) return false;
      }
      return true;
    });
    return sortByCompleteness(filtered);
  }, [filters, dbActivities]);

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.filter(item => item !== value);
    setFilters(prev => ({ ...prev, [type]: newArray }));
    
    trackFilter(type, value, 'Stress Relief');
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
    
    trackFilter('clear_all', 'all_filters', 'Stress Relief');
  };

  useEffect(() => {
    if (filters.search) {
      trackSearch(filters.search, filteredData.length, 'Stress Relief');
    }
  }, [filters.search, filteredData]);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageSEO pageKey="stressRelief" path="/stress-relief" />
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">{t("pages.stressRelief.heroTitleA")}</span>{t("pages.stressRelief.heroTitleB")}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {t("pages.stressRelief.heroLead")}
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
            {t('stressRelief.findActivities')}
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

      {/* Activities List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredData.map((item: any) => {
          const cardData: UnifiedCardData = {
            type: "activity",
            id: item.id.toString(),
            image: item.image ?? undefined,
            name: item.name,
            city: item.activity_locations?.[0]?.location?.city || "",
            organizationName: item.activity_organizations?.[0]?.organization?.name || "",
            activityType: item.activity_type?.[0] || "",
            price: typeof item.price === 'string' ? parseInt(item.price) : (item.price ?? 0)
          };

          return (
            <div key={item.id} className="transform transition-all duration-200 hover:scale-[1.02]">
              <UnifiedCard data={cardData} />
            </div>
          );
        })}
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground mt-8">Loading...</div>
      ) : filteredData.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          {t('stressRelief.noActivities')}
        </div>
      )}
    </div>
  );
};

export default StressRelief;
