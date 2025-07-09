import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ChevronDown, Building2 } from "lucide-react";
import { UnifiedCard, UnifiedCardData } from "@/components/UnifiedCard";
import { FilterTags } from "@/components/FilterTags";
import { FilterState } from "@/types";

// Mock data for organizations and communities
const mockData = [
  {
    id: 1,
    name: "Indonesian Mental Health Association",
    image: "https://images.unsplash.com/photo-1486312338219-ce68e2c77734?w=400&h=300&fit=crop",
    type: "Education",
    city: "Jakarta"
  },
  {
    id: 2,
    name: "Youth Mental Wellness Community",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    type: "Community",
    city: "Bandung"
  },
  {
    id: 3,
    name: "Mindfulness Experience Center",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    type: "Experience",
    city: "Yogyakarta"
  },
  {
    id: 4,
    name: "Mental Health Education Foundation",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    type: "Education",
    city: "Surabaya"
  },
  {
    id: 5,
    name: "Wellness Warriors Community",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop",
    type: "Community",
    city: "Medan"
  },
  {
    id: 6,
    name: "Therapeutic Adventure Experiences",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    type: "Experience",
    city: "Bali"
  },
  {
    id: 7,
    name: "Mental Health Research Institute",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    type: "Education",
    city: "Jakarta"
  },
  {
    id: 8,
    name: "Healing Hearts Community",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
    type: "Community",
    city: "Makassar"
  },
  {
    id: 9,
    name: "Transformative Wellness Experiences",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    type: "Experience",
    city: "Semarang"
  }
];

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
        <div className="absolute top-full mt-2 left-0 bg-card border rounded-xl shadow-lg z-50 min-w-[280px] card-shadow">
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
      : 'bg-lavender/50 hover:bg-lavender/70 border-[hsl(var(--lavender-mist)/0.6)] text-lavender-foreground'
    }`}
  >
    {label}
  </Button>
);

const Organizations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Create filters state for FilterTags component
  const filters: FilterState = {
    search: searchTerm,
    locations: selectedCity !== "all" ? [selectedCity] : [],
    institutions: [],
    professionTypes: selectedType !== "all" ? [selectedType] : [],
    specializations: [],
    priceRange: [0, 2000000],
    modes: [],
    insurance: []
  };

  const handleRemoveFilter = (type: keyof FilterState, value: string) => {
    if (type === 'locations') {
      setSelectedCity("all");
    } else if (type === 'professionTypes') {
      setSelectedType("all");
    }
  };

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCity("all");
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.type.toLowerCase() === selectedType.toLowerCase();
    const matchesCity = selectedCity === "all" || item.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesType && matchesCity;
  });

  const uniqueCities = [...new Set(mockData.map(item => item.city))].sort();
  const types = ["Education", "Experience", "Community"];

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "education": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "experience": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "community": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6">
          <span className="gradient-text">Organizations</span> & Communities
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Connect with mental health organizations, educational institutions, and communities 
          dedicated to promoting mental wellness and providing support resources.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 sm:mb-10">
        <div className="bg-card rounded-xl p-6 card-shadow">
          <div className="flex flex-wrap items-center gap-3">
            {/* Organization Type Dropdown */}
            <Dropdown
              title="Type"
              icon={<Building2 className="h-4 w-4" />}
              isOpen={openDropdown === 'type'}
              onToggle={() => toggleDropdown('type')}
              hasActiveFilters={selectedType !== "all"}
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4">Organization Type</h3>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All Types"
                    isSelected={selectedType === "all"}
                    onClick={() => { setSelectedType("all"); setOpenDropdown(null); }}
                  />
                  {types.map((type) => (
                    <FilterChip
                      key={type}
                      label={type}
                      isSelected={selectedType.toLowerCase() === type.toLowerCase()}
                      onClick={() => { setSelectedType(type.toLowerCase()); setOpenDropdown(null); }}
                    />
                  ))}
                </div>
              </div>
            </Dropdown>

            {/* City Filter Dropdown */}
            <Dropdown
              title="City"
              icon={<MapPin className="h-4 w-4" />}
              isOpen={openDropdown === 'city'}
              onToggle={() => toggleDropdown('city')}
              hasActiveFilters={selectedCity !== "all"}
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All Cities"
                    isSelected={selectedCity === "all"}
                    onClick={() => { setSelectedCity("all"); setOpenDropdown(null); }}
                  />
                  {uniqueCities.map((city) => (
                    <FilterChip
                      key={city}
                      label={city}
                      isSelected={selectedCity.toLowerCase() === city.toLowerCase()}
                      onClick={() => { setSelectedCity(city.toLowerCase()); setOpenDropdown(null); }}
                    />
                  ))}
                </div>
              </div>
            </Dropdown>

            {/* Search Input */}
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-lavender-foreground placeholder:text-lavender-foreground border-lavender focus:outline-none focus:ring-2 focus:ring-lavender focus:border-lavender"
              />
            </div>
          </div>
        </div>
        
        {/* FilterTags component */}
        <div className="mt-4">
          <FilterTags
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            <span className="text-primary">{filteredData.length}</span> Organizations Found
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((item) => {
            const cardData: UnifiedCardData = {
              type: item.type === "Organization" ? "organization" : "community",
              id: item.id.toString(),
              image: item.image,
              name: item.name,
              city: item.city,
              organizationType: item.type
            };

            return (
              <UnifiedCard 
                key={item.id} 
                data={cardData} 
                linkTo={`/organizations/${item.id}`}
              />
            );
          })}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                No organizations found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any organizations matching your criteria. Try adjusting your search terms.
              </p>
              <Button onClick={() => { setSearchTerm(""); setSelectedType("all"); }}>
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organizations;
