
import { useState } from "react";
import { FilterState, Specialization, Mode, InsuranceType, ProfessionType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, ChevronDown } from "lucide-react";
import { specializations, professionTypes } from "@/data/mockData";

interface SearchAndFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  institutionNames: string[];
}

export const SearchAndFilters = ({ filters, onFiltersChange, institutionNames }: SearchAndFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

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

  const modes: Mode[] = ["text", "voice", "video", "offline"];
  const insuranceTypes: InsuranceType[] = ["none", "private", "bpjs"];

  const getModeLabel = (mode: Mode) => {
    switch (mode) {
      case "text": return "Chat";
      case "voice": return "Voice Call";
      case "video": return "Video Call";
      case "offline": return "Offline";
    }
  };

  const getInsuranceLabel = (type: InsuranceType) => {
    switch (type) {
      case "none": return "No Insurance";
      case "private": return "Private Insurance";
      case "bpjs": return "BPJS";
    }
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 hover:bg-muted/50 rounded px-2">
        <Label className="text-sm font-medium">{title}</Label>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 pb-2">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by practitioner name, institution name, city, or mode..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Institution Names */}
              <FilterSection title="Institution">
                {institutionNames.map((name) => (
                  <div key={name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`institution-${name}`}
                      checked={filters.institutions.includes(name)}
                      onCheckedChange={() => handleArrayToggle("institutions", name)}
                    />
                    <Label htmlFor={`institution-${name}`} className="text-sm cursor-pointer flex-1">
                      {name}
                    </Label>
                  </div>
                ))}
              </FilterSection>

              {/* Specializations */}
              <FilterSection title="Specialization">
                {specializations.map((spec) => (
                  <div key={spec} className="flex items-center space-x-2">
                    <Checkbox
                      id={`spec-${spec}`}
                      checked={filters.specializations.includes(spec)}
                      onCheckedChange={() => handleArrayToggle("specializations", spec)}
                    />
                    <Label htmlFor={`spec-${spec}`} className="text-sm cursor-pointer flex-1">
                      {spec}
                    </Label>
                  </div>
                ))}
              </FilterSection>

              {/* Session Modes */}
              <FilterSection title="Session Mode">
                {modes.map((mode) => (
                  <div key={mode} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mode-${mode}`}
                      checked={filters.modes.includes(mode)}
                      onCheckedChange={() => handleArrayToggle("modes", mode)}
                    />
                    <Label htmlFor={`mode-${mode}`} className="text-sm cursor-pointer flex-1">
                      {getModeLabel(mode)}
                    </Label>
                  </div>
                ))}
              </FilterSection>

              {/* Profession Types */}
              <FilterSection title="Profession Type">
                {professionTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`profession-${type}`}
                      checked={filters.professionTypes.includes(type)}
                      onCheckedChange={() => handleArrayToggle("professionTypes", type)}
                    />
                    <Label htmlFor={`profession-${type}`} className="text-sm cursor-pointer flex-1">
                      {type}
                    </Label>
                  </div>
                ))}
              </FilterSection>

              {/* Insurance */}
              <FilterSection title="Insurance">
                {insuranceTypes.map((ins) => (
                  <div key={ins} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ins-${ins}`}
                      checked={filters.insurance.includes(ins)}
                      onCheckedChange={() => handleArrayToggle("insurance", ins)}
                    />
                    <Label htmlFor={`ins-${ins}`} className="text-sm cursor-pointer flex-1">
                      {getInsuranceLabel(ins)}
                    </Label>
                  </div>
                ))}
              </FilterSection>
            </div>

            {/* Price Range Slider */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Price Range</Label>
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange("priceRange", value as [number, number])}
                  max={2000000}
                  min={0}
                  step={50000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Rp {filters.priceRange[0].toLocaleString()}</span>
                  <span>Rp {filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
