
import { useState } from "react";
import { FilterState, Specialization, Mode, BureauType, InsuranceType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { specializations } from "@/data/mockData";

interface SearchAndFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  bureauNames: string[];
}

export const SearchAndFilters = ({ filters, onFiltersChange, bureauNames }: SearchAndFiltersProps) => {
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
  const bureauTypes: BureauType[] = ["independent", "clinic", "faskes1", "faskes2"];
  const insuranceTypes: InsuranceType[] = ["none", "private", "bpjs"];

  const getModeLabel = (mode: Mode) => {
    switch (mode) {
      case "text": return "Text Session";
      case "voice": return "Voice Call";
      case "video": return "Video Call";
      case "offline": return "Offline Session";
    }
  };

  const getBureauTypeLabel = (type: BureauType) => {
    switch (type) {
      case "independent": return "Independent Bureau";
      case "clinic": return "Clinic";
      case "faskes1": return "Faskes 1";
      case "faskes2": return "Faskes 2";
    }
  };

  const getInsuranceLabel = (type: InsuranceType) => {
    switch (type) {
      case "none": return "No Insurance";
      case "private": return "Private Insurance";
      case "bpjs": return "BPJS";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or bureau..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bureau Names */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Bureau/Clinic</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {bureauNames.map((name) => (
                    <div key={name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bureau-${name}`}
                        checked={filters.bureauNames.includes(name)}
                        onCheckedChange={() => handleArrayToggle("bureauNames", name)}
                      />
                      <Label htmlFor={`bureau-${name}`} className="text-sm">{name}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Specialization</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {specializations.map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox
                        id={`spec-${spec}`}
                        checked={filters.specializations.includes(spec)}
                        onCheckedChange={() => handleArrayToggle("specializations", spec)}
                      />
                      <Label htmlFor={`spec-${spec}`} className="text-sm">{spec}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modes */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Session Mode</Label>
                <div className="space-y-2">
                  {modes.map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mode-${mode}`}
                        checked={filters.modes.includes(mode)}
                        onCheckedChange={() => handleArrayToggle("modes", mode)}
                      />
                      <Label htmlFor={`mode-${mode}`} className="text-sm">{getModeLabel(mode)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bureau Types */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Type</Label>
                <div className="space-y-2">
                  {bureauTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filters.types.includes(type)}
                        onCheckedChange={() => handleArrayToggle("types", type)}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm">{getBureauTypeLabel(type)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Insurance</Label>
                <div className="space-y-2">
                  {insuranceTypes.map((ins) => (
                    <div key={ins} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ins-${ins}`}
                        checked={filters.insurance.includes(ins)}
                        onCheckedChange={() => handleArrayToggle("insurance", ins)}
                      />
                      <Label htmlFor={`ins-${ins}`} className="text-sm">{getInsuranceLabel(ins)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
