
import { useState, useRef, useEffect } from "react";
import { FilterState, Specialization, Mode, InsuranceType, ProfessionType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, ChevronDown, X, MapPin, Building2, Stethoscope, DollarSign, Settings, MessageSquare } from "lucide-react";
import { specializations, professionTypes } from "@/data/mockData";
import { useLocations } from "@/hooks/useDatabase";

interface SearchAndFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  institutionNames: string[];
}

interface DropdownProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hasActiveFilters?: boolean;
}

const Dropdown = ({ title, icon, isOpen, onToggle, children, hasActiveFilters }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={onToggle}
        className={`flex items-center gap-2 bg-lavender border-lavender hover:bg-lavender/90 transition-colors text-lavender-foreground ${
          hasActiveFilters ? 'ring-2 ring-lavender shadow-md bg-lavender' : ''
        }`}
      >
        {icon}
        <span className="font-medium">{title}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-card border rounded-xl shadow-lg z-50 min-w-[320px] max-w-[400px] card-shadow">
          {children}
        </div>
      )}
    </div>
  );
};

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const FilterChip = ({ label, isSelected, onClick }: FilterChipProps) => (
  <Button
    size="sm"
    onClick={onClick}
    className={`text-sm transition-colors border ${
      isSelected 
      ? 'bg-lavender text-lavender-foreground hover:bg-lavender/90 border-lavender shadow-md' 
      : 'bg-lavender/50 hover:bg-lavender/70 border-lavender/60 text-lavender-foreground'
    }`}
  >
    {label}
  </Button>
);

