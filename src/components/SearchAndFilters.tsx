
import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Building2, User, Heart, Monitor, Settings, ChevronDown, Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterState, ProfessionType, Specialization, Mode, InsuranceType } from "@/types";
import { trackFormInteraction } from "@/utils/analytics";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchAndFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  institutionNames: string[];
  filterOptions?: {
    cities: string[];
    specializations: string[];
    sessionModes: string[];
    insuranceTypes: string[];
    institutionTypes?: string[];
    minPrice: number;
    maxPrice: number;
  };
}

export const SearchAndFilters = ({
  filters,
  onFiltersChange,
  institutionNames,
  filterOptions
}: SearchAndFiltersProps) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState(filters.priceRange[0].toString());
  const [maxPriceInput, setMaxPriceInput] = useState(filters.priceRange[1].toString());
  const { t } = useLanguage();

  // Default filter options (fallback)
  const cities = filterOptions?.cities || ["Jakarta, Indonesia", "Surabaya, Indonesia", "Medan, Indonesia"];
  const specializations = filterOptions?.specializations || ["Depression", "Anxiety", "Trauma", "Relationship Issues", "ADHD", "OCD", "Personality Disorders", "Family Therapy"];
  const sessionModeOptions = filterOptions?.sessionModes || ["text", "voice", "video", "offline"];
  const insuranceOptions = filterOptions?.insuranceTypes || [];
  const institutionTypeOptions = filterOptions?.institutionTypes || [];
  // Use prices directly from database without fallbacks
  const minPrice = filterOptions?.minPrice || 0;
  const maxPrice = filterOptions?.maxPrice || 0;

  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      text: "Text Chat",
      voice: "Voice Call",
      video: "Video Call",
      offline: "In-Person"
    };
    return labels[mode] || mode;
  };

  const getInstitutionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      independent: "Private Practice",
      clinic: "Clinic",
      faskes1: "Faskes 1",
      faskes2: "Faskes 2"
    };
    return labels[type] || type;
  };

  const getInsuranceLabel = (insurance: string) => {
    const normalized = insurance.toLowerCase();
    if (normalized === "bpjs") return "BPJS";
    if (normalized === "private" || normalized === "private insurance") return t('insurance.privateInsurance');
    if (normalized === "none") return t('insurance.noInsurance');
    return insurance;
  };

  // Update local state when filters change from parent
  useEffect(() => {
    setPriceRange(filters.priceRange);
    setMinPriceInput(filters.priceRange[0].toString());
    setMaxPriceInput(filters.priceRange[1].toString());
  }, [filters.priceRange]);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
    if (value.trim()) {
      trackFormInteraction('search', 'search_input', 'search_term');
    }
  };

  const handleLocationSelect = useCallback(
    (value: string) => {
      const newLocations = filters.locations.includes(value)
        ? filters.locations.filter((loc) => loc !== value)
        : [...filters.locations, value];
      onFiltersChange({ ...filters, locations: newLocations });
      trackFormInteraction('filter', 'location_changed');
    },
    [filters, onFiltersChange]
  );

  const handleInstitutionSelect = useCallback(
    (value: string) => {
      const newInstitutions = filters.institutions.includes(value)
        ? filters.institutions.filter((ins) => ins !== value)
        : [...filters.institutions, value];
      onFiltersChange({ ...filters, institutions: newInstitutions });
      trackFormInteraction('filter', 'institution_changed');
    },
    [filters, onFiltersChange]
  );

  const handleProfessionSelect = useCallback(
    (value: string) => {
      const newProfessions = filters.professionTypes.includes(value as ProfessionType)
        ? filters.professionTypes.filter((prof) => prof !== value)
        : [...filters.professionTypes, value as ProfessionType];
      onFiltersChange({ ...filters, professionTypes: newProfessions });
      trackFormInteraction('filter', 'profession_changed');
    },
    [filters, onFiltersChange]
  );

  const handleSpecializationSelect = useCallback(
    (value: string) => {
      const newSpecializations = filters.specializations.includes(value as Specialization)
        ? filters.specializations.filter((spec) => spec !== value)
        : [...filters.specializations, value as Specialization];
      onFiltersChange({ ...filters, specializations: newSpecializations });
      trackFormInteraction('filter', 'specialization_changed');
    },
    [filters, onFiltersChange]
  );

  const handleModeSelect = useCallback(
    (value: string) => {
      const newModes = filters.modes.includes(value as Mode)
        ? filters.modes.filter((mode) => mode !== value)
        : [...filters.modes, value as Mode];
      onFiltersChange({ ...filters, modes: newModes });
      trackFormInteraction('filter', 'mode_changed');
    },
    [filters, onFiltersChange]
  );

  const handleInsuranceSelect = useCallback(
    (value: string) => {
      const newInsurance = filters.insurance.includes(value as InsuranceType)
        ? filters.insurance.filter((ins) => ins !== value)
        : [...filters.insurance, value as InsuranceType];
      onFiltersChange({ ...filters, insurance: newInsurance });
      trackFormInteraction('filter', 'insurance_changed');
    },
    [filters, onFiltersChange]
  );

  const handleInstitutionTypeSelect = useCallback(
    (value: string) => {
      const newInstitutionTypes = filters.institutionTypes.includes(value as any)
        ? filters.institutionTypes.filter((type) => type !== value)
        : [...filters.institutionTypes, value as any];
      onFiltersChange({ ...filters, institutionTypes: newInstitutionTypes });
      trackFormInteraction('filter', 'institution_type_changed');
    },
    [filters, onFiltersChange]
  );

  const handlePriceRangeChange = (priceRange: [number, number]) => {
    onFiltersChange({ ...filters, priceRange });
    setMinPriceInput(priceRange[0].toString());
    setMaxPriceInput(priceRange[1].toString());
    trackFormInteraction('filter', 'price_range_changed');
  };

  const handleMinPriceChange = (value: string) => {
    setMinPriceInput(value);
    const numValue = parseInt(value) || 0;
    const newMin = Math.max(0, Math.min(numValue, priceRange[1]));
    const newRange: [number, number] = [newMin, priceRange[1]];
    setPriceRange(newRange);
  };

  const handleMaxPriceChange = (value: string) => {
    setMaxPriceInput(value);
    const numValue = parseInt(value) || maxPrice;
    const newMax = Math.max(priceRange[0], Math.min(numValue, maxPrice));
    const newRange: [number, number] = [priceRange[0], newMax];
    setPriceRange(newRange);
  };

  const handlePriceInputBlur = () => {
    handlePriceRangeChange(priceRange);
  };

  const handleIncludeNullPriceChange = (checked: boolean) => {
    onFiltersChange({ ...filters, includeNullPrice: checked });
    trackFormInteraction('filter', 'include_null_price_changed');
  };

  const getActiveFilterCount = (filterArray: any[]) => {
    return filterArray.length;
  };

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle & Search */}
      <div className="flex items-center gap-2 md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-3 py-2"
        >
          {showMobileFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
        </Button>
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input
              type="text"
              placeholder={t('search.placeholder')}
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-7 text-sm rounded-full border-gray-200 h-8"
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters - Collapsible */}
      {showMobileFilters && (
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {/* City Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-3 py-2 h-auto text-xs font-medium justify-center flex items-center gap-1"
                >
                  <MapPin className="h-3 w-3" />
                  <span>{t('filters.city')}</span>
                  {getActiveFilterCount(filters.locations) > 0 && (
                    <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                      {getActiveFilterCount(filters.locations)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('filters.city')}</h3>
                  <div className="flex flex-wrap gap-1">
                    {cities.map((location) => (
                      <button
                        key={location}
                        onClick={() => handleLocationSelect(location)}
                        className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                          filters.locations.includes(location)
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {location.split(',')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Specializations Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-3 py-2 h-auto text-xs font-medium justify-center flex items-center gap-1"
                >
                  <Heart className="h-3 w-3" />
                  <span>{t('filters.specialization')}</span>
                  {getActiveFilterCount(filters.specializations) > 0 && (
                    <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                      {getActiveFilterCount(filters.specializations)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('filters.specialization')}</h3>
                  <div className="flex flex-wrap gap-1">
                    {specializations.map((specialization) => (
                      <button
                        key={specialization}
                        onClick={() => handleSpecializationSelect(specialization)}
                        className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                          filters.specializations.includes(specialization as Specialization)
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {specialization}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Session Mode Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-3 py-2 h-auto text-xs font-medium justify-center flex items-center gap-1"
                >
                  <Monitor className="h-3 w-3" />
                  <span>{t('filters.sessionMode')}</span>
                  {getActiveFilterCount(filters.modes) > 0 && (
                    <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                      {getActiveFilterCount(filters.modes)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('filters.sessionMode')}</h3>
                  <div className="flex flex-wrap gap-1">
                    {sessionModeOptions.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => handleModeSelect(mode)}
                        className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                          filters.modes.includes(mode as Mode)
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {getModeLabel(mode)}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Price Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-3 py-2 h-auto text-xs font-medium justify-center flex items-center gap-1"
                >
                  <Settings className="h-3 w-3" />
                  <span>{t('filters.priceRange')}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('filters.sessionCost')}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">{t('search.filters.minimum')}</label>
                        <Input
                          type="number"
                          value={minPriceInput}
                          onChange={(e) => handleMinPriceChange(e.target.value)}
                          onBlur={handlePriceInputBlur}
                          className="text-sm"
                          min={0}
                          max={maxPrice}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">{t('search.filters.maximum')}</label>
                        <Input
                          type="number"
                          value={maxPriceInput}
                          onChange={(e) => handleMaxPriceChange(e.target.value)}
                          onBlur={handlePriceInputBlur}
                          className="text-sm"
                          min={0}
                          max={maxPrice}
                        />
                      </div>
                    </div>
                    
                    <Slider
                      value={priceRange}
                      max={maxPrice}
                      step={25000}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      onValueCommit={() => handlePriceRangeChange(priceRange)}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Rp {priceRange[0].toLocaleString()}</span>
                      <span>Rp {priceRange[1].toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Checkbox 
                        id="include-null-price-mobile"
                        checked={filters.includeNullPrice || false}
                        onCheckedChange={handleIncludeNullPriceChange}
                      />
                      <label 
                        htmlFor="include-null-price-mobile"
                        className="text-sm text-foreground cursor-pointer"
                      >
                        {t('detail.includePriceUponRequest')}
                      </label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Insurance Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-3 py-2 h-auto text-xs font-medium justify-center flex items-center gap-1"
                >
                  <Settings className="h-3 w-3" />
                  <span>{t('filters.insurance')}</span>
                  {getActiveFilterCount(filters.insurance) > 0 && (
                    <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                      {getActiveFilterCount(filters.insurance)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">{t('filters.insurance')}</h3>
                  <div className="flex flex-wrap gap-1">
                    {insuranceOptions.map((insurance) => (
                      <button
                        key={insurance}
                        onClick={() => handleInsuranceSelect(insurance)}
                        className={`px-3 py-1.5 rounded-full border transition-colors text-sm ${
                          filters.insurance.includes(insurance as InsuranceType)
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {getInsuranceLabel(insurance)}
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Desktop Filters - Original Layout */}
      <div className="hidden md:flex items-center gap-1 flex-nowrap">
        {/* City Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
            >
              <MapPin className="h-3 w-3 mr-1" />
              {t('filters.city')}
              {getActiveFilterCount(filters.locations) > 0 && (
                <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                  {getActiveFilterCount(filters.locations)}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t('filters.city')}</h3>
              <div className="flex flex-wrap gap-1">
                {cities.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                      filters.locations.includes(location)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {location.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Specialization Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
            >
              <Heart className="h-3 w-3 mr-1" />
              {t('filters.specialization')}
              {getActiveFilterCount(filters.specializations) > 0 && (
                <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                  {getActiveFilterCount(filters.specializations)}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t('filters.specialization')}</h3>
              <div className="flex flex-wrap gap-1">
                {specializations.map((specialization) => (
                  <button
                    key={specialization}
                    onClick={() => handleSpecializationSelect(specialization)}
                    className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                      filters.specializations.includes(specialization as Specialization)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {specialization}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Session Mode Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
            >
              <Monitor className="h-3 w-3 mr-1" />
              {t('filters.sessionMode')}
              {getActiveFilterCount(filters.modes) > 0 && (
                <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                  {getActiveFilterCount(filters.modes)}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t('filters.sessionMode')}</h3>
              <div className="flex flex-wrap gap-1">
                {sessionModeOptions.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleModeSelect(mode)}
                    className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                      filters.modes.includes(mode as Mode)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {getModeLabel(mode)}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Price Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
            >
              <Settings className="h-3 w-3 mr-1" />
              {t('filters.priceRange')}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t('filters.sessionCost')}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t('search.filters.minimum')}</label>
                    <Input
                      type="number"
                      value={minPriceInput}
                      onChange={(e) => handleMinPriceChange(e.target.value)}
                      onBlur={handlePriceInputBlur}
                      className="text-sm"
                      min={minPrice}
                      max={maxPrice}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t('search.filters.maximum')}</label>
                    <Input
                      type="number"
                      value={maxPriceInput}
                      onChange={(e) => handleMaxPriceChange(e.target.value)}
                      onBlur={handlePriceInputBlur}
                      className="text-sm"
                      min={minPrice}
                      max={maxPrice}
                    />
                  </div>
                </div>
                
                <Slider
                  value={priceRange}
                  min={minPrice}
                  max={maxPrice}
                  step={25000}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  onValueCommit={() => handlePriceRangeChange(priceRange)}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Rp {priceRange[0].toLocaleString()}</span>
                  <span>Rp {priceRange[1].toLocaleString()}</span>
                </div>
                
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Checkbox 
                    id="include-null-price"
                    checked={filters.includeNullPrice || false}
                    onCheckedChange={handleIncludeNullPriceChange}
                  />
                  <label 
                    htmlFor="include-null-price"
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {t('detail.includePriceUponRequest')}
                  </label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Insurance Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
            >
              <Settings className="h-3 w-3 mr-1" />
              {t('filters.insurance')}
              {getActiveFilterCount(filters.insurance) > 0 && (
                <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                  {getActiveFilterCount(filters.insurance)}
                </Badge>
              )}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t('filters.insurance')}</h3>
              <div className="flex flex-wrap gap-1">
                {insuranceOptions.map((insurance) => (
                  <button
                    key={insurance}
                    onClick={() => handleInsuranceSelect(insurance)}
                    className={`px-3 py-1.5 rounded-full border transition-colors text-sm ${
                      filters.insurance.includes(insurance as InsuranceType)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {getInsuranceLabel(insurance)}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Institution Type Filter */}
        {institutionTypeOptions.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
              >
                <Building2 className="h-3 w-3 mr-1" />
                {t('filters.institutionType')}
                {getActiveFilterCount(filters.institutionTypes) > 0 && (
                  <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                    {getActiveFilterCount(filters.institutionTypes)}
                  </Badge>
                )}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">{t('filters.institutionType')}</h3>
                <div className="flex flex-wrap gap-1">
                  {institutionTypeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleInstitutionTypeSelect(type)}
                      className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                        filters.institutionTypes.includes(type as any)
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {getInstitutionTypeLabel(type)}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <div className="h-6 w-px bg-border mx-1"></div>

        {/* Desktop Search Input */}
        <div className="flex-1 ml-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
            <Input
              type="text"
              placeholder={t('search.placeholder')}
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-7 text-sm rounded-full border-gray-200 h-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
