
import { useState, useMemo, useEffect } from "react";
import { FilterState } from "@/types";
import { SearchAndFilters } from "@/components/SearchAndFilters";
import { FilterTags } from "@/components/FilterTags";
import { UnifiedCard, UnifiedCardData } from "@/components/UnifiedCard";
import { mockPeerCounselingData } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackSearch, trackFilter } from "@/utils/analytics";
import { PageSEO } from "@/components/PageSEO";
import { useLanguage } from "@/contexts/LanguageContext";

const PeerCounseling = () => {
  const { t } = useLanguage();
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
    return mockPeerCounselingData.filter((item) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!item.name.toLowerCase().includes(searchLower) && 
            !item.city.toLowerCase().includes(searchLower)) return false;
      }
      return true;
    });
  }, [filters]);

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    const currentArray = filters[type] as string[];
    const newArray = currentArray.filter(item => item !== value);
    setFilters(prev => ({ ...prev, [type]: newArray }));
    
    trackFilter(type, value, 'Peer Counseling');
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
    
    trackFilter('clear_all', 'all_filters', 'Peer Counseling');
  };

  useEffect(() => {
    if (filters.search) {
      trackSearch(filters.search, filteredData.length, 'Peer Counseling');
    }
  }, [filters.search, filteredData]);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <PageSEO pageKey="peer" path="/peer-counseling" />
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">{t("pages.peer.heroTitleA")}</span>{t("pages.peer.heroTitleB")}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
          {t("pages.peer.heroLead")}
        </p>
      </div>

      {/* Search and Browse Section */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
            Find Peer Support
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

      {/* Preview Sections */}
      <div className="space-y-8">
        {/* Peer Counseling & Support Groups Preview */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredData.map((item) => {
              const cardData: UnifiedCardData = {
                type: item.type === "peer-counseling" ? "peer-counseling" : "support-group",
                id: item.id,
                image: item.image,
                name: item.name,
                city: item.city,
                isVerified: item.isVerified,
                specialization: item.specialization,
                serviceType: item.serviceType,
                price: typeof item.price === 'string' ? parseInt(item.price) : item.price
              };

              return (
                <div key={item.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                  <UnifiedCard 
                    data={cardData} 
                    linkTo={`/peer-counseling/${item.id}`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerCounseling;