export const SearchAndFilters = ({ filters, onFiltersChange, institutionNames }: SearchAndFiltersProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { data: locations } = useLocations();

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleArrayToggle = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    handleFilterChange(key, newArray);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const modes: Mode[] = ["text", "voice", "video", "offline"];
  const insuranceTypes: InsuranceType[] = ["private", "bpjs"];

  const getModeLabel = (mode: Mode) => {
    switch (mode) {
      case "text": return "Chat";
      case "voice": return "Voice Call";
      case "video": return "Video Call";
      case "offline": return "In Person";
    }
  };

  const getInsuranceLabel = (type: InsuranceType) => {
    switch (type) {
      case "private": return "Private";
      case "bpjs": return "BPJS";
    }
  };

  const hasLocationFilters = filters.locations.length > 0;
  const hasInstitutionFilters = filters.institutions.length > 0;
  const hasSpecializationFilters = filters.specializations.length > 0;
  const hasProfessionFilters = filters.professionTypes.length > 0;
  const hasSessionFilters = filters.modes.length > 0;
  const hasAdvancedFilters = filters.insurance.length > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 2000000;

  // Generate unique location options
  const locationOptions = locations ? 
    [...new Set(locations.map(loc => `${loc.city}, ${loc.country}`))].sort() : [];

  return (
    <div className="space-y-6">
      {/* Main Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Location Dropdown */}
        <Dropdown
          title="Location"
          icon={<MapPin className="h-4 w-4" />}
          isOpen={openDropdown === 'location'}
          onToggle={() => toggleDropdown('location')}
          hasActiveFilters={hasLocationFilters}
        >
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Location</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  City & Country
                </label>
                <div className="flex flex-wrap gap-2">
                  {locationOptions.slice(0, 8).map((location) => (
                    <FilterChip
                      key={location}
                      label={location}
                      isSelected={filters.locations.includes(location)}
                      onClick={() => handleArrayToggle("locations", location)}
                    />
                  ))}
                </div>
                {locationOptions.length > 8 && (
                  <Button variant="link" className="text-primary text-sm mt-2 p-0 h-auto">
                    Show {locationOptions.length - 8} more
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setOpenDropdown(null)}
                className="bg-primary text-primary-foreground hover:bg-primary-hover px-8"
              >
                Close
              </Button>
            </div>
          </div>
        </Dropdown>

        {/* Institution Dropdown */}
        <Dropdown
          title="Institution"
          icon={<Building2 className="h-4 w-4" />}
          isOpen={openDropdown === 'institution'}
          onToggle={() => toggleDropdown('institution')}
          hasActiveFilters={hasInstitutionFilters}
        >
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Institution</h3>
            
            <div className="flex flex-wrap gap-2">
              {institutionNames.map((name) => (
                <FilterChip
                  key={name}
                  label={name}
                  isSelected={filters.institutions.includes(name)}
                  onClick={() => handleArrayToggle("institutions", name)}
                />
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setOpenDropdown(null)}
                className="bg-primary text-primary-foreground hover:bg-primary-hover px-8"
              >
                Close
              </Button>
            </div>
          </div>
        </Dropdown>

        {/* Profession Type Dropdown */}
        <Dropdown
          title="Profession"
          icon={<Stethoscope className="h-4 w-4" />}
          isOpen={openDropdown === 'profession'}
          onToggle={() => toggleDropdown('profession')}
          hasActiveFilters={hasProfessionFilters}
        >
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Profession Type</h3>
            
            <div className="flex flex-wrap gap-2">
              {professionTypes.map((type) => (
                <FilterChip
                  key={type}
                  label={type}
                  isSelected={filters.professionTypes.includes(type)}
                  onClick={() => handleArrayToggle("professionTypes", type)}
                />
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setOpenDropdown(null)}
                className="bg-primary text-primary-foreground hover:bg-primary-hover px-8"
              >
                Close
              </Button>
            </div>
          </div>
        </Dropdown>

        {/* Specializations Dropdown */}
        <Dropdown
          title="Specializations"
          icon={<Stethoscope className="h-4 w-4" />}
          isOpen={openDropdown === 'specializations'}
          onToggle={() => toggleDropdown('specializations')}
          hasActiveFilters={hasSpecializationFilters}
        >
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Specializations</h3>
            
            <div className="flex flex-wrap gap-2">
              {specializations.map((spec) => (
                <FilterChip
                  key={spec}
                  label={spec}
                  isSelected={filters.specializations.includes(spec)}
                  onClick={() => handleArrayToggle("specializations", spec)}
                />
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setOpenDropdown(null)}
                className="bg-primary text-primary-foreground hover:bg-primary-hover px-8"
              >
                Close
              </Button>
            </div>
          </div>
        </Dropdown>

        {/* Session Mode Dropdown */}
        <Dropdown
          title="Session Mode"
          icon={<MessageSquare className="h-4 w-4" />}
          isOpen={openDropdown === 'session'}
          onToggle={() => toggleDropdown('session')}
          hasActiveFilters={hasSessionFilters}
        >
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Session Mode</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Formats offered
                </label>
                <div className="flex flex-wrap gap-2">
                  {modes.map((mode) => (
                    <FilterChip
                      key={mode}
                      label={getModeLabel(mode)}
                      isSelected={filters.modes.includes(mode)}
                      onClick={() => handleArrayToggle("modes", mode)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setOpenDropdown(null)}
                className="bg-primary text-primary-foreground hover:bg-primary-hover px-8"
              >
                Close
              </Button>
            </div>
          </div>
        </Dropdown>

        {/* Advanced Dropdown */}
        <Dropdown
          title="Advanced"
          icon={<Settings className="h-4 w-4" />}
          isOpen={openDropdown === 'advanced'}
          onToggle={() => toggleDropdown('advanced')}
          hasActiveFilters={hasAdvancedFilters}
        >
          <div className="p-6">
            <h3 className="font-semibold text-lg mb-4">Advanced Filters</h3>
            
            <div className="space-y-6">
              {/* Insurance */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Insurance
                </label>
                <div className="flex flex-wrap gap-2">
                  {insuranceTypes.map((ins) => (
                    <FilterChip
                      key={ins}
                      label={getInsuranceLabel(ins)}
                      isSelected={filters.insurance.includes(ins)}
                      onClick={() => handleArrayToggle("insurance", ins)}
                    />
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Session Cost (IDR)
                </label>
                <div className="space-y-4">
                  {/* Manual Input Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Minimum</label>
                      <Input
                        type="number"
                        value={filters.priceRange[0]}
                        onChange={(e) => {
                          const newMin = Math.max(0, parseInt(e.target.value) || 0);
                          const newMax = Math.max(newMin, filters.priceRange[1]);
                          handleFilterChange("priceRange", [newMin, newMax]);
                        }}
                        placeholder="0"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Maximum</label>
                      <Input
                        type="number"
                        value={filters.priceRange[1]}
                        onChange={(e) => {
                          const newMax = Math.min(2000000, parseInt(e.target.value) || 2000000);
                          const newMin = Math.min(newMax, filters.priceRange[0]);
                          handleFilterChange("priceRange", [newMin, newMax]);
                        }}
                        placeholder="2,000,000"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Visual Slider */}
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => handleFilterChange("priceRange", value as [number, number])}
                      max={2000000}
                      min={0}
                      step={50000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Rp 0</span>
                      <span>Rp 2,000,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setOpenDropdown(null)}
                className="bg-primary text-primary-foreground hover:bg-primary-hover px-8"
              >
                Close
              </Button>
            </div>
          </div>
        </Dropdown>

        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search keyword"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10 bg-accent/30 border-accent"
          />
        </div>
      </div>
    </div>
  );
};
