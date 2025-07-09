
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

  const handleLocationChange = (locations: string[]) => {
    onFiltersChange({ ...filters, locations });
    trackFormInteraction('filter', 'location_changed');
  };

  const handleInstitutionChange = (institutions: string[]) => {
    onFiltersChange({ ...filters, institutions });
    trackFormInteraction('filter', 'institution_changed');
  };

  const handleProfessionChange = (professionTypes: ProfessionType[]) => {
    onFiltersChange({ ...filters, professionTypes });
    trackFormInteraction('filter', 'profession_changed');
  };

  const handleSpecializationChange = (specializations: Specialization[]) => {
    onFiltersChange({ ...filters, specializations });
    trackFormInteraction('filter', 'specialization_changed');
  };

  const handleModeChange = (modes: Mode[]) => {
    onFiltersChange({ ...filters, modes });
    trackFormInteraction('filter', 'mode_changed');
  };

  const handleInsuranceChange = (insurance: InsuranceType[]) => {
    onFiltersChange({ ...filters, insurance });
    trackFormInteraction('filter', 'insurance_changed');
  };

  const handlePriceRangeChange = (priceRange: [number, number]) => {
    onFiltersChange({ ...filters, priceRange });
    trackFormInteraction('filter', 'price_range_changed');
  };

  const handleLocationSelect = useCallback(
    (value: string) => {
      const newLocations = filters.locations.includes(value)
        ? filters.locations.filter((loc) => loc !== value)
        : [...filters.locations, value];
      handleLocationChange(newLocations);
    },
    [filters.locations, handleLocationChange]
  );

  const handleInstitutionSelect = useCallback(
    (value: string) => {
      const newInstitutions = filters.institutions.includes(value)
        ? filters.institutions.filter((ins) => ins !== value)
        : [...filters.institutions, value];
      handleInstitutionChange(newInstitutions);
    },
    [filters.institutions, handleInstitutionChange]
  );

  const handleProfessionSelect = useCallback(
    (value: string) => {
      const newProfessions = filters.professionTypes.includes(value as ProfessionType)
        ? filters.professionTypes.filter((prof) => prof !== value)
        : [...filters.professionTypes, value as ProfessionType];
      handleProfessionChange(newProfessions);
    },
    [filters.professionTypes, handleProfessionChange]
  );

  const handleSpecializationSelect = useCallback(
    (value: string) => {
      const newSpecializations = filters.specializations.includes(value as Specialization)
        ? filters.specializations.filter((spec) => spec !== value)
        : [...filters.specializations, value as Specialization];
      handleSpecializationChange(newSpecializations);
    },
    [filters.specializations, handleSpecializationChange]
  );

  const handleModeSelect = useCallback(
    (value: string) => {
      const newModes = filters.modes.includes(value as Mode)
        ? filters.modes.filter((mode) => mode !== value)
        : [...filters.modes, value as Mode];
      handleModeChange(newModes);
    },
    [filters.modes, handleModeChange]
  );

  const handleInsuranceSelect = useCallback(
    (value: string) => {
      const newInsurance = filters.insurance.includes(value as InsuranceType)
        ? filters.insurance.filter((ins) => ins !== value)
        : [...filters.insurance, value as InsuranceType];
      handleInsuranceChange(newInsurance);
    },
    [filters.insurance, handleInsuranceChange]
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by name, city, or institution..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select onValueChange={handleLocationSelect} defaultValue={filters.locations[0] || ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              {["Jakarta, Indonesia", "Surabaya, Indonesia", "Medan, Indonesia"].map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select onValueChange={handleInstitutionSelect} defaultValue={filters.institutions[0] || ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Institution" />
            </SelectTrigger>
            <SelectContent>
              {institutionNames.map((institution) => (
                <SelectItem key={institution} value={institution}>
                  {institution}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select onValueChange={handleProfessionSelect} defaultValue={filters.professionTypes[0] || ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Profession" />
            </SelectTrigger>
            <SelectContent>
              {["Psychologist", "Psychiatrist", "Counselor", "Therapist"].map((profession) => (
                <SelectItem key={profession} value={profession}>
                  {profession}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select onValueChange={handleSpecializationSelect} defaultValue={filters.specializations[0] || ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Specialization" />
            </SelectTrigger>
            <SelectContent>
              {["Depression", "Anxiety", "Trauma", "Relationship Issues"].map((specialization) => (
                <SelectItem key={specialization} value={specialization}>
                  {specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Price Range (IDR)</p>
        <Slider
          defaultValue={filters.priceRange}
          max={2000000}
          step={100000}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          onValueCommit={() => handlePriceRangeChange(priceRange)}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(priceRange[0])}</span>
          <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(priceRange[1])}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Select onValueChange={handleModeSelect} defaultValue={filters.modes[0] || ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Mode" />
            </SelectTrigger>
            <SelectContent>
              {["text", "voice", "video", "offline"].map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select onValueChange={handleInsuranceSelect} defaultValue={filters.insurance[0] || ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Insurance" />
            </SelectTrigger>
            <SelectContent>
              {["bpjs", "private", "none"].map((insurance) => (
                <SelectItem key={insurance} value={insurance}>
                  {insurance}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
