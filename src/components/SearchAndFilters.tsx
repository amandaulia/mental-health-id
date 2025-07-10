
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Building2, User, Heart, Monitor, Settings, ChevronDown } from "lucide-react";
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
import { FilterState, ProfessionType, Specialization, Mode, InsuranceType } from "@/types";
import { trackFormInteraction } from "@/utils/analytics";

interface SearchAndFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  institutionNames: string[];
}

export const SearchAndFilters = ({
  filters,
  onFiltersChange,
  institutionNames
}: SearchAndFiltersProps) => {
  const [priceRange, setPriceRange] = useState(filters.priceRange);

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

  const handlePriceRangeChange = (priceRange: [number, number]) => {
    onFiltersChange({ ...filters, priceRange });
    trackFormInteraction('filter', 'price_range_changed');
  };

  const getActiveFilterCount = (filterArray: any[]) => {
    return filterArray.length;
  };

  return (
    <div className="flex items-center gap-1 flex-nowrap">{/* Removed overflow-x-auto and reduced gap */}
      {/* Location Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
          >
            <MapPin className="h-3 w-3 mr-1" />
            Location
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
            <h3 className="text-lg font-semibold text-foreground">Location</h3>
            <div className="flex flex-wrap gap-1">
              {["Jakarta, Indonesia", "Surabaya, Indonesia", "Medan, Indonesia"].map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                    filters.locations.includes(location)
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Institution Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
          >
            <Building2 className="h-3 w-3 mr-1" />
            Institution
            {getActiveFilterCount(filters.institutions) > 0 && (
              <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                {getActiveFilterCount(filters.institutions)}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Institution</h3>
            <div className="flex flex-wrap gap-1 max-h-64 overflow-y-auto">
              {institutionNames.map((institution) => (
                <button
                  key={institution}
                  onClick={() => handleInstitutionSelect(institution)}
                  className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                    filters.institutions.includes(institution)
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {institution}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Profession Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
          >
            <User className="h-3 w-3 mr-1" />
            Profession
            {getActiveFilterCount(filters.professionTypes) > 0 && (
              <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                {getActiveFilterCount(filters.professionTypes)}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Profession Type</h3>
            <div className="flex flex-wrap gap-1">
              {["Psychologist", "Psychiatrist", "Art Therapist", "Music Therapist", "Counselor", "Social Worker"].map((profession) => (
                <button
                  key={profession}
                  onClick={() => handleProfessionSelect(profession)}
                  className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                    filters.professionTypes.includes(profession as ProfessionType)
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {profession}
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
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
          >
            <Heart className="h-3 w-3 mr-1" />
            Specializations
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
            <h3 className="text-lg font-semibold text-foreground">Specializations</h3>
            <div className="flex flex-wrap gap-1">
              {["Depression", "Anxiety", "Trauma", "Relationship Issues", "ADHD", "OCD", "Personality Disorders", "Family Therapy"].map((specialization) => (
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
            Session Mode
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
            <h3 className="text-lg font-semibold text-foreground">Session Mode</h3>
            <div className="flex flex-wrap gap-1">
              {[
                { value: "text", label: "Text Chat" },
                { value: "voice", label: "Voice Call" },
                { value: "video", label: "Video Call" },
                { value: "offline", label: "In-Person" }
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => handleModeSelect(mode.value)}
                  className={`px-3 py-1.5 rounded-full border transition-colors text-sm whitespace-nowrap ${
                    filters.modes.includes(mode.value as Mode)
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Advanced Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200 rounded-full px-2 py-1 h-auto text-sm font-medium whitespace-nowrap"
          >
            <Settings className="h-3 w-3 mr-1" />
            Advanced
            {getActiveFilterCount(filters.insurance) > 0 && (
              <Badge className="ml-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-full">
                {getActiveFilterCount(filters.insurance)}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Advanced Filters</h3>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Insurance</h4>
              <div className="flex flex-wrap gap-1">
                {["Private", "BPJS", "None"].map((insurance) => (
                  <button
                    key={insurance}
                    onClick={() => handleInsuranceSelect(insurance.toLowerCase())}
                    className={`px-3 py-1.5 rounded-full border transition-colors text-sm ${
                      filters.insurance.includes(insurance.toLowerCase() as InsuranceType)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {insurance}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Session Cost (IDR)</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Minimum</label>
                    <div className="bg-gray-50 rounded-full px-2 py-1 border text-center">
                      <span className="text-sm font-medium">{priceRange[0].toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Maximum</label>
                    <div className="bg-gray-50 rounded-full px-2 py-1 border text-center">
                      <span className="text-sm font-medium">{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Slider
                  value={priceRange}
                  max={525000}
                  step={25000}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  onValueCommit={() => handlePriceRangeChange(priceRange)}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Rp {priceRange[0].toLocaleString()}</span>
                  <span>Rp {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Input */}
      <div className="flex-1 ml-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
          <Input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-7 text-sm rounded-full border-gray-200 h-8"
          />
        </div>
      </div>
    </div>
  );
};
